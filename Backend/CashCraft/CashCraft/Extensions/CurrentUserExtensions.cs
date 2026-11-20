using System.Security.Claims;

namespace CashCraft.Extensions
{
    public static class CurrentUserExtensions
    {
        // Reads the logged-in user's id from the JWT token.
        public static int? GetUserId(this ClaimsPrincipal user)
        {
            var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                        ?? user.FindFirst("sub")?.Value;

            return int.TryParse(value, out var id) ? id : null;
        }
    }
}