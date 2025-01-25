'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext<{ 
    user: User | null; 
    loading: boolean;
    logout: () => Promise<void>; 
}>({
    user: null,
    loading: true,
    logout: async () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [ user, setUser ] = useState<User | null>(null)
    const [ loading, setLoading ] = useState(true) // To avoid premature redirection
    const { toast } = useToast()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const logout = async () => {
        try {
            setLoading(true)
            await signOut(auth)
            setUser(null)
        } catch (error) {
            toast({ title: 'Errore', description: 'Non ho potuto effetuare il logout' })
            console.error(error)
        }
        
    }

    return <AuthContext.Provider value={{user, loading, logout}}>{ children }</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)