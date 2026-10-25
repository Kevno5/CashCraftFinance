import axiosClient from "./axiosClient";
import type { Transaction } from "../types/transactions";

export async function getTransactionsByUserId(
    userId: number
): Promise<Transaction[]> {
    const response = await axiosClient.get<Transaction[]>(
        `/api/Transactions/user/${userId}`
    );

    return response.data;
}