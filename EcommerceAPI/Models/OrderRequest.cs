namespace EcommerceAPI.Models
{
    public class OrderRequest
    {
        public required string ShippingAddress { get; set; }
        public required List<OrderItemRequest> Items { get; set; }
    }

    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}