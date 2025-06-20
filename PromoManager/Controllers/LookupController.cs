using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace PromoManager.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LookupController : ControllerBase
{
    private readonly string? _cnx;

    public LookupController(IConfiguration configure)
    {
        _cnx = configure.GetConnectionString("DefaultConnection");
    }

    [HttpGet("items")]
    public async Task<IActionResult> GetItems()
    {
        using var db = new SqliteConnection(_cnx);
        var rows = await db.QueryAsync("SELECT ItemId, ItemName FROM Items;");
        return Ok(rows);
    }

    [HttpGet("stores")]
    public async Task<IActionResult> GetStores()
    {
        using var db = new SqliteConnection(_cnx);
        var rows = await db.QueryAsync("SELECT StoreId, StoreName FROM Stores;");
        return Ok(rows);
    }

    [HttpGet("tactics")]
    public async Task<IActionResult> GetTactics()
    {
        using var db = new SqliteConnection(_cnx);
        var rows = await db.QueryAsync("SELECT TacticId, TacticType FROM Tactics;");
        return Ok(rows);
    }
    
    [HttpGet("availableOptions")]
public async Task<IActionResult> GetAvailableOptions()
{
    using var db = new SqliteConnection(_cnx);
    Console.WriteLine("Inside GetAvailableOptions");

    var items = await db.QueryAsync("SELECT ItemId AS Id, ItemName AS Name FROM Items;");
    var stores = await db.QueryAsync("SELECT StoreId AS Id, StoreName AS Name FROM Stores;");
    var tactics = await db.QueryAsync("SELECT TacticId AS Id, TacticType AS Type FROM Tactics;");

    var result = new
    {
        items,
        stores,
        tactics
    };

    return Ok(result);
}
}