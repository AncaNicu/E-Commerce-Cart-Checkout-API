namespace EcommerceAPI.Models
{
    public class LoginResult
    {
        public bool Success { get; set; }

        public string Message { get; set; } = "";

        public int ClientId { get; set; }

        public string ClientName { get; set; } = "";

        public string HashedPassword { get; set; } = "";

        public string Token { get; set; } = "";
    }
}