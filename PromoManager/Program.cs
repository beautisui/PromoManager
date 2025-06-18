using Dapper;
using Microsoft.Data.Sqlite;
using PromoManager.Repository;
using PromoManager.Service;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddScoped<IPromoRepository, PromoRepository>();
builder.Services.AddScoped<IPromoService, PromoService>();

builder.Services.AddCors(options =>
    options.AddPolicy("AllowSpecificOrigin",
        corsPolicyBuilder => corsPolicyBuilder.WithOrigins("http://localhost:5173") 
            .AllowAnyHeader()
            .AllowAnyMethod()));

try
{
    using (var connection = new SqliteConnection(builder.Configuration.GetConnectionString("DefaultConnection")))
    {
        connection.Open();
        Console.WriteLine("Connection opened to DB file.");
        Console.WriteLine($"DB file path: {builder.Configuration.GetConnectionString("DefaultConnection")}");
        
        var tableCommand = @"
        CREATE TABLE IF NOT EXISTS Promotions (
            PromoId INTEGER PRIMARY KEY AUTOINCREMENT,
            Item TEXT NOT NULL,
            Store TEXT NOT NULL,
            StartDate TEXT NOT NULL,
            EndDate TEXT NOT NULL,
            Tactic TEXT NOT NULL
        );";

        connection.Execute(tableCommand);
        connection.Execute("select * from Promotions;");
        Console.WriteLine("Executed CREATE TABLE command.");
    }
}
catch (Exception ex)
{
    Console.WriteLine("Error while creating DB/table: " + ex.Message);
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
app.UseAuthorization();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");


app.Run();
