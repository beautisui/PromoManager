namespace PromoManager.Models.Entities;

public class PromotionDetails
{
    public long PromoId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public long TacticId { get; set; }
    public required string TacticType { get; set; }
}