using Moq;
using NUnit.Framework;
using PromoManager.Models.Dtos;
using PromoManager.Repository;
using PromoManager.Service;
using PromoManager.Models.Entities;

namespace PromoManager.Test.Service;

[TestFixture]
[TestOf(typeof(PromoService))]
public class PromoServiceTest
{
    private Mock<IPromoRepository> _mockRepo;
    private PromoService _promoService;

    [SetUp]
    public void Setup()
    {
        _mockRepo = new Mock<IPromoRepository>();
        _promoService = new PromoService(_mockRepo.Object);
    }

    [Test]
    public async Task GetAllPromotionsShouldReturnAllPromotions()
    {
        var expectedPromos = new List<PromotionResponse>
        {
            new PromotionResponse
            {
                PromoId = 1,
                Items = new List<Item> { new() { Id = 1, Name = "Pen" } },
                Stores = new List<Store> { new() { Id = 1, Name = "Store1" } },
                StartTime = DateTime.Now,
                EndTime = DateTime.Now.AddDays(1),
                Tactic = new Tactic { TacticId = 1, Type = "10% Off" }
            }
        };

        _mockRepo.Setup(repo => repo.GetAllPromotions())
                 .ReturnsAsync(expectedPromos);

        var result = await _promoService.GetAllPromotions();

        Assert.AreEqual(1, result.Count());
        Assert.AreEqual(1, result.First().PromoId);
        Assert.AreEqual("Pen", result.First().Items.First().Name);
    }

    [Test]
    public async Task AddPromotionShouldReturnId()
    {
        var promoDto = new Promo
        {
            ItemIds = new List<long> { 1, 2 },
            StoreIds = new List<long> { 1 },
            StartDate = DateTime.Today,
            EndDate = DateTime.Today.AddDays(7),
            TacticId = 1
        };

        _mockRepo.Setup(repo => repo.AddPromotion(promoDto))
            .ReturnsAsync(10); // Returning new promoId

        var result = await _promoService.AddPromotion(promoDto);

        Assert.AreEqual(10, result);
    }


    [Test]
    public async Task DeletePromotionShouldReturnDeletedId()
    {
        long promoId = 5;

        _mockRepo.Setup(repo => repo.DeletePromotion(promoId))
                 .ReturnsAsync(promoId);

        var result = await _promoService.DeletePromotion(promoId);

        Assert.AreEqual(5, result);
    }
}
