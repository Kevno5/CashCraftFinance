import {useAuth}  from "../Context/AuthContext";
import { useState, useEffect } from "react";
import { createLinkToken, exchangePublicToken, savePlaidAccounts, savePlaidTransactions } from "../api/plaidApi";
import { usePlaidLink } from "react-plaid-link";

interface PlaidLinkButtonProps {
    onLinked: () => void;
}

export default function PlaidLinkButton({onLinked}: PlaidLinkButtonProps) {
    const { user } = useAuth();
    const [linkToken, setLinkToken] = useState<string | null>(null);

    useEffect(() => {
        if(!user) return;

        const userId = user.id;

        async function fetchLinkToken() {
         const token = await createLinkToken(userId);

         setLinkToken(token);
        }
        fetchLinkToken();
        

    }, [user?.id]);

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: async(publicToken) => {
            console.log("Plaid connection successful")

            if(!user || !publicToken) return;

            try{
                await exchangePublicToken(user.id, publicToken);
                await savePlaidAccounts(user.id);
                await savePlaidTransactions(user.id);

                onLinked()
            } catch (error) {
                console.error("Plaid connection error", error)
            }
        }
    });

    return (
        <button className="plaid-link-button" onClick={open} disabled={!ready}> 
            Connect Bank Account
        </button>
    )
}