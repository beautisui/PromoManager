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

    public async Task<IEnumerable<PromotionResponse>> GetAllPromotions()
    {
        using var connection = CreateConnection();

        var promotions = await connection.QueryAsync<(long PromoId, DateTime StartDate, DateTime EndDate, long TacticId, string TacticType)>(
            @"SELECT p.PromoId, p.StartDate, p.EndDate, t.TacticId, t.TacticType
          FROM Promotions p
          JOIN Tactics t ON p.TacticId = t.TacticId
          ORDER BY p.PromoId desc ");

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

        
        var promoStores =  connection.Query<(long PromoId, long Id, string Name)>(
            @"SELECT ps.PromoId, s.StoreId AS Id, s.StoreName AS Name
            FROM PromoStores ps
            JOIN Stores s ON ps.StoreId = s.StoreId 
             ORDER BY Name")
            .GroupBy(row => row.PromoId)
            .ToDictionary(promoStore => promoStore.Key, promoStore => promoStore
                .Select(pi => new Store { Id = pi.Id, Name = pi.Name }));

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
        });

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
}
