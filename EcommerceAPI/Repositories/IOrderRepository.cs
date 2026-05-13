namespace EcommerceAPI.Repositories
{
    public interface IOrderRepository
    {
        decimal? GetProductPrice(int productId);

        int CreateOrder(
            int clientId,
            decimal total,
            string shippingAddress
        );

        void AddOrderItem(
            int orderId,
            int productId,
            int quantity
        );
    }
}