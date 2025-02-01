'use client'

import { useEffect, useState, useCallback } from "react";
import { fetchIncome, deleteIncome, updateIncome } from "@/lib/incomeService";
import { useAuth } from "@/context/authContext";
import { IncomeType } from "@/lib/types";
import { CalendarDays, CreditCard, Edit, Euro, HandCoins, Save, Trash, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const monthNames = [
    "Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
    "Lug", "Ago", "Set", "Ott", "Nov", "Dic"
];

const IncomeList = ({ income, setIncome }: { income: IncomeType[]; setIncome: React.Dispatch<React.SetStateAction<IncomeType[]>> }) => {

    // Get user from context
    const { user } = useAuth()
    const { toast } = useToast()



    const [loading, setLoading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editCash, setEditCash] = useState<number>(0);
    const [editPos, setEditPos] = useState<number>(0);

    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());


    const loadIncome = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            const { income: newIncome } = await fetchIncome(user.uid, selectedMonth, selectedYear);
            setIncome(newIncome);
        } catch (error) {
            toast({ title: "Errore", description: "Non ho potuto caricare l'incasso!" });
            console.error("Eroare la încărcarea veniturilor:", error);
        } finally {
            setLoading(false);
        }
    }, [user, selectedMonth, selectedYear, setIncome, toast]);

    // Delete handler
    const deleteHandler = async (id: string) => {
        if (!user) return

        if (window.confirm("Sei sicuro di voler cancellare questo incasso?")) {
            try {
                await deleteIncome(user.uid, id)
                setIncome((prev) => prev.filter((item) => item.id !== id));
                toast({ title: "Success", description: "L'incasso e stato cancellato!" });
            } catch (error) {
                toast({ title: 'Errore', description: "Non ho potuto cancellare l'incasso!" })
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
            toast({ title: 'Errore', description: "Qualcosa e andato storto!" })
            console.log(error)
        }
    }

    const cancelEdit = () => {
        setEditingId(null)
    }

    useEffect(() => {
        loadIncome() // Load income on mount
    }, [loadIncome])

    return (
        <div className="w-full mt-10">
            <h2 className="font-semibold border-b pb-2 flex items-center gap-1">
                <CalendarDays className="w-5 h-5 text-blue-500" />
                Incassi - {monthNames[selectedMonth - 1]} {selectedYear}
            </h2>
            <div className="flex justify-between items-center my-4 w-full border-b pb-2">
                <div className="flex gap-2">
                    <Select onValueChange={(value) => setSelectedMonth(parseInt(value))} defaultValue={selectedMonth.toString()}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Luna" />
                        </SelectTrigger>
                        <SelectContent>
                            {monthNames.map((month, index) => (
                                <SelectItem key={index} value={(index + 1).toString()}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => setSelectedYear(parseInt(value))} defaultValue={selectedYear.toString()}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Anno" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 5 }).map((_, index) => {
                                const year = today.getFullYear() - index;
                                return (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {/* 🔹 Skeleton loader dacă încă se încarcă datele */}
            {loading ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 overflow-hidden mb-5">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <li key={index} className="p-4">
                            <Skeleton className="h-28 w-full rounded-lg" />
                        </li>
                    ))}
                </ul>
            ) : income.length === 0 ? (
                /* 🔹 Mesaj dacă nu există încasări */
                <p className="text-gray-500 text-center py-6">
                    Nessun incasso registrato per questo mese.
                </p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 overflow-hidden mb-5">
                    {income.map((item) => (
                        <li key={item.id} className="flex flex-col hover:bg-gray-100 transition-all group">
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
                            ) : (
                                <Card className="group relative overflow-hidden shadow-sm">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        {/* Left Section */}
                                        <div className="flex flex-col gap-1">
                                            <div className={`w-6 h-1 rounded-full ${item.total < 600 ? "bg-red-400" : "bg-green-400"}`}></div>
                                            <p className="text-xl font-semibold flex items-center gap-1">
                                                {item.total} <Euro className="w-4 h-4 text-gray-500" />
                                            </p>
                                            <Badge>{new Date(item.date.toDate()).toLocaleDateString()}</Badge>
                                        </div>

                                        {/* Right Section */}
                                        <div className="text-right space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <HandCoins className="w-4 h-4 text-yellow-500" />
                                                <p>{item.cash}€</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <CreditCard className="w-4 h-4 text-blue-500" />
                                                <p>{item.pos}€</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                

                                {/* Action Buttons - Visible on hover */}
                                <div className="absolute top-0 right-0 hidden group-hover:flex items-center justify-center gap-2 backdrop-blur-lg w-full h-full">
                                    <button onClick={() => deleteHandler(item.id)} className="p-1 hover:text-red-500">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => startEditing(item.id, item.cash, item.pos)} className="p-1 hover:text-blue-500">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </div>
                            </Card>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default IncomeList