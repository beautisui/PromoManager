using System.ComponentModel.DataAnnotations;

namespace PromoManager.Models.Entities
{
    public class PromoItem
    {   [Required]
        public long PromoId { get; set; }
        [Required]
        public long ItemId { get; set; }
    }
}