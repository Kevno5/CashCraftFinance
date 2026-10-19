using CashCraft.Models;

namespace CashCraft.Interface
{
    public interface ITransactionService
    {
        public Task<IEnumerable<Transaction>> GetAllTransactionsAsync();

        public Task<List<Transaction>> GetTransactionsByUserIdAsync(int userId);

        public Task<List<Transaction>> GetTransactionsByUserIdAndAccountId(int userId, int accountId);
    }
}
