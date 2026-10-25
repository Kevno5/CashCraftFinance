
import type { Transaction } from "../types/transactions";

export type TransactionKind =
    | "income"
    | "expense"
    | "refund"
    | "transfer"
    | "payment"
    | "review";

export type ClassifiedTransaction = Transaction & {
    kind: TransactionKind;
    displayCategory: string;
};

function formatCategory(category: string): string {
    return category
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
}

export function classifyTransaction(
    t: Transaction
): ClassifiedTransaction {
    const primary = t.plaidPrimaryCategory;
    const detailed = t.plaidDetailedCategory;

    const displayCategory = primary
        ? formatCategory(primary)
        : t.category || "Other";

    // Do not treat transfers as income or spending.
    if (
        primary === "TRANSFER_IN" ||
        primary === "TRANSFER_OUT"
    ) {
        return { ...t, kind: "transfer", displayCategory };
    }

    // Credit card and loan payments aren't new spending.
    if (primary === "LOAN_PAYMENTS") {
        return { ...t, kind: "payment", displayCategory };
    }

    // Income must be identified as income and be incoming.
    if (primary === "INCOME") {
        return {
            ...t,
            kind: t.amount < 0 ? "income" : "review",
            displayCategory: "Income"
        };
    }

    // Handle negative amounts in other categories as credits.
    if (t.amount < 0) {
        return { ...t, kind: "refund", displayCategory };
    }

    // If Plaid has no modern category, don't guess.
    if (!primary || !detailed || t.amount === 0) {
        return { ...t, kind: "review", displayCategory };
    }

    // Low-confidence categories should not be treated
    // as confirmed spending categories.
    if (
        t.categoryConfidence === "LOW" ||
        t.categoryConfidence === "UNKNOWN"
    ) {
        return { ...t, kind: "review", displayCategory };
    }

    return { ...t, kind: "expense", displayCategory };
}
