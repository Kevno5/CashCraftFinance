import axiosClient from "./axiosClient";
import type { Account } from "../types/account";

export async function getAccountsByUserId(
    userId: number
): Promise<Account[]> {

    const response = await axiosClient.get<Account[]>(
        `/api/Accounts/user/${userId}`
    );

    return response.data;
}