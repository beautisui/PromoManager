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
        string promoDetailsQuery = GetPromoDetailsQuery(orderByClause);

        var promotions = await connection.QueryAsync<(long PromoId, DateTime StartDate, DateTime EndDate, long TacticId, string TacticType)>(promoDetailsQuery);

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

    private static string GetPromoDetailsQuery(string? orderByClause)
    {
        var sql = @"SELECT p.PromoId, p.StartDate, p.EndDate, t.TacticId, t.TacticType
                FROM Promotions p
                JOIN Tactics t ON p.TacticId = t.TacticId";
        if (orderByClause != null)
            sql += $" ORDER BY {orderByClause}";
        return sql;
    }

    public async Task<long> AddPromotion(Promo dto)
    {
        using var connection = CreateConnection();
        connection.Open();
        using var tx = connection.BeginTransaction();

        try
        {
            var promoId = await InsertPromotion(connection, tx, dto);
            await InsertPromoItems(connection, tx, promoId, dto.ItemIds);
            await InsertPromoStores(connection, tx, promoId, dto.StoreIds);

            tx.Commit();
            return promoId;
        }
        catch
        {
            tx.Rollback();
            throw;
        }
    }

    private async Task<long> InsertPromotion(IDbConnection connection, IDbTransaction tx, Promo dto)
    {
        const string insertPromo = @"
        INSERT INTO Promotions (StartDate, EndDate, TacticId)
        VALUES (@StartDate, @EndDate, @TacticId);
        SELECT last_insert_rowid();";

        return await connection.ExecuteScalarAsync<long>(insertPromo, new { dto.StartDate, dto.EndDate, dto.TacticId }, tx);
    }

    private async Task InsertPromoItems(IDbConnection connection, IDbTransaction tx, long promoId, IEnumerable<long>? itemIds)
    {
        if (itemIds is null) return;

        const string insertItem = "INSERT INTO PromoItems (PromoId, ItemId) VALUES (@PromoId, @ItemId);";

        foreach (var itemId in itemIds)
        {
            await connection.ExecuteAsync(insertItem, new { PromoId = promoId, ItemId = itemId }, tx);
        }
    }
    private async Task InsertPromoStores(IDbConnection connection, IDbTransaction tx, long promoId, IEnumerable<long>? storeIds)
    {
        if (storeIds is null) return;

        const string insertStore = "INSERT INTO PromoStores (PromoId, StoreId) VALUES (@PromoId, @StoreId);";

        foreach (var storeId in storeIds)
        {
            await connection.ExecuteAsync(insertStore, new { PromoId = promoId, StoreId = storeId }, tx);
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

            var affected = await connection.ExecuteAsync("DELETE FROM Promotions WHERE PromoId = @promoId", new { promoId }, tx);

            if (affected == 0)
            {
                tx.Rollback();
                throw new KeyNotFoundException($"Promotion with ID {promoId} not found.");
            }

            tx.Commit();
            return promoId;
        }
        catch
        {
            tx.Rollback();
            throw;
        }
    }

    public async Task<IEnumerable<PromotionResponse>> FilterPromotions(string field, List<string> values)
    {
        using var connection = CreateConnection();

        string query = field.ToLower() switch
        {
            "promoid" => "SELECT * FROM Promotions WHERE PromoId IN @Values",
            "items" => @"SELECT DISTINCT p.*
                     FROM Promotions p
                     JOIN PromoItems pi ON p.PromoId = pi.PromoId
                     JOIN Items i ON pi.ItemId = i.ItemId
                     WHERE i.ItemName IN @Values",
            "stores" => @"SELECT DISTINCT p.*
                      FROM Promotions p
                      JOIN PromoStores ps ON p.PromoId = ps.PromoId
                      JOIN Stores s ON ps.StoreId = s.StoreId
                      WHERE s.StoreName IN @Values",
            "tactic" => @"SELECT p.*
                      FROM Promotions p
                      JOIN Tactics t ON p.TacticId = t.TacticId
                      WHERE t.TacticType IN @Values",
            _ => throw new ArgumentException("Invalid filter field")
        };

        var promos = (await connection.QueryAsync<Promotion>(query, new { Values = values })).ToList();

        if (!promos.Any())
            return new List<PromotionResponse>();

        var promoIds = promos.Select(p => p.PromoId).ToList();
        var tacticIds = promos.Select(p => p.TacticId).Distinct().ToList();

        var itemsDict = await GetItemsForPromos(connection, promoIds);
        var storesDict = await GetStoresForPromos(connection, promoIds);
        var tacticsDict = await GetTacticsForPromos(connection, tacticIds);

        var filteredPromo = promos.Select(promo => new PromotionResponse
        {
            PromoId = promo.PromoId,
            StartTime = promo.StartDate,
            EndTime = promo.EndDate,
            Items = itemsDict.TryGetValue(promo.PromoId, out var items) ? items : new List<Item>(),
            Stores = storesDict.TryGetValue(promo.PromoId, out var stores) ? stores : new List<Store>(),
            Tactic = tacticsDict.TryGetValue(promo.TacticId, out var tactic) ? tactic : null
        });

        return filteredPromo;
    }

    private async Task<Dictionary<long, Tactic>> GetTacticsForPromos(IDbConnection connection, List<long> tacticIds)
    {
        var tactics = await connection.QueryAsync<Tactic>(
            @"SELECT TacticId, TacticType AS Type
          FROM Tactics
          WHERE TacticId IN @TacticIds",
            new { TacticIds = tacticIds });

        return tactics.ToDictionary(t => t.TacticId, t => t);
    }

    private async Task<Dictionary<long, List<Store>>> GetStoresForPromos(IDbConnection connection, List<long> promoIds)
    {
        var stores = await connection.QueryAsync<(long PromoId, long StoreId, string StoreName)>(
            @"SELECT ps.PromoId, s.StoreId, s.StoreName
          FROM PromoStores ps
          JOIN Stores s ON ps.StoreId = s.StoreId
          WHERE ps.PromoId IN @PromoIds",
            new { PromoIds = promoIds });

        return stores
            .GroupBy(x => x.PromoId)
            .ToDictionary(
                g => g.Key,
                g => g.Select(s => new Store { Id = s.StoreId, Name = s.StoreName }).ToList()
            );
    }
    private async Task<Dictionary<long, List<Item>>> GetItemsForPromos(IDbConnection connection, List<long> promoIds)
    {
        var items = await connection.QueryAsync<(long PromoId, long ItemId, string ItemName)>(
            @"SELECT pi.PromoId, i.ItemId, i.ItemName
          FROM PromoItems pi
          JOIN Items i ON pi.ItemId = i.ItemId
          WHERE pi.PromoId IN @PromoIds",
            new { PromoIds = promoIds });

        return items
            .GroupBy(x => x.PromoId)
            .ToDictionary(
                g => g.Key,
                g => g.Select(i => new Item { Id = i.ItemId, Name = i.ItemName }).ToList()
            );
    }


}