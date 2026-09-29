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
    }
}