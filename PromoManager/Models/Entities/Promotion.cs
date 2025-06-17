using System.ComponentModel.DataAnnotations;

namespace PromoManager.Models.Entities
{
    public class Promotion
    {
        [Required]
        public string PromoId { get; set; } 
        
        [Required]
        public string Item { get; set; }
        
        [Required]
        public string Store { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        [Required]
        public DateTime EndDate { get; set; }
        
        [Required]
        public string Tactic { get; set; } 
    }    
}
