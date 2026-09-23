namespace CashCraft.Models
{
    public class Transaction
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public string? Category { get; set; }

        public int AccountId { get; set; }

        public Account? Account { get; set; }
    }
}
