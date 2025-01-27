'use client'

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from "next/navigation";
import { IncomeType } from "@/lib/types";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

const AuthForm = () => {
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ isRegister, setIsRegister ] = useState(true)

    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if(isRegister) {
                // Create a new user in Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                const user = userCredential.user

                // Create a document(database doc) in Firestor for every registered user
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    createdAt: new Date().toISOString(),
                    income: [],
                    shopping_list: [],
                    notifications: [],
                });

                toast({title: "Success", description: "Registrazione Riuscita"})
                router.push("/dashboard")
            } else {

                // Login
                await signInWithEmailAndPassword(auth, email, password)
                toast({title: "Success", description: "LogIn Riuscito!"})
                router.push('/dashboard')
            }
        } catch (error: any) {
            toast({title: "Errore", description: error.message})
        }

    }
    
    return (
        <div>
            <h2 className="flex justify-center mb-4">{isRegister ? "Registrati" : "LogIn"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="p-2 border outline-none"
                />

                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="p-2 border outline-none"
                />
                <Button type="submit" className="mb-4">{isRegister ? "Registrati" : "Log In"}</Button>

            </form>
            <Button onClick={() => setIsRegister(!isRegister)} variant='link' className="flex w-full justify-center">
                {isRegister ? 'Hai gia un account? Log In' : 'Non hai un account? Registrati!'}
            </Button>
        </div>
    )
}

export default AuthForm;