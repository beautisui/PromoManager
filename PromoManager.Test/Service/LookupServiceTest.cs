using Moq;
using PromoManager.Models.Entities;
using PromoManager.Repository;
using PromoManager.Service;

namespace PromoManager.Test.Service;

[TestFixture]
[TestOf(typeof(LookupService))]
public class LookupServiceTest
{
    private Mock<ILookupRepository> _mockRepo;
    private LookupService _lookupService;

    [SetUp]
public void Setup()
{
    _mockRepo = new Mock<ILookupRepository>();
    _lookupService = new LookupService(_mockRepo.Object);
}

[Test]
public async Task GetItemsShouldReturnAllItems()
{
    var expectedItems = new List<Item> { new() { Id = 1, Name = "Pen" } };
    _mockRepo.Setup(r => r.GetItems()).ReturnsAsync(expectedItems);

    var result = await _lookupService.GetItems();

    Assert.AreEqual(expectedItems.Count, result.Count());
    Assert.AreEqual("Pen", result.First().Name);
}

[Test]
public async Task GetStoresShouldReturnAllStores()
{
    var expectedStores = new List<Store> { new() { Id = 1, Name = "Store1" } };
    _mockRepo.Setup(r => r.GetStores()).ReturnsAsync(expectedStores);

    var result = await _lookupService.GetStores();

    Assert.AreEqual(expectedStores.Count, result.Count());
    Assert.AreEqual("Store1", result.First().Name);
}

[Test]
public async Task GetTacticsShouldReturnAllTactics()
{
    var expectedTactics = new List<Tactic> { new() { TacticId = 1, Type = "Discount" } };
    _mockRepo.Setup(r => r.GetTactics()).ReturnsAsync(expectedTactics);

    var result = await _lookupService.GetTactics();

    Assert.AreEqual(expectedTactics.Count, result.Count());
    Assert.AreEqual("Discount", result.First().Type);
}

[Test]
public async Task GetAvailableOptionsShouldReturnAllOptions()
{
    var items = new List<Item> { new() { Id = 1, Name = "Pen" } };
    var stores = new List<Store> { new() { Id = 1, Name = "Store1" } };
    var tactics = new List<Tactic> { new() { TacticId = 1, Type = "Discount" } };

    _mockRepo.Setup(r => r.GetItems()).ReturnsAsync(items);
    _mockRepo.Setup(r => r.GetStores()).ReturnsAsync(stores);
    _mockRepo.Setup(r => r.GetTactics()).ReturnsAsync(tactics);

    var result = await _lookupService.GetAvailableOptions();

    Assert.AreEqual(items, result.Items);
    Assert.AreEqual(stores, result.Stores);
    Assert.AreEqual(tactics, result.Tactics);
}

[Test]
public async Task GetPromoIdsShouldReturnAllPromoIds()
{
    var expectedIds = new List<long> { 1, 2, 3 };
    _mockRepo.Setup(r => r.GetPromoIds()).ReturnsAsync(expectedIds);

    var result = await _lookupService.GetPromoIds();

    Assert.AreEqual(expectedIds, result);
}

}