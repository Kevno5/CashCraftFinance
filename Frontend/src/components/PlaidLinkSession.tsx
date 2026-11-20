
import { useEffect, useRef } from "react";
import { usePlaidLink } from "react-plaid-link";
import {
    exchangePublicToken,
    savePlaidAccounts,
    savePlaidTransactions
} from "../api/plaidApi";

interface PlaidLinkSessionProps {
    linkToken: string;
    userId: number;
    onLinked: () => void;
    onComplete: () => void;
}

export default function PlaidLinkSession({
    linkToken,
    userId,
    onLinked,
    onComplete
}: PlaidLinkSessionProps) {

    const openedRef = useRef(false);
    const successRef = useRef(false);

    
const { open, ready, error } = usePlaidLink({
    token: linkToken,

    onSuccess: async (publicToken) => {
        if (!publicToken) {
            console.error("Plaid did not return a public token");
            onComplete();
            return;
        }

        successRef.current = true;

        try {
            await exchangePublicToken(userId, publicToken);
            await savePlaidAccounts(userId);
            await savePlaidTransactions(userId);

            onLinked();
        } catch (error) {
            console.error("Plaid connection error:", error);
        } finally {
            onComplete();
        }
    },

    onExit: (error) => {
        if (error) {
            console.error("Plaid exit error:", error);
        }

        if (!successRef.current) {
            onComplete();
        }
    },

    onEvent: (eventName) => {
        console.log("Plaid event:", eventName);
    }
});


    useEffect(() => {
        if (error) {
            console.error("Plaid initialization error:", error);
            onComplete();
        }
    }, [error, onComplete]);

    useEffect(() => {
        if (!ready || openedRef.current || error) return;

        openedRef.current = true;

        open();

    }, [ready, open, error]);

    return null;
}
