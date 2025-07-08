

namespace PromoManager.Models.Entities;

public class EditPromo
{
    public long PromoId { get; set; }
    public List<long>? ItemIds { get; set; }
    public List<long>? StoreIds { get; set; }
    public long? TacticId { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
};
