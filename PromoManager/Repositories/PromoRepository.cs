using System.Data;
using Dapper;
using Microsoft.Data.Sqlite;
using PromoManager.Models.Entities;

namespace PromoManager.Repositories;

public class PromoRepository(IConfiguration configuration) : IPromoRepository
{
    private IDbConnection CreateConnection()
    {
        Console.WriteLine($"DB file path: {configuration.GetConnectionString("DefaultConnection")}");
        return new SqliteConnection(configuration.GetConnectionString("DefaultConnection"));
    }

    public async Task<PromotionResponse?> GetPromotionById(long promoId)
    {
        using var connection = CreateConnection();

        var promo = await connection.QueryFirstOrDefaultAsync<Promotion>(
            @"SELECT * FROM Promotions WHERE PromoId = @PromoId", new { PromoId = promoId });

        if (promo == null)
            return null;

        var itemsDict = await GetItemsForPromos(connection, new List<long> { promo.PromoId });
        var storesDict = await GetStoresForPromos(connection, new List<long> { promo.PromoId });
        var tacticsDict = await GetTacticsForPromos(connection, new List<long> { promo.TacticId });

        return new PromotionResponse
        {
            PromoId = promo.PromoId,
            StartDate = promo.StartDate,
            EndDate = promo.EndDate,
            Items = itemsDict.GetValueOrDefault(promo.PromoId) ?? new List<Item>(),
            Stores = storesDict.GetValueOrDefault(promo.PromoId) ?? new List<Store>(),
            Tactic = tacticsDict.GetValueOrDefault(promo.TacticId, new Tactic())
        };
    }

    private List<PromotionResponse> SortPromotions(List<PromotionResponse> promotions, string sortBy, string sortOrder)
    {
        return sortBy.ToLower() switch
        {
            "items" => (sortOrder == "asc"
                    ? promotions.OrderBy(p => string.Join(",", p.Items.Select(i => i.Name)))
                    : promotions.OrderByDescending(p => string.Join(",", p.Items.Select(i => i.Name)))
                ).ToList(),

            "stores" => (sortOrder == "asc"
                    ? promotions.OrderBy(p => string.Join(",", p.Stores.Select(s => s.Name)))
                    : promotions.OrderByDescending(p => string.Join(",", p.Stores.Select(s => s.Name)))
                ).ToList(),

            _ => promotions
        };
    }

    public async Task<IEnumerable<PromotionResponse>> GetPromotionsBy(PromoFilterRequest request)
    {
        using var connection = CreateConnection();

        var sql = @"
        SELECT DISTINCT p.*
        FROM Promotions p
        LEFT JOIN PromoItems pi ON p.PromoId = pi.PromoId
        LEFT JOIN Items i ON pi.ItemId = i.ItemId
        LEFT JOIN PromoStores ps ON p.PromoId = ps.PromoId
        LEFT JOIN Stores s ON ps.StoreId = s.StoreId
        LEFT JOIN Tactics t ON p.TacticId = t.TacticId
        WHERE 1=1";

        var parameters = new DynamicParameters();

        if (request.Filters != null && request.Filters.Any())
        {
            foreach (var filter in request.Filters)
            {
                var whereClause = GetWhereClauseForFilter(filter, parameters);
                sql += $" AND {whereClause}";

            }
        }

        if (!string.IsNullOrEmpty(request.SortBy))
        {
            var validSortColumns = GetValidSortColumns();
            if (!string.IsNullOrEmpty(request.SortBy) &&
                validSortColumns.TryGetValue(request.SortBy, out var sortColumn))
            {
                sql += $" ORDER BY {sortColumn} {(request.SortOrder?.ToUpper() == "DESC" ? "DESC" : "ASC")}";
            }
        }

        Console.WriteLine("Generated SQL---------------------------------------------------------------: " + sql);

        var promotions = (await connection.QueryAsync<Promotion>(sql, parameters)).ToList();

        if (!promotions.Any())
            return new List<PromotionResponse>();

        var promoIds = promotions.Select(p => p.PromoId).ToList();
        var tacticIds = promotions.Select(p => p.TacticId).Distinct().ToList();

        var itemsDict = await GetItemsForPromos(connection, promoIds);
        var storesDict = await GetStoresForPromos(connection, promoIds);
        var tacticsDict = await GetTacticsForPromos(connection, tacticIds);

        var promotionData = promotions.Select(promo => new PromotionResponse
        {
            PromoId = promo.PromoId,
            StartDate = promo.StartDate,
            EndDate = promo.EndDate,
            Items = itemsDict.TryGetValue(promo.PromoId, out var items) ? items : new List<Item>(),
            Stores = storesDict.TryGetValue(promo.PromoId, out var stores) ? stores : new List<Store>(),
            Tactic = tacticsDict.TryGetValue(promo.TacticId, out var tactic) ? tactic : new Tactic()
        }).ToList();

        return SortPromotions(promotionData, request.SortBy, request.SortOrder);
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

        return await connection.ExecuteScalarAsync<long>(insertPromo, new { dto.StartDate, dto.EndDate, dto.TacticId },
            tx);
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

    private async Task InsertPromoStores(IDbConnection connection, IDbTransaction tx, long promoId,
        IEnumerable<long>? storeIds)
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

            var affected = await connection.ExecuteAsync("DELETE FROM Promotions WHERE PromoId = @promoId",
                new { promoId }, tx);

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

    private Dictionary<string, string> GetValidSortColumns()
    {
        return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { "promoid", "p.PromoId" },
            { "startdate", "p.StartDate" },
            { "enddate", "p.EndDate" },
            { "tactic", "t.TacticType" }
        };
    }

