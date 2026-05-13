using Microsoft.Data.SqlClient;
using EcommerceAPI.Models;

namespace EcommerceAPI.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly IConfiguration _config;

        public ProductRepository(IConfiguration config)
        {
            _config = config;
        }

        public List<Product> GetProducts()
        {
            var products = new List<Product>();

            var connectionString =
                _config.GetConnectionString("DefaultConnection");

            using SqlConnection connection =
                new SqlConnection(connectionString);

            connection.Open();

            var query = @"
                SELECT product_id, product_name,
                       product_price, product_image
                FROM Products";

            SqlCommand command =
                new SqlCommand(query, connection);

            using SqlDataReader reader =
                command.ExecuteReader();

            while (reader.Read())
            {
                products.Add(new Product
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Price = reader.GetDecimal(2),
                    ImageUrl = reader.IsDBNull(3)
                        ? null
                        : reader.GetString(3)
                });
            }

            return products;
        }

        public Product? GetProductById(int id)
        {
            var connectionString =
                _config.GetConnectionString("DefaultConnection");

            using SqlConnection connection =
                new SqlConnection(connectionString);

            connection.Open();

            var query = @"
                SELECT product_id, product_name,
                       product_price, product_image
                FROM Products
                WHERE product_id = @Id";

            SqlCommand command =
                new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@Id", id);

            using SqlDataReader reader =
                command.ExecuteReader();

            if (!reader.Read())
                return null;

            return new Product
            {
                Id = reader.GetInt32(0),
                Name = reader.GetString(1),
                Price = reader.GetDecimal(2),
                ImageUrl = reader.IsDBNull(3)
                    ? null
                    : reader.GetString(3)
            };
        }

        public void AddProduct(Product product)
        {
            var connectionString =
                _config.GetConnectionString("DefaultConnection");

            using SqlConnection connection =
                new SqlConnection(connectionString);

            connection.Open();

            var query = @"
                INSERT INTO Products
                (product_name, product_price, product_image)
                VALUES
                (@Name, @Price, @Image)";

            SqlCommand command =
                new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@Name", product.Name);
            command.Parameters.AddWithValue("@Price", product.Price);
            command.Parameters.AddWithValue(
                "@Image",
                product.ImageUrl ?? (object)DBNull.Value
            );

            command.ExecuteNonQuery();
        }
    }
}