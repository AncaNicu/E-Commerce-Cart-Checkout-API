using EcommerceAPI.Models;

namespace EcommerceAPI.Repositories
{
    public interface IAuthRepository
    {
        bool EmailExists(string email);

        void CreateUser(string name, string email, string hashedPassword);

        LoginResult? GetUserByEmail(string email);
    }
}