using EcommerceAPI.Models;
using EcommerceAPI.Repositories;

namespace EcommerceAPI.Services
{
    public class OrderService
    {
        private readonly IOrderRepository _orderRepository;

        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public decimal Checkout(OrderRequest request, int clientId)
        {
            if (request.Items == null || !request.Items.Any())
                throw new Exception("Cart is empty");

            if (string.IsNullOrWhiteSpace(request.ShippingAddress))
                throw new Exception("Shipping address is required");

            decimal total = 0;

            foreach (var item in request.Items)
            {
                if (item.Quantity <= 0)
                    throw new Exception("Invalid quantity");

                var price =
                    _orderRepository.GetProductPrice(item.ProductId);

                if (price == null)
                    throw new Exception(
                        $"Product {item.ProductId} not found");

                total += price.Value * item.Quantity;
            }

            int orderId = _orderRepository.CreateOrder(
                clientId,
                total,
                request.ShippingAddress
            );

            foreach (var item in request.Items)
            {
                _orderRepository.AddOrderItem(
                    orderId,
                    item.ProductId,
                    item.Quantity
                );
            }

            return total;
        }
    }
}