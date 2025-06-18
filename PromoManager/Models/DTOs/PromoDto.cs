// Models/Dtos/PromoDTO.cs
namespace PromoManager.Models.Dtos
{
    public class PromoDTO
    {
        public List<long> ItemIds { get; set; }
        public List<long> StoreIds { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public long TacticId { get; set; }
    }
}