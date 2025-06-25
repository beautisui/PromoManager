using Dapper;
using Microsoft.Data.Sqlite;
using PromoManager.Repository;
using PromoManager.Service;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddScoped<IPromoRepository, PromoRepository>();
builder.Services.AddScoped<IPromoService, PromoService>();
builder.Services.AddCors(options =>
    options.AddPolicy("AllowAnyOrigin", // Give your policy a meaningful name
        corsPolicyBuilder => corsPolicyBuilder.AllowAnyOrigin() // This is the key change
            .AllowAnyHeader()
            .AllowAnyMethod()));

try
{
    using var connection = new SqliteConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    connection.Open();
    Console.WriteLine("Connected to DB.");

    var tableCommands = new[]
    {
        @"
        CREATE TABLE IF NOT EXISTS Stores (
            StoreId INTEGER PRIMARY KEY AUTOINCREMENT,
            StoreName TEXT NOT NULL UNIQUE
        );",
        @"
        CREATE TABLE IF NOT EXISTS Items (
            ItemId INTEGER PRIMARY KEY AUTOINCREMENT,
            ItemName TEXT NOT NULL UNIQUE
        );",
        @"
        CREATE TABLE IF NOT EXISTS Tactics (
            TacticId INTEGER PRIMARY KEY AUTOINCREMENT,
            TacticType TEXT NOT NULL UNIQUE
        );",

        @"
        CREATE TABLE IF NOT EXISTS Promotions (
            PromoId INTEGER PRIMARY KEY AUTOINCREMENT,
            StartDate TEXT NOT NULL,
            EndDate TEXT NOT NULL,
            TacticId INTEGER NOT NULL,
            FOREIGN KEY (TacticId) REFERENCES Tactics(TacticId)
        );",

        @"
        CREATE TABLE IF NOT EXISTS PromoItems (
            PromoId INTEGER NOT NULL,
            ItemId INTEGER NOT NULL,
            PRIMARY KEY (PromoId, ItemId),
            FOREIGN KEY (PromoId) REFERENCES Promotions(PromoId),
            FOREIGN KEY (ItemId) REFERENCES Items(ItemId)
        );",
        @"
        CREATE TABLE IF NOT EXISTS PromoStores (
            PromoId INTEGER NOT NULL,
            StoreId INTEGER NOT NULL,
            PRIMARY KEY (PromoId, StoreId),
            FOREIGN KEY (PromoId) REFERENCES Promotions(PromoId),
            FOREIGN KEY (StoreId) REFERENCES Stores(StoreId)
        );"
    };

    foreach (var cmd in tableCommands)
    {
        connection.Execute(cmd);
    }

    Console.WriteLine("Tables created successfully.");

    var storingStaticDataCommand = new[]
    {
        @"INSERT OR IGNORE INTO Stores (StoreName) VALUES 
            ('Store1'), ('Store2'), ('Store3'), ('Store4'), ('Store5');",

        @"INSERT OR IGNORE INTO Items (ItemName) VALUES 
            ('Pen'), ('Pencil'), ('Notebook'), 
            ('Chips'), ('Chocolate'), ('Ice cream');",

        @"INSERT OR IGNORE INTO Tactics (TacticType) VALUES 
            ('25% off'), ('1$ off'), ('BOGO Free');"
    };

    foreach (var data in storingStaticDataCommand)
    {
        connection.Execute(data);
    }

    Console.WriteLine("Seeded static data.");
}
catch (Exception ex)
{
    Console.WriteLine("error in setting up database: " + ex.Message);
}


var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowSpecificOrigin");
app.UseAuthorization();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");


app.Run();
