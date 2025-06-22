using PromoManager.Models.Dtos;
using PromoManager.Models.Entities;

using PromoManager.Models.Entities;
using PromoManager.Repository;

namespace PromoManager.Service
{
    public class PromoService : IPromoService
    {
        private readonly IPromoRepository _repository;

        public PromoService(IPromoRepository repository)
        {
            _repository = repository;
        }

        public async Task<long> AddPromotion(Promo dto)
        {
            return await _repository.AddPromotion(dto);
        }

        public async Task<IEnumerable<PromotionResponse>> GetAllPromotions()
        {
            return await _repository.GetAllPromotions();
        }

        public Task<long> DeletePromotion(long promoId)
        {
            return _repository.DeletePromotion(promoId);
        }
    }
}