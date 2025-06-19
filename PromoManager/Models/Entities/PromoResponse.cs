namespace PromoManager.Models.Entities;

public class PromotionResponse
{
    public long PromoId { get; set; }
    public List<Item> Items { get; set; }
    public List<Store> Stores { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public Tactic Tactic { get; set; }
}
