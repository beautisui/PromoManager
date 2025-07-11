namespace PromoManager.Models.Entities;

public class PromoFilterRequest
{
    public List<PromoFilterModel> Filters { get; set; }
    public string SortBy { get; set; } = "promoId";
    public string SortOrder { get; set; } = "desc";
}