
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
    const primary = t.plaidPrimaryCategory?.toUpperCase();
    const legacyCategory = t.category?.toLowerCase() ?? "";

    const displayCategory = primary
        ? formatCategory(primary)
        : t.category || "Other";

    // Transfers are not income or new expenses.
    if (
        primary === "TRANSFER_IN" ||
        primary === "TRANSFER_OUT" ||
        (!primary && legacyCategory === "transfer")
    ) {
        return {
            ...t,
            kind: "transfer",
            displayCategory
        };
    }

    // Credit card and loan payments aren't new purchases.
    if (
        primary === "LOAN_PAYMENTS" ||
        (!primary && legacyCategory === "payment")
    ) {
        return {
            ...t,
            kind: "payment",
            displayCategory: "Payments"
        };
    }

    // Plaid uses negative amounts for incoming funds.
    if (primary === "INCOME") {
        return {
            ...t,
            kind: t.amount < 0 ? "income" : "review",
            displayCategory: "Income"
        };
    }

    // Credits outside verified income are treated as
    // refunds/credits rather than new income.
    if (t.amount < 0) {
        return {
            ...t,
            kind: "refund",
            displayCategory
        };
    }

    // Positive transactions in ordinary spending
    // categories are expenses.
    if (t.amount > 0) {
        if (
            !primary &&
            (legacyCategory === "income" ||
             legacyCategory === "payroll")
        ) {
            return {
                ...t,
                kind: "review",
                displayCategory
            };
        }

        if (!primary && !legacyCategory) {
            return {
                ...t,
                kind: "review",
                displayCategory
            };
        }

        return {
            ...t,
            kind: "expense",
            displayCategory
        };
    }

    return {
        ...t,
        kind: "review",
        displayCategory
    };
}
