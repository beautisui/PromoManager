using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PromoManager.Models.Entities
{
    public class Promotion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long PromoId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public long TacticId { get; set; }
    }
}