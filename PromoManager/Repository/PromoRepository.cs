using PromoManager.Models.Entities;
using System.Data;
using Dapper;
using Microsoft.Data.Sqlite;
using PromoManager.Models.Dtos;

namespace PromoManager.Repository;

public class PromoRepository : IPromoRepository
{
    private readonly IConfiguration _configure;

    public PromoRepository(IConfiguration configuration)
    {
        _configure = configuration;
    }

    private IDbConnection CreateConnection()
    {
        Console.WriteLine($"DB file path: {_configure.GetConnectionString("DefaultConnection")}");
        return new SqliteConnection(_configure.GetConnectionString("DefaultConnection"));
    }
    
    public async Task<IEnumerable<Promotion>> GetAllPromotions()
    {
        using var connection = CreateConnection();
        var query = "SELECT * FROM Promotions;";
        return await connection.QueryAsync<Promotion>(query);
    }


    public async Task<Promotion> AddPromotion(PromoDTO dto)
    {
        using var connection = CreateConnection();
        connection.Open();
        using var tx = connection.BeginTransaction();

        try
        {
            //Insert Promotion
            var insertPromo = @"
            INSERT INTO Promotions (StartDate, EndDate, TacticId)
            VALUES (@StartDate, @EndDate, @TacticId);
            SELECT last_insert_rowid();";

            var promoId = await connection.ExecuteScalarAsync<long>(
                insertPromo, new { dto.StartDate, dto.EndDate, dto.TacticId }, tx);

            //Insert into PromoItems
            foreach (var itemId in dto.ItemIds)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO PromoItems (PromoId, ItemId) VALUES (@PromoId, @ItemId);",
                    new { PromoId = promoId, ItemId = itemId }, tx);
            }

            //Insert into PromoStores
            foreach (var storeId in dto.StoreIds)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO PromoStores (PromoId, StoreId) VALUES (@PromoId, @StoreId);",
                    new { PromoId = promoId, StoreId = storeId }, tx);
            }

            tx.Commit();

            //Return promotion
            var promotion = await connection.QuerySingleAsync<Promotion>(
                "SELECT * FROM Promotions WHERE PromoId = @Id", new { Id = promoId });

            return promotion;
        }
        catch
        {
            tx.Rollback();
            throw;
        }
    }

}