using CashCraft.DTOs;

namespace CashCraft.Interface
{
    public interface IAuthService
    {
        Task<RegisterResult> RegisterAsync(RegisterRequest request);
    }
}