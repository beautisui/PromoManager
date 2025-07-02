
namespace PromoManager.Models.Dtos
{
    public class Promo
    {
        public required List<long> ItemIds { get; set; }
        public required List<long> StoreIds { get; set; }
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
        public required long TacticId { get; set; }
    }
}