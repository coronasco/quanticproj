'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { browserLocalPersistence, onAuthStateChanged, setPersistence, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

// Typescript interface for the authenticated user structure
interface AuthUser {
    uid: string;
    email: string | null;
}

// Context type definition for authentication management
interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    logout: () => Promise<void>;
}

// Create authentication context with default values
const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => {}
})

// Authentication Provider component that manages user authentication state
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [ user, setUser ] = useState<AuthUser | null>(null)
    const [ loading, setLoading ] = useState(true) // To avoid premature redirection
    const { toast } = useToast()

    useEffect(() => {
        // 🔹 Set persistence to 'local' so the user stays logged in
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                // 🔹 Listen for authentication state changes
                const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
                    if(currentUser) {
                        setUser({
                            uid: currentUser.uid,
                            email: currentUser.email
                        });
                    } else {
                        setUser(null);
                    }
                    setLoading(false);
                });

                return () => unsubscribe();
            })
            .catch((error) => {
                console.error("Error setting auth persistence:", error);
            });
    }, [])

    const logout = async () => {
        try {
            setLoading(true)
            await signOut(auth)
            setUser(null)
            toast({ title: "Success", description: "Disconnessione riuscita" });
        } catch (error) {
            toast({ title: 'Errore', description: 'Non ho potuto effetuare il logout' })
            console.error(error)
        }
        
    }

    return <AuthContext.Provider value={{user, loading, logout}}>{ children }</AuthContext.Provider>
}

// Custom hook to access the authentication context
export const useAuth = () => useContext(AuthContext)