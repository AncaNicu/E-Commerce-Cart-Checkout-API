using Microsoft.Data.SqlClient;

namespace EcommerceAPI.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly IConfiguration _config;

        public OrderRepository(IConfiguration config)
        {
            _config = config;
        }

        public decimal? GetProductPrice(int productId)
        {
            var connectionString =
                _config.GetConnectionString("DefaultConnection");

            using SqlConnection connection =
                new SqlConnection(connectionString);

            connection.Open();

            var query = @"
                SELECT product_price
                FROM Products
                WHERE product_id = @Id";

            SqlCommand command =
                new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@Id", productId);

            var result = command.ExecuteScalar();

            if (result == null)
                return null;

            return (decimal)result;
        }

        public int CreateOrder(
            int clientId,
            decimal total,
            string shippingAddress)
        {
            var connectionString =
                _config.GetConnectionString("DefaultConnection");

            using SqlConnection connection =
                new SqlConnection(connectionString);

            connection.Open();

            var query = @"
                INSERT INTO Orders
                (client_id, total_price, shipping_address)
                OUTPUT INSERTED.order_id
                VALUES
                (@ClientId, @Total, @Address)";

            SqlCommand command =
                new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@ClientId", clientId);
            command.Parameters.AddWithValue("@Total", total);
            command.Parameters.AddWithValue("@Address", shippingAddress);

            return (int)command.ExecuteScalar();
        }

        public void AddOrderItem(
            int orderId,
            int productId,
            int quantity)
        {
            var connectionString =
                _config.GetConnectionString("DefaultConnection");

            using SqlConnection connection =
                new SqlConnection(connectionString);

            connection.Open();

            var query = @"
                INSERT INTO OrderItems
                (order_id, product_id, quantity)
                VALUES
                (@OrderId, @ProductId, @Quantity)";

            SqlCommand command =
                new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@OrderId", orderId);
            command.Parameters.AddWithValue("@ProductId", productId);
            command.Parameters.AddWithValue("@Quantity", quantity);

            command.ExecuteNonQuery();
        }
    }
}