import { useState, useEffect, createContext, useContext } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { getMe } from "../api/authApi";

type User = {
    id: number;
    name: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = sessionStorage.getItem("user");

        if (storedUser) {
            try {
                return JSON.parse(storedUser) as User;
            } catch {
                return null;
            }
        }

        return null;
    });

    // Load the logged-in user from the backend (GET /api/auth/me)
    async function refreshUser() {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        try {
            const me = await getMe();
            // the backend sends "userId", but the frontend uses "id"
            const freshUser: User = { id: me.userId, name: me.name, email: me.email };
            setUser(freshUser);
            sessionStorage.setItem("user", JSON.stringify(freshUser));
        } catch (err) {
            // token expired or invalid: log the user out
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                setUser(null);
            }
        }
    }

    // run once when the app starts
    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}