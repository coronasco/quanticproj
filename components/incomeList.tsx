'use client'

import { useEffect, useState, useCallback } from "react";
import { fetchIncome, deleteIncome, updateIncome } from "@/lib/incomeService";
import { useAuth } from "@/context/authContext";
import { IncomeType } from "@/lib/types";
import { CreditCard, Edit, Euro, HandCoins, Save, Trash, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import { Badge } from "./ui/badge";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { Button } from "./ui/button";

const IncomeList = ({ income, setIncome }: { income: IncomeType[]; setIncome: React.Dispatch<React.SetStateAction<IncomeType[]>> }) => {

    const { user } = useAuth()
    const { toast } = useToast()

    
    const [ lastVisible, setLastVisible ] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
    const [ loading, setLoading ] = useState(false)
    const [ editingId, setEditingId ] = useState<string | null>(null);
    const [ editCash, setEditCash ] = useState<number>(0);
    const [ editPos, setEditPos ] = useState<number>(0);

    const [ filterDate, setFilterDate ] = useState<string>('')


    const loadIncome = useCallback(async () => {
        if(!user || loading) return

        setLoading(true)
        try {
            const { income: newIncome, lastVisible: newLastVisible } = await fetchIncome(user.uid, lastVisible)
            
            // Duplicate data check
            setIncome((prev) => {
                const existingIds = new Set(prev.map((item) => item.id))
                return [...prev, ...newIncome.filter((item) => !existingIds.has(item.id))] as IncomeType[]
            })

            setLastVisible(newLastVisible)
        } catch (error) {
            toast({ title: "Errore", description: "Non ho potuto caricare l'incasso!" });
            console.error("Eroare la încărcarea veniturilor:", error);
        } finally {
            setLoading(false);
        }
    }, [user, loading, lastVisible, setIncome, toast])

    // Delete handler
    const deleteHandler = async (id: string) => {
        if(!user) return

        if(window.confirm("Sei sicuro di voler cancellare questo incasso?")) {
            try {
                await deleteIncome(user.uid, id)
                setIncome((prev) => prev.filter((item) => item.id !== id));
                toast({ title: "Success", description: "L'incasso e stato cancellato!" });
            } catch (error) {
                toast({title: 'Errore', description: "Non ho potuto cancellare l'incasso!"})
                console.log(error)
            }
        }
    }

    // Edit handler
    const startEditing = (id: string, cash: number, pos: number) => {
        setEditingId(id)
        setEditCash(cash)
        setEditPos(pos)
    }

    const saveEdit = async () => {
        if (!editingId || !user) return

        try {
            const updatedData = {
                cash: editCash,
                pos: editPos,
                total: editCash + editPos
            }
            await updateIncome(user.uid, editingId, updatedData)

            setIncome((prev) =>
                prev.map((item) =>
                    item.id === editingId ? { ...item, ...updatedData } : item
                )
            );

            toast({ title: "Success", description: "L'incasso e stato aggiornato!" });
            setEditingId(null)
        } catch (error) {
            toast({title: 'Errore', description: "Qualcosa e andato storto!"})
            console.log(error)
        }
    }

    const cancelEdit = () => {
        setEditingId(null)
    }

    // Filter by date
    const filteredIncome = income.filter((item) => {
        if(!filterDate) return true
        const itemDate = new Date(item.date.toDate()).toISOString().split('T')[0] // (yyyy-mm-dd)
        return itemDate === filterDate;
    })

    useEffect(() => {
        loadIncome() // Load income on mount
    }, [loadIncome])

    return (
        <div className="w-full mt-10">
            <h2 className="font-semibold border-b pb-2">Incassi</h2>
            <div className="flex justify-between items-center my-4 w-full border-b pb-2">
                <div className="flex flex-col">
                    <label htmlFor="filterDate" className="text-xs">Cerca per la data</label>
                    <input 
                        type="date" 
                        id="filterDate" 
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="border p-2 "
                    />
                </div>
                <Button onClick={() => setFilterDate('')}>Reset</Button>
            </div>
            <ul className="grid grid-cols-2 xl:grid-cols-4 gap-3 overflow-hidden">
                {filteredIncome.map((item) => (
                    <li key={item.id} className="flex flex-col border hover:bg-gray-100 transition-all group">
                        {editingId === item.id ? (
                            <div>
                                <span className="p-2 md:p-4 border-b flex items-center justify-between">
                                    <p className="text-xs">{new Date(item.date.toDate()).toLocaleDateString()}</p>
                                    <div className="hidden group-hover:flex items-center gap-2">
                                        <button onClick={cancelEdit}><X className="w-4 h-4 text-gray-500"/></button>
                                        <button onClick={saveEdit} ><Save className="w-4 h-4 text-gray-500"/></button>
                                    </div>
                                </span>
                                <div className="flex items-center text-slate-600 border-b">
                                    <div className="flex items-center w-1/2 p-2">
                                        <div>
                                            <HandCoins className="w-5 h-5 mr-2" />
                                        </div>
                                        <p className="text-xl flex">
                                            <input
                                                type="number"
                                                value={editCash}
                                                onChange={(e) => setEditCash(Number(e.target.value))}
                                                className='w-full outline-none'
                                            />    
                                        €</p>
                                    </div>
                                    <div className="flex items-center w-1/2 p-2">
                                        <div>
                                            <CreditCard className="w-5 h-5 mr-2" />
                                        </div>
                                        <p className="text-xl flex">
                                            <input
                                                type="number"
                                                value={editPos}
                                                onChange={(e) => setEditPos(Number(e.target.value))}
                                                className='w-full outline-none'
                                            />
                                        €</p>
                                    </div>
                                </div>
                                <span className={`p-2 md:p-4 flex justify-end ${item.total < 600 ? "bg-red-100" : "bg-green-200"}`}>
                                    <p className={`text-lg font-semibold flex items-center ${item.total < 600 ? "text-red-500" : "text-green-800"}`}>
                                        {item.total}
                                        <Euro className="w-5 h-5" />
                                    </p>
                                </span>
                            </div>
                        ): (
                            <div className="">
                                <div className="flex items-center p-4">
                                    <div className="basis-1/3">
                                        <hr className={`w-[20px] h-[5px] mb-1 border-none rounded-full ${item.total < 600 ? "bg-red-300" : "bg-green-300"}`}></hr>
                                        <p className="text-lg font-semibold flex items-center gap-1">{item.total} <Euro className="w-5 h-5" /></p>
                                    </div>
                                    <div className="basis-2/3 text-right">
                                        <Badge className="">{new Date(item.date.toDate()).toLocaleDateString()}</Badge>
                                        <div className="mt-1 flex gap-2 items-center justify-end">
                                            <div className="flex gap-1 items-center">
                                                <span>
                                                    <HandCoins className="w-5 h-5" />
                                                </span>
                                                <p>{item.cash}</p>
                                            </div>
                                            <div className="flex gap-1 items-center">
                                                <span>
                                                    <CreditCard className="w-5 h-5" />
                                                </span>
                                                <p>{item.pos}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden group-hover:flex items-center gap-2 p-2">
                                    <button onClick={() => deleteHandler(item.id)}><Trash className="w-4 h-4 text-gray-500"/></button>
                                    <button onClick={() => startEditing(item.id, item.cash, item.pos)} ><Edit className="w-4 h-4 text-gray-500"/></button>
                                </div>

                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default IncomeList