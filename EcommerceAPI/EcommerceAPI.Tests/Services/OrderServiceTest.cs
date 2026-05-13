using Xunit;
using Moq;
using EcommerceAPI.Services;
using EcommerceAPI.Repositories;
using EcommerceAPI.Models;

namespace EcommerceAPI.Tests.Services
{
    public class OrderServiceTests
    {
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly OrderService _orderService;

        public OrderServiceTests()
        {
            _orderRepositoryMock =
                new Mock<IOrderRepository>();

            _orderService =
                new OrderService(_orderRepositoryMock.Object);
        }

        [Fact]
        public void Checkout_EmptyCart_ThrowsException()
        {
            var request = new OrderRequest
            {
                ShippingAddress = "Street 1",
                Items = new List<OrderItemRequest>()
            };

            var exception = Assert.Throws<Exception>(() =>
                _orderService.Checkout(request, 1));

            Assert.Equal("Cart is empty", exception.Message);
        }

        [Fact]
        public void Checkout_EmptyShippingAddress_ThrowsException()
        {
            var request = new OrderRequest
            {
                ShippingAddress = "",
                Items = new List<OrderItemRequest>
                {
                    new OrderItemRequest
                    {
                        ProductId = 1,
                        Quantity = 1
                    }
                }
            };

            var exception = Assert.Throws<Exception>(() =>
                _orderService.Checkout(request, 1));

            Assert.Equal(
                "Shipping address is required",
                exception.Message);
        }

        [Fact]
        public void Checkout_InvalidQuantity_ThrowsException()
        {
            var request = new OrderRequest
            {
                ShippingAddress = "Street 1",
                Items = new List<OrderItemRequest>
                {
                    new OrderItemRequest
                    {
                        ProductId = 1,
                        Quantity = 0
                    }
                }
            };

            var exception = Assert.Throws<Exception>(() =>
                _orderService.Checkout(request, 1));

            Assert.Equal(
                "Invalid quantity",
                exception.Message);
        }

        [Fact]
        public void Checkout_ProductNotFound_ThrowsException()
        {
            _orderRepositoryMock
                .Setup(x => x.GetProductPrice(1))
                .Returns((decimal?)null);

            var request = new OrderRequest
            {
                ShippingAddress = "Street 1",
                Items = new List<OrderItemRequest>
                {
                    new OrderItemRequest
                    {
                        ProductId = 1,
                        Quantity = 1
                    }
                }
            };

            var exception = Assert.Throws<Exception>(() =>
                _orderService.Checkout(request, 1));

            Assert.Equal(
                "Product 1 not found",
                exception.Message);
        }

        [Fact]
        public void Checkout_ValidOrder_ReturnsTotal()
        {
            _orderRepositoryMock
                .Setup(x => x.GetProductPrice(1))
                .Returns(100);

            _orderRepositoryMock
                .Setup(x => x.CreateOrder(
                    It.IsAny<int>(),
                    It.IsAny<decimal>(),
                    It.IsAny<string>()))
                .Returns(10);

            var request = new OrderRequest
            {
                ShippingAddress = "Street 1",
                Items = new List<OrderItemRequest>
                {
                    new OrderItemRequest
                    {
                        ProductId = 1,
                        Quantity = 2
                    }
                }
            };

            var total =
                _orderService.Checkout(request, 1);

            Assert.Equal(200, total);

            _orderRepositoryMock.Verify(x =>
                x.CreateOrder(
                    1,
                    200,
                    "Street 1"),
                Times.Once);

            _orderRepositoryMock.Verify(x =>
                x.AddOrderItem(
                    10,
                    1,
                    2),
                Times.Once);
        }
    }
}