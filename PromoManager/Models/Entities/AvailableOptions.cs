namespace PromoManager.Models.Entities;

public class AvailableOptions
{
    public IEnumerable<Item> Items { get; set; } 
    public IEnumerable<Store> Stores { get; set; } 
    public IEnumerable<Tactic> Tactics { get; set; } 
}