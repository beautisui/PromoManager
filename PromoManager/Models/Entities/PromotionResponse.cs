namespace PromoManager.Models.Entities;

public class PromotionResponse
{
    public long PromoId { get; set; }
    public required List<Item> Items { get; set; }
    public required List<Store> Stores { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public required Tactic Tactic { get; set; }

}
