namespace CashCraft.Models
{
    public class PlaidTransactionsResponse
    {
        public List<PlaidTransaction> added { get; set; } = new();
        public List<PlaidTransaction> modified { get; set; } = new();
        public List<RemovedTransaction> removed { get; set; } = new();
        public string? next_cursor { get; set; }
        public bool has_more { get; set; }
    }

    public class PlaidTransaction
    {
        public string? transaction_id { get; set; }
        public string? account_id { get; set; }
        public string? name { get; set; }
        public decimal amount { get; set; }
        public DateTime date { get; set; }
        public List<string>? category { get; set; }
    
    }

    public class RemovedTransaction
    {
        public string? transaction_id { get; set; }
    }
}
