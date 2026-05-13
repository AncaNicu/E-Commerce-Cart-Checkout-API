using Xunit;
using Moq;
using EcommerceAPI.Models;
using EcommerceAPI.Repositories;
using EcommerceAPI.Services;

namespace EcommerceAPI.Tests.Services
{
    public class ProductServiceTests
    {
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly ProductService _productService;

        public ProductServiceTests()
        {
            _productRepositoryMock = new Mock<IProductRepository>();

            _productService = new ProductService(
                _productRepositoryMock.Object
            );
        }

        [Fact]
        public void GetProducts_ReturnsProducts()
        {
            var products = new List<Product>
            {
                new Product
                {
                    Id = 1,
                    Name = "Laptop",
                    Price = 1000
                },
                new Product
                {
                    Id = 2,
                    Name = "Phone",
                    Price = 500
                }
            };

            _productRepositoryMock
                .Setup(x => x.GetProducts())
                .Returns(products);

            var result = _productService.GetProducts();

            Assert.Equal(2, result.Count);

            Assert.Equal("Laptop", result[0].Name);

            Assert.Equal("Phone", result[1].Name);
        }


        [Fact]
        public void GetProductById_ExistingId_ReturnsProduct()
        {
            var product = new Product
            {
                Id = 1,
                Name = "Laptop",
                Price = 1000
            };

            _productRepositoryMock
                .Setup(x => x.GetProductById(1))
                .Returns(product);

            var result = _productService.GetProductById(1);

            Assert.NotNull(result);

            Assert.Equal(1, result!.Id);

            Assert.Equal("Laptop", result.Name);
        }

        [Fact]
        public void GetProductById_InvalidId_ReturnsNull()
        {
            _productRepositoryMock
                .Setup(x => x.GetProductById(999))
                .Returns((Product?)null);

            var result = _productService.GetProductById(999);

            Assert.Null(result);
        }

        [Fact]
        public void AddProduct_EmptyName_ThrowsException()
        {
            var product = new Product
            {
                Id = 1,
                Name = "",
                Price = 1000
            };

            var exception = Assert.Throws<Exception>(() =>
                _productService.AddProduct(product));

            Assert.Equal(
                "Product name is required",
                exception.Message
            );
        }

        [Fact]
        public void AddProduct_NegativePrice_ThrowsException()
        {
            var product = new Product
            {
                Id = 1,
                Name = "Laptop",
                Price = -100
            };

            var exception = Assert.Throws<Exception>(() =>
                _productService.AddProduct(product));

            Assert.Equal(
                "Price cannot be negative",
                exception.Message
            );
        }

        [Fact]
        public void AddProduct_ValidProduct_CallsRepository()
        {
            var product = new Product
            {
                Id = 1,
                Name = "Laptop",
                Price = 1000
            };

            _productService.AddProduct(product);

            _productRepositoryMock.Verify(x =>
                x.AddProduct(product),
                Times.Once);
        }
    }
}