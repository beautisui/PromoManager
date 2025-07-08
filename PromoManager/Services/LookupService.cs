using PromoManager.Models.Entities;
using PromoManager.Repository;
using PromoManager.Service;

namespace PromoManager.Services
{
    public class LookupService : ILookupService
    {
        private readonly ILookupRepository _lookupRepository;

        public LookupService(ILookupRepository lookupRepository)
        {
            _lookupRepository = lookupRepository;
        }

        public async Task<IEnumerable<Item>> GetItems() => await _lookupRepository.GetItems();

        public async Task<IEnumerable<Store>> GetStores() => await _lookupRepository.GetStores();

        public async Task<IEnumerable<Tactic>> GetTactics() => await _lookupRepository.GetTactics();

        public async Task<AvailableOptions> GetAvailableOptions()
        {
            var items = await _lookupRepository.GetItems();
            var stores = await _lookupRepository.GetStores();
            var tactics = await _lookupRepository.GetTactics();

            return new AvailableOptions
            {
                Items = items,
                Stores = stores,
                Tactics = tactics
            };
        }

        public async Task<IEnumerable<long>> GetPromoIds() => await _lookupRepository.GetPromoIds();

        public async Task<IEnumerable<FilterOption>> GetFilterOptions(string field)
            => await _lookupRepository.GetFilterOptions(field);
    }
}