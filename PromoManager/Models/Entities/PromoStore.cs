using System.ComponentModel.DataAnnotations;

namespace PromoManager.Models.Entities
{
    public class PromoStore
    {
        [Required]
        public long PromoId { get; set; }
        [Required]
        public long StoreId { get; set; }
    }
}