using Dapper;
using Microsoft.Data.Sqlite;
using PromoManager.Models.Entities;
using System.Data;
using Microsoft.AspNetCore.Mvc;

namespace PromoManager.Repository
{
    public class LookupRepository : ILookupRepository
    {
        private readonly string? _cnx;

        public LookupRepository(IConfiguration config)
        {
            _cnx = config.GetConnectionString("DefaultConnection");
        }

        private IDbConnection CreateConnection() => new SqliteConnection(_cnx);

        public async Task<IEnumerable<Item>> GetItems()
        {
            using var db = CreateConnection();
            return await db.QueryAsync<Item>("SELECT ItemId AS Id, ItemName AS Name FROM Items;");
        }

        public async Task<IEnumerable<Store>> GetStores()
        {
            using var db = CreateConnection();
            return await db.QueryAsync<Store>("SELECT StoreId AS Id, StoreName AS Name FROM Stores;");
        }

        public async Task<IEnumerable<Tactic>> GetTactics()
        {
            using var db = CreateConnection();
            return await db.QueryAsync<Tactic>("SELECT TacticId AS TacticId, TacticType AS Type FROM Tactics;");
        }


        public async Task<IEnumerable<long>> GetPromoIds()
        {
            using var db = CreateConnection();
            return await db.QueryAsync<long>("SELECT PromoId FROM Promotions;");
        }

        public async Task<IEnumerable<FilterOption>> GetFilterOptions(string field)
        {
            using var db = CreateConnection();
            Console.WriteLine($"This is inside lookup filter =========> {field}");

            string query = field.ToLower() switch
            {
                "promoid" => "SELECT DISTINCT PromoId AS Id FROM Promotions;",

                "items" => @"
            SELECT DISTINCT i.ItemId AS Id, i.ItemName AS Name
            FROM PromoItems pi
            JOIN Items i ON pi.ItemId = i.ItemId;",

                "stores" => @"
            SELECT DISTINCT s.StoreId AS Id, s.StoreName AS Name
            FROM PromoStores ps
            JOIN Stores s ON ps.StoreId = s.StoreId;",

                "tactic" => @"
            SELECT DISTINCT t.TacticId AS Id, t.TacticType AS type
            FROM Promotions p
            JOIN Tactics t ON p.TacticId = t.TacticId;",

                _ => throw new ArgumentException("Invalid field specified for filtering options.")
            };


            var response = await db.QueryAsync<FilterOption>(query);
            Console.WriteLine($"+++++++++++++++++++++++++++++++ this is the response for filter {String.Join(", ", response)}");

            return response;
        }

    }
}
