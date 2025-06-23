using PromoManager.Models.Entities;
using PromoManager.Models.Dtos;
using System.Data;
using Dapper;
using Microsoft.Data.Sqlite;

namespace PromoManager.Repository;

public class PromoRepository(IConfiguration configuration) : IPromoRepository
{
    private IDbConnection CreateConnection()
    {
        Console.WriteLine($"DB file path: {configuration.GetConnectionString("DefaultConnection")}");
        return new SqliteConnection(configuration.GetConnectionString("DefaultConnection"));
    }

   public async Task<IEnumerable<PromotionResponse>> GetAllPromotions(string sortBy, string sortOrder)
{
    using var connection = CreateConnection();

    var orderByClause = sortBy.ToLower() switch
    {
        "starttime" => $"p.StartDate {sortOrder}",
        "endtime" => $"p.EndDate {sortOrder}",
        "tactic" => $"t.TacticType {sortOrder}",
        "items" or "stores" => null,
        _ => $"p.PromoId {sortOrder}"
    };

    var sql = @"SELECT p.PromoId, p.StartDate, p.EndDate, t.TacticId, t.TacticType
                FROM Promotions p
                JOIN Tactics t ON p.TacticId = t.TacticId";
    if (orderByClause != null)
        sql += $" ORDER BY {orderByClause}";

    var promotions = await connection.QueryAsync<(long PromoId, DateTime StartDate, DateTime EndDate, long TacticId, string TacticType)>(sql);

    var promoItems = connection.Query<(long PromoId, long Id, string Name)>(
            @"SELECT pi.PromoId, i.ItemId AS Id, i.ItemName AS Name
              FROM PromoItems pi
              JOIN Items i ON pi.ItemId = i.ItemId
              ORDER BY Name")
        .GroupBy(row => row.PromoId)
        .ToDictionary(
            group => group.Key,
            group => group.Select(pi => new Item { Id = pi.Id, Name = pi.Name })
        );

    var promoStores = connection.Query<(long PromoId, long Id, string Name)>(
            @"SELECT ps.PromoId, s.StoreId AS Id, s.StoreName AS Name
              FROM PromoStores ps
              JOIN Stores s ON ps.StoreId = s.StoreId
              ORDER BY Name")
        .GroupBy(row => row.PromoId)
        .ToDictionary(
            group => group.Key,
            group => group.Select(ps => new Store { Id = ps.Id, Name = ps.Name })
        );

    var AllPromoDetails = promotions.Select(p => new PromotionResponse
    {
        PromoId = p.PromoId,
        StartTime = p.StartDate,
        EndTime = p.EndDate,
        Tactic = new Tactic
        {
            TacticId = p.TacticId,
            Type = p.TacticType
        },
        Items = promoItems[p.PromoId].ToList(),
        Stores = promoStores[p.PromoId].ToList()

    }).ToList();

    if (sortBy == "items")
    {
        AllPromoDetails = (sortOrder == "asc"
            ? AllPromoDetails.OrderBy(p => string.Join(",", p.Items.Select(i => i.Name)))
            : AllPromoDetails.OrderByDescending(p => string.Join(",", p.Items.Select(i => i.Name)))
        ).ToList();
    }
    else if (sortBy == "stores")
    {
        AllPromoDetails = (sortOrder == "asc"
            ? AllPromoDetails.OrderBy(p => string.Join(",", p.Stores.Select(s => s.Name)))
            : AllPromoDetails.OrderByDescending(p => string.Join(",", p.Stores.Select(s => s.Name)))
        ).ToList();
    }

    return AllPromoDetails;
}
                                                 
    public async Task<long> AddPromotion(Promo dto)
    {
        using var connection = CreateConnection();
        connection.Open();
        using var tx = connection.BeginTransaction();
    
        try
        {
            var insertPromo = @"
            INSERT INTO Promotions (StartDate, EndDate, TacticId)
            VALUES (@StartDate, @EndDate, @TacticId);
            SELECT last_insert_rowid();";
    
            var promoId = await connection.ExecuteScalarAsync<long>(
                insertPromo, new { dto.StartDate, dto.EndDate, dto.TacticId }, tx);
    
            foreach (var itemId in dto.ItemIds ?? Enumerable.Empty<long>())
            {
                await connection.ExecuteAsync(
                    "INSERT INTO PromoItems (PromoId, ItemId) VALUES (@PromoId, @ItemId);",
                    new { PromoId = promoId, ItemId = itemId }, tx);
            }
    
            foreach (var storeId in dto.StoreIds ?? Enumerable.Empty<long>())
            {
                await connection.ExecuteAsync(
                    "INSERT INTO PromoStores (PromoId, StoreId) VALUES (@PromoId, @StoreId);",
                    new { PromoId = promoId, StoreId = storeId }, tx);
            }
    
            tx.Commit();
    
            var promotion = await connection.QuerySingleAsync<Promotion>(
                "SELECT * FROM Promotions WHERE PromoId = @Id", new { Id = promoId });
    
            
            Console.WriteLine($"========================================> {promoId}");
            return promoId;
        }
        catch
        {
            tx.Rollback();
            throw;
        }
    }

    public async Task<long> DeletePromotion(long promoId)
    {
        using var connection = CreateConnection();
        connection.Open();
        using var tx = connection.BeginTransaction();

        try
        {
            await connection.ExecuteAsync("DELETE FROM PromoItems WHERE PromoId = @promoId", new { promoId }, tx);
            await connection.ExecuteAsync("DELETE FROM PromoStores WHERE PromoId = @promoId", new { promoId }, tx);
            await connection.ExecuteAsync("DELETE FROM Promotions WHERE PromoId = @promoId", new { promoId }, tx);

             tx.Commit();
            return promoId;
        }
        catch
        {
             tx.Rollback();
            throw;
        }
    }

}