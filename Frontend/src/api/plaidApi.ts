import axiosClient from "./axiosClient";


export async function createLinkToken(
    userId: number,
    )
    {
        const response = await axiosClient.post(`/api/Plaid/link-token/${userId}`)

        return response.data.linkToken;
        }

export async function exchangePublicToken(
    userId: number,
    publicToken: string
) {
    await axiosClient.post(`/api/Plaid/exchange/${userId}`,
         { publicToken })

    
}

export async function savePlaidAccounts(userId: number) {
    await axiosClient.post(`/api/Plaid/save-accounts/${userId}`)
}

export async function savePlaidTransactions(userId: number) {
    await axiosClient.post(`/api/Plaid/save-transactions/${userId}`)
}