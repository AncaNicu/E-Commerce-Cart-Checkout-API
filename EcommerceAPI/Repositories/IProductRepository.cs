using EcommerceAPI.Models;

namespace EcommerceAPI.Repositories
{
    public interface IProductRepository
    {
        List<Product> GetProducts();

        Product? GetProductById(int id);

        void AddProduct(Product product);
    }
}