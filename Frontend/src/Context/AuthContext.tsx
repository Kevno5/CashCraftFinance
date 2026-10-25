import { useState, createContext, useContext } from "react";
import type { ReactNode } from "react";

type User = {
    id: number;
    name: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
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

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if(!context){
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}