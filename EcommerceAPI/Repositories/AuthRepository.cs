using Microsoft.Data.SqlClient;
using EcommerceAPI.Models;

namespace EcommerceAPI.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly IConfiguration _config;

        public AuthRepository(IConfiguration config)
        {
            _config = config;
        }

        public bool EmailExists(string email)
        {
            var connectionString = _config.GetConnectionString("DefaultConnection");

            using SqlConnection connection = new SqlConnection(connectionString);

            connection.Open();

            var query = "SELECT COUNT(*) FROM Clients WHERE client_email = @Email";

            SqlCommand command = new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@Email", email);

            int exists = (int)command.ExecuteScalar();

            return exists > 0;
        }

        public void CreateUser(string name, string email, string hashedPassword)
        {
            var connectionString = _config.GetConnectionString("DefaultConnection");

            using SqlConnection connection = new SqlConnection(connectionString);

            connection.Open();

            var query = @"
                INSERT INTO Clients 
                (client_name, client_email, client_password)
                VALUES
                (@Name, @Email, @Password)";

            SqlCommand command = new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@Name", name);
            command.Parameters.AddWithValue("@Email", email);
            command.Parameters.AddWithValue("@Password", hashedPassword);

            command.ExecuteNonQuery();
        }

        public LoginResult? GetUserByEmail(string email)
        {
            var connectionString = _config.GetConnectionString("DefaultConnection");

            using SqlConnection connection = new SqlConnection(connectionString);

            connection.Open();

            var query = @"
                SELECT client_id, client_password, client_name
                FROM Clients
                WHERE client_email = @Email";

            SqlCommand command = new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@Email", email);

            using var reader = command.ExecuteReader();

            if (!reader.Read())
                return null;

            return new LoginResult
            {
                ClientId = reader.GetInt32(0),
                HashedPassword = reader.GetString(1),
                ClientName = reader.GetString(2)
            };
        }
    }
}