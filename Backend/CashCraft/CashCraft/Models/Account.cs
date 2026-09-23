namespace CashCraft.Models
{
    public class Account
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public string? Subtype { get; set; }

        public decimal CurrentBalance { get; set; }

        public decimal? AvailableBalance { get; set; }

        public decimal? CreditLimit { get; set; }

        public decimal? MinimumPayment { get; set; }

        public DateTime? PaymentDueDate { get; set; }

        public int UserId { get; set; }

        public User? User { get; set; }

        public List<Transaction> Transactions { get; set; } = new();
    }
}
