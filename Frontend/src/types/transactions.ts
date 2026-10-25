export type Transaction = {
    id: number;
    plaidTransactionId: string | null;
    name: string;
    amount: number;
    date: string;
    category: string | null;
    accountId: number;
};