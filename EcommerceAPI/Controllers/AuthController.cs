using Microsoft.AspNetCore.Mvc;
using EcommerceAPI.Services;
using EcommerceAPI.Models;

namespace EcommerceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterRequest request)
        {
            try
            {
                _authService.Register(request);
                return Ok(new { message = "Register successful" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var result = _authService.Login(request);

            if (!result.Success)
                return Unauthorized(new { message = result.Message });

            return Ok(new
            {
                message = result.Message,
                token = result.Token,
                clientId = result.ClientId,
                name = result.ClientName
            });
        }
    }
}