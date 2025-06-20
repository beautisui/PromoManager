using Moq;
using PromoManager.Models.Entities;
using PromoManager.Repository;
using PromoManager.Service;

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
      var expectedPromos = new List<Promotion>
      {
         new Promotion
         {
            PromoId = 1, Item = "Pen", Store = "Store1", StartDate = DateTime.Now, EndDate = DateTime.Now.AddDays(1),
            Tactic = "10% Off"
         },
         new Promotion
         {
          PromoId = 2, Item = "Pencil", Store = "Store2", StartDate = DateTime.Now,
            EndDate = DateTime.Now.AddDays(2), Tactic = "15% Off"
         }
      };
      
      _mockRepo.Setup(x => x.GetAllPromotions()).ReturnsAsync(expectedPromos);

      var actualPromo  = await _promoService.GetPromotions();
      
      Assert.AreEqual(2, actualPromo.Count());
      Assert.AreEqual("Pen", actualPromo.First().Item);
   }
   
   [Test]
   public async Task AddPromotionShouldAddAndReturnPromotion()
   {
      var newPromo = new Promotion
      {
         PromoId = 3,
         Item = "Notebook",
         Store = "Store3",
         StartDate = DateTime.Now,
         EndDate = DateTime.Now.AddDays(3),
         Tactic = "20% Off"
      };

      _mockRepo.Setup(repo => 
            repo.AddPromotion(newPromo))
         .ReturnsAsync(newPromo); 

      var newlyAddedPromotion = await _promoService.AddPromotion(newPromo);

      Assert.IsNotNull(newlyAddedPromotion);
      Assert.AreEqual("Notebook", newlyAddedPromotion.Item);
      Assert.AreEqual("Store3", newlyAddedPromotion.Store);
      Assert.AreEqual(3, newlyAddedPromotion.PromoId);
   }
}