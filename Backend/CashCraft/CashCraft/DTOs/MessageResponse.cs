using System.Text.Json.Serialization;

namespace CashCraft.DTOs
{
    // The one response shape for registration success and error messages.
    //
    // Success:  { "message": "Account created successfully. You can now log in." }
    // Error:    { "message": "Please enter a valid email address.",
    //             "errors": { "email": ["Please enter a valid email address."] } }
    //
    // "message" is always safe to show to the user as-is.
    // "errors" (only on errors) maps each input name to its messages, so the
    // frontend can show each one under the matching box.
    public record MessageResponse(
        string Message,
        [property: JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        IDictionary<string, string[]>? Errors = null);
}