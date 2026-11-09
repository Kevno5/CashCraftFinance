using CashCraft.DTOs;
using CashCraft.Extensions;
using CashCraft.Interface;
using Microsoft.AspNetCore.Authorization;
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

            if (result.Success)
                return StatusCode(201, new MessageResponse(result.Message));

            var errors = result.Field == null
                ? null
                : new Dictionary<string, string[]> { [result.Field] = new[] { result.Message } };

            if (result.IsConflict)
                return Conflict(new MessageResponse(result.Message, errors));

            return BadRequest(new MessageResponse(result.Message, errors));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var result = await _auth.LoginAsync(request);

            if (!result.Success)
                return Unauthorized(new MessageResponse(result.Message));

            return Ok(new
            {
                message = result.Message,
                token = result.Token,
                userId = result.UserId,
                name = result.Name,
                email = result.Email
            });
        }

        // Returns the logged-in user's profile, read from the JWT token
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var user = await _auth.GetUserByIdAsync(userId.Value);
            if (user == null) return Unauthorized();

            return Ok(new
            {
                userId = user.Id,
                name = user.Name,
                email = user.Email
            });
        }
    }
}