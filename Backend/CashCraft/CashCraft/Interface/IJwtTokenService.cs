using CashCraft.Models;

namespace CashCraft.Interface
{
    public interface IJwtTokenService
    {
        string CreateToken(User user);
    }
}