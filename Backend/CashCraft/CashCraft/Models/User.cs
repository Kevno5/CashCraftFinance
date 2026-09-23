namespace CashCraft.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public List<Account> Accounts { get; set; } = new();

        public List<Budget> Budgets { get; set; }
    }
}
