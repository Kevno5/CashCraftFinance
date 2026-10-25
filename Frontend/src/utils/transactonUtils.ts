import type { Transaction } from "../types/transactions";

export type TransactionKind =
    | "income"
    | "expense"
    | "refund"
    | "transfer"
    | "review";

export type ClassifiedTransaction = Transaction & {
    kind: TransactionKind;
    displayCategory: string;
};

// Display-only category corrections for known sandbox merchants.
function getDisplayCategory(t: Transaction): string {
    if (t.name.toLowerCase().includes("sparkfun")) {
        return "Shopping";
    }

    return t.category || "Other";
}

export function classifyTransaction(
    t: Transaction
): ClassifiedTransaction {
    const category = (t.category || "").toLowerCase();
    const name = t.name.toLowerCase();

    const displayCategory = getDisplayCategory(t);

    // Explicit income categories take priority.
    if (category === "income" || category === "payroll") {
        return { ...t, kind: "income", displayCategory };
    }

    // The sandbox Gusto record has an unusual positive amount.
    // Don't assume the direction is correct without verification.
    if (name.includes("gusto pay")) {
        return { ...t, kind: "review", displayCategory };
    }

    // Transfers and credit card payments are not new spending.
    if (category === "transfer" || category === "payment") {
        return { ...t, kind: "transfer", displayCategory };
    }

    // Plaid normally uses negative amounts for incoming money.
    // Without an income category, treat these as credits/refunds.
    if (t.amount < 0) {
        return { ...t, kind: "refund", displayCategory };
    }

    if (t.amount > 0) {
        return { ...t, kind: "expense", displayCategory };
    }

    return { ...t, kind: "review", displayCategory };
}
