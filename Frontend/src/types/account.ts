export type Account = {
  id: number;
  plaidAccountId: string | null;
  name: string;
  type: string;
  subtype: string | null;
  currentBalance: number;
  availableBalance: number | null;
  creditLimit: number | null;
  minimumPayment: number | null;
  paymentDueDate: string | null;
  userId: number;
};