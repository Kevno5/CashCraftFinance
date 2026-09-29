using System.ComponentModel.DataAnnotations;

namespace CashCraft.DTOs
{
    public class RegisterRequest
    {
        [Required, StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(8)]
        public string Password { get; set; } = string.Empty;
    }

    public record RegisterResult(bool Success, string Message, bool IsConflict);
}