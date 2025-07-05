using PromoManager.Models.Entities;

namespace PromoManager.Service

{
    public interface ILookupService
    {
        Task<IEnumerable<Item>> GetItems();
        Task<IEnumerable<Store>> GetStores();
        Task<IEnumerable<Tactic>> GetTactics();
        Task<AvailableOptions> GetAvailableOptions();
        Task<IEnumerable<long>> GetPromoIds();
        Task<IEnumerable<FilterOption>> GetFilterOptions(string field);
    }
}
