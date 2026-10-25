export type Transaction = {
    id: number;
    plaidTransactionId: string | null;
    name: string;
    amount: number;
    date: string;
    category: string | null;
    plaidPrimaryCategory: string | null;
    plaidDetailedCategory: string | null;
    categoryConfidence: string | null;  
    accountId: number;
};