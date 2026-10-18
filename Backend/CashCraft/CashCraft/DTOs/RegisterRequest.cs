using System.ComponentModel.DataAnnotations;

namespace CashCraft.DTOs
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Please enter your name.")]
        [StringLength(100, ErrorMessage = "Name must be 100 characters or fewer.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Please enter your email address.")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        [StringLength(254, ErrorMessage = "Email must be 254 characters or fewer.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Please enter a password.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        [MaxLength(128, ErrorMessage = "Password must be 128 characters or fewer.")]
        public string Password { get; set; } = string.Empty;
    }

          public record RegisterResult(bool Success, string Message, bool IsConflict, string? Field = null);
}