using System.ComponentModel.DataAnnotations;

namespace CashCraft.DTOs
{
    public class ChangePasswordRequest
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required, MinLength(8)]
        public string NewPassword { get; set; } = string.Empty;
    }

    public record ChangePasswordResult(bool Success, string Message, string? Field = null);
}