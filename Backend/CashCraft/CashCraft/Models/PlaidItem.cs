namespace CashCraft.Models
{
    public class PlaidItem
    {
        public int Id { get; set; }
        public string AccessToken { get; set; }
        public string ItemId { get; set; }
        public string? TransactionCursor { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
