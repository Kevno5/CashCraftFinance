using CashCraft.DTOs;
using CashCraft.Models;

namespace CashCraft.Interface
{
    public interface IAuthService
    {
        Task<RegisterResult> RegisterAsync(RegisterRequest request);
        Task<LoginResult> LoginAsync(LoginRequest request);
        Task<User?> GetUserByIdAsync(int id);
    }
}