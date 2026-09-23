using CashCraft.Models;

namespace CashCraft.Interface
{
    public interface IAccountsService
    {
        // Gets all accounts of every user
        Task<IEnumerable<Account>> GetAccountsAsync();

        // Gets account by Id
        Task<Account?> GetAccountByIdAsync(int Id);

        // Gets all accounts that belong to a specific user
        Task<List<Account>> GetAccountsByUserIdAsync(int userId);

    }
}
