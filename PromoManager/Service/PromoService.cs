using PromoManager.Models.Entities;
using PromoManager.Repository;

namespace PromoManager.Service;

public class PromoService : IPromoService
{
    private readonly IPromoRepository _repository;

    public PromoService(IPromoRepository repository)
    {
       _repository = repository;
    }

    public async Task<IEnumerable<Promotion>> GetPromotions() 
    {
        return await _repository.GetAllPromotions();
    }

    public async Task<Promotion> AddPromotion(Promotion promotion)
    {
        return await _repository.AddPromotion(promotion);
    }
}