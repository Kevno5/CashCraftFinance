using System.ComponentModel.DataAnnotations;

namespace CashCraft.DTOs
{
    public class LoginRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public record LoginResult(bool Success, string Message, int? UserId, string? Name, string? Email);
}