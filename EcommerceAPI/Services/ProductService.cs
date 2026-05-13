using EcommerceAPI.Models;
using EcommerceAPI.Repositories;

namespace EcommerceAPI.Services
{
    public class ProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public List<Product> GetProducts()
        {
            return _productRepository.GetProducts();
        }

        public Product? GetProductById(int id)
        {
            return _productRepository.GetProductById(id);
        }

        public void AddProduct(Product product)
        {
            if (string.IsNullOrWhiteSpace(product.Name))
                throw new Exception("Product name is required");

            if (product.Price < 0)
                throw new Exception("Price cannot be negative");

            _productRepository.AddProduct(product);
        }
    }
}