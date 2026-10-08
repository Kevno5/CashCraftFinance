using CashCraft.DTOs;
using CashCraft.Interface;
using Microsoft.AspNetCore.Mvc;

namespace CashCraft.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;

        public AuthController(IAuthService auth)
        {
            _auth = auth;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var result = await _auth.RegisterAsync(request);

            if (result.Success) return StatusCode(201, new { message = result.Message });
            if (result.IsConflict) return Conflict(new { message = result.Message });
            return BadRequest(new { message = result.Message });
        }
                [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var result = await _auth.LoginAsync(request);

            if (!result.Success)
                return Unauthorized(new { message = result.Message });

            return Ok(new
            {
                message = result.Message,
                userId = result.UserId,
                name = result.Name,
                email = result.Email
            });
        }

    }
}