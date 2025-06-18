using PromoManager.Models.Entities;
using System.Data;
using Dapper;
using Microsoft.Data.Sqlite;

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


    public async Task<Promotion> AddPromotion(Promotion promotion)
    {
        using var connection = CreateConnection();

        var query = @"
            INSERT INTO Promotions (Item, Store, StartDate, EndDate, Tactic) 
            VALUES (@Item, @Store, @StartDate, @EndDate, @Tactic);
            SELECT last_insert_rowid()";

        var insertedId = await connection.ExecuteScalarAsync<long>(query, promotion);

        var recentlyAddedPromo = await connection.QuerySingleAsync<Promotion>(
            "SELECT * FROM Promotions WHERE PromoId = @Id",
            new { Id = insertedId });

        return recentlyAddedPromo;
    }
}