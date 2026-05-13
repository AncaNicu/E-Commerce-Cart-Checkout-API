using Microsoft.AspNetCore.Mvc;
using EcommerceAPI.Services;
using EcommerceAPI.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace EcommerceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrdersController(OrderService orderService)
        {
            _orderService = orderService;
        }

        [Authorize]
        [HttpPost("checkout")]
        public IActionResult Checkout(OrderRequest request)
        {
            try
            {
                var clientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

                if (clientIdClaim == null)
                    return Unauthorized();

                int clientId = int.Parse(clientIdClaim.Value);

                var total = _orderService.Checkout(request, clientId);

                return Ok(new
                {
                    message = "Order placed successfully",
                    totalPrice = total
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}