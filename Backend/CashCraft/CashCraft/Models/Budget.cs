namespace CashCraft.Models
{
    public class Budget
    {
        public int Id { get; set; }

        public string Category { get; set; } = string.Empty;

        public decimal Limit { get; set; }

        public int UserId { get; set; }
        
        public User? User { get; set; }


    }
}
