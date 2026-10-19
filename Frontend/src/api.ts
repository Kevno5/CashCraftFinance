export type Account = {
  id: number;
  name: string;
  type: string;
  subtype: string | null;
  currentBalance: number | null;
  availableBalance: number | null;
};

export type Transaction = {
  id: number;
  name: string | null;
  amount: number;
  date: string;
  category: string | null;
  accountId: number;
};

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} failed: ${res.status}`);
  return res.json();
}

export const getAccounts = (userId: number) => get<Account[]>(`/api/Accounts/user/${userId}`);
export const getTransactions = (userId: number) => get<Transaction[]>(`/api/Transactions/user/${userId}`);
