'use client'

import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { useAuth } from "@/context/authContext"
import { IncomeType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Button } from "./ui/button"
import { Euro, Plus } from "lucide-react"

const IncomeForm = ({ onIncomeAdded }: { onIncomeAdded: (newIncome: IncomeType) => void }) => {

    const { user } = useAuth()
    const [ cash, setCash ] = useState<number>(0)
    const [ pos, setPos ] = useState<number>(0)
    const { toast } = useToast()

    const total = cash + pos

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if(!user) {
            toast({title: "Errore", description: "Devi essere autenticato per aggiungere incassi"})
            return;
        }

        try {
            const incomeRef = collection(db, "users", user.uid, "income");
            const docRef = await addDoc(incomeRef, {
                cash,
                pos,
                total,
                date: Timestamp.now(),
            });
            const newIncome: IncomeType = {
                id: docRef.id,
                cash, 
                pos,
                total,
                date: Timestamp.now(),
            }

            toast({title: "Success", description: "L'incasso e stato salvato"})
            setCash(0)
            setPos(0)
            onIncomeAdded(newIncome)
        }
        catch (error) {
            toast({title: 'Errore', description: "Non ho potuto salvare l'incasso"})
            console.log(error)
        }
    }
    
    return (
        <>
            <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                <div>
                    <label htmlFor="cash" className="text-xs font-semibold">Cash</label>
                    <input 
                        type="number" 
                        placeholder="Cash" 
                        name="cash"
                        id="cash"
                        value={cash}
                        onChange={(e) => setCash(Number(e.target.value))}
                        required
                        className="outline-none border p-2"
                    />
                </div>
                <div>
                    <label htmlFor="pos" className="text-xs font-semibold">POS</label>
                    <input 
                        type="number" 
                        placeholder="POS"
                        name="pos"
                        id="pos"
                        value={pos}
                        onChange={(e) => setPos(Number(e.target.value))}
                        required
                        className="outline-none border p-2"
                    />
                </div>
                <Button type="submit" className="w-full"><Plus /></Button>
                
            </form>
            <p className="flex items-center justify-between mt-2 border-b">Toale <span className="text-xl font-semibold flex items-center">{total}<Euro className="w-5 h-5" /></span></p>
        </>
    )

}

export default IncomeForm