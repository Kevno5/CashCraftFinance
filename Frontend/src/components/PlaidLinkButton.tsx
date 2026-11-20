
import { useState, useCallback } from "react";
import { useAuth } from "../Context/AuthContext";
import { createLinkToken } from "../api/plaidApi";
import PlaidLinkSession from "./PlaidLinkSession";

interface PlaidLinkButtonProps {
    onLinked: () => void;
}

export default function PlaidLinkButton({
    onLinked
}: PlaidLinkButtonProps) {
    const { user } = useAuth();

    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(0);

    async function handleConnectBank() {
        if (!user || loading || linkToken) return;

        setLoading(true);

        try {
            const token = await createLinkToken(user.id);

            if (!token) {
                throw new Error("No Plaid link token was returned");
            }

            setSessionId(prev => prev + 1);
            setLinkToken(token);

        } catch (error) {
            console.error("Failed to create link token:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleComplete = useCallback(() => {
        setLinkToken(null);
    }, []);

    return (
        <>
            <button
                className="plaid-link-button"
                onClick={handleConnectBank}
                disabled={!user || loading || !!linkToken}
            >
                {loading ? "Connecting..." : "Connect Bank Account"}
            </button>

            {user && linkToken && (
                <PlaidLinkSession
                    key={sessionId}
                    linkToken={linkToken}
                    userId={user.id}
                    onLinked={onLinked}
                    onComplete={handleComplete}
                />
            )}
        </>
    );
}