    private static string GetWhereClauseForFilter(PromoFilterModel filter, DynamicParameters parameters)
    {
        switch (filter.Field.ToLower())
        {
            case "promoid":
                parameters.Add("@PromoIds", filter.Values.Select(int.Parse).ToList());
                return "p.PromoId IN @PromoIds";

            case "items":
                parameters.Add("@ItemNames", filter.Values);
                return "i.ItemName IN @ItemNames";

            case "stores":
                parameters.Add("@StoreNames", filter.Values);
                return "s.StoreName IN @StoreNames";

            case "tactic":
                parameters.Add("@TacticTypes", filter.Values);
                return "t.TacticType IN @TacticTypes";

            case "startdate":
                parameters.Add("@StartFrom", filter.Values[0]);
                parameters.Add("@StartTo", filter.Values[1]);
                return "p.StartDate BETWEEN @StartFrom AND @StartTo";

            case "enddate":
                parameters.Add("@EndFrom", filter.Values[0]);
                parameters.Add("@EndTo", filter.Values[1]);
                return "p.EndDate BETWEEN @EndFrom AND @EndTo";

            default:
                throw new ArgumentException($"Invalid filter field {filter.Field}");
        }
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

    public async Task<PromotionResponse?> EditPromotion(EditPromo request)
    {
        using var connection = CreateConnection();
        connection.Open();
        using var tx = connection.BeginTransaction();

        try
        {
            const string updatePromoSql = @"
        UPDATE Promotions
        SET StartDate = COALESCE(@StartDate, StartDate),
            EndDate = COALESCE(@EndDate, EndDate),
            TacticId = COALESCE(@TacticId, TacticId)
        WHERE PromoId = @PromoId;";

            var rowsAffected = await connection.ExecuteAsync(updatePromoSql, new
            {
                request.StartDate,
                request.EndDate,
                request.TacticId,
                request.PromoId
            }, tx);

            if (rowsAffected == 0)
            {
                return null;
            }

            if (request.ItemIds != null)
            {
                await connection.ExecuteAsync("DELETE FROM PromoItems WHERE PromoId = @PromoId",
                    new { request.PromoId }, tx);

                const string insertItemSql = "INSERT INTO PromoItems (PromoId, ItemId) VALUES (@PromoId, @ItemId)";
                foreach (var itemId in request.ItemIds)
                {
                    await connection.ExecuteAsync(insertItemSql, new { request.PromoId, ItemId = itemId }, tx);
                }
            }

            if (request.StoreIds != null)
            {
                await connection.ExecuteAsync("DELETE FROM PromoStores WHERE PromoId = @PromoId",
                    new { request.PromoId }, tx);

                const string insertStoreSql = "INSERT INTO PromoStores (PromoId, StoreId) VALUES (@PromoId, @StoreId)";
                foreach (var storeId in request.StoreIds)
                {
                    await connection.ExecuteAsync(insertStoreSql, new { request.PromoId, StoreId = storeId }, tx);
                }
            }

            tx.Commit();

            Console.WriteLine("Promo Edit Done👍");
            return await GetPromotionById(request.PromoId);
        }
        catch
        {
            tx.Rollback();
            throw;
        }
    }


}