'use client';

import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { resetMonthlyPayments } from "@/lib/financeService";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Clock, CheckCircle } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

interface Expense {
    id: string;
    name: string;
    amount: number;
    expirationDate: number;
    isPaid: boolean;
}

const FixedExpenses = () => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [expenseList, setExpenseList] = useState<Expense[]>([]);
    const [newExpense, setNewExpense] = useState({
        name: '',
        amount: 0,
        expirationDay: 1,
    });

    const toggle = () => {
        setOpen(!open);
    };

    // 📌 Funcție de încărcare a cheltuielilor din Firestore
    const fetchExpenses = useCallback(async () => {
        if (!user) return;
        try {
            const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'fixedExpenses'));
            const expensesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expense[];
            setExpenseList(expensesData);
        } catch (error) {
            console.error("Errore nel recupero delle spese fisse:", error);
        }
    }, [user]); 

    // ✅ Apelăm `fetchExpenses` la montare și când `user` se schimbă
    useEffect(() => {
        if (user) fetchExpenses();
    }, [user, fetchExpenses]);

    useEffect(() => {
        if (user) {
            resetMonthlyPayments(user.uid, "fixedExpenses", setExpenseList);
        }
    }, [user]);

    const handleSaveExpense = async () => {
        if (!user || !newExpense.name || !newExpense.amount || !newExpense.expirationDay) return;

        const expenseToAdd: Expense = {
            id: uuidv4(),
            name: newExpense.name,
            amount: newExpense.amount,
            expirationDate: newExpense.expirationDay,
            isPaid: false
        };

        try {
            await setDoc(doc(db, 'users', user.uid, 'fixedExpenses', expenseToAdd.id), expenseToAdd);
            
            console.log("✅ Spesa fissa salvata in Firestore:", expenseToAdd);

            // 🔹 Reîncărcăm lista după salvare
            await fetchExpenses();

            // 🔹 Resetăm formularul
            setNewExpense({ name: '', amount: 0, expirationDay: 1 });
            setOpen(false);
        } catch (error) {
            console.error("❌ Errore durante il salvataggio della spesa fissa:", error);
        }
    };

    const handleDeleteExpense = async (id: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'fixedExpenses', id));
            console.log(`✅ Spesa fissa eliminata: ${id}`);
            await fetchExpenses(); // Reîncărcăm lista după ștergere
        } catch (error) {
            console.error("❌ Errore durante l'eliminazione della spesa fissa:", error);
        }
    };

    const handleMarkAsPaid = async (expenseId: string) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, `users/${user.uid}/fixedExpenses`, expenseId), { isPaid: true });
            setExpenseList(prevExpenses =>
                prevExpenses.map(expense =>
                    expense.id === expenseId ? { ...expense, isPaid: true } : expense
                )
            );
        } catch (error) {
            console.error("❌ Errore nel segnalare come pagato:", error);
        }
    };

    // 🔹 Mark as unpaid
    const handleMarkAsUnpaid = async (expenseId: string) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, `users/${user.uid}/fixedExpenses`, expenseId), { isPaid: false });
            setExpenseList(prevExpenses =>
                prevExpenses.map(expense =>
                    expense.id === expenseId ? { ...expense, isPaid: false } : expense
                )
            );
        } catch (error) {
            console.error("❌ Errore nel segnalare come non pagato:", error);
        }
    };


    return (
        <div>
            <Button onClick={toggle} variant="custom">
                <Plus />
                Aggiungi spesa fissa ...
            </Button>
            {open && (
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Nome spesa"
                        value={newExpense.name}
                        onChange={(e) => setNewExpense((prev) => ({ ...prev, name: e.target.value }))}
                        className="border p-2 w-full"
                    />
                    <input
                        type="number"
                        placeholder="Importo"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense((prev) => ({ ...prev, amount: parseInt(e.target.value) }))}
                        className="border p-2 w-full mt-2"
                    />
                    <select
                        value={newExpense.expirationDay}
                        onChange={(e) => setNewExpense({ ...newExpense, expirationDay: parseInt(e.target.value) })}
                        className="border p-2 w-full mt-2"
                    >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <option key={day} value={day}>{`Giorno ${day}`}</option>
                        ))}
                    </select>
                    <Button className="mt-2" onClick={handleSaveExpense}>Salva</Button> 
                </div>
            )}
            <Separator className="my-4" />
            <div className="">
                {expenseList.length === 0 ? (
                    <p className="text-xs text-gray-500">Al momento non hai setato nessuna spesa fissa.</p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {expenseList.map((expense) => (
                            <li key={expense.id} className={`flex justify-between group p-4 md:p-6 bg-white border ${expense.isPaid ? "border-green-300" : ""}`}>
                                <div>
                                    <div className="flex gap-3 items-center mb-2">
                                        <h3>{expense.name}</h3>
                                        {expense.isPaid && <Badge variant='custom'>Pagato</Badge>}
                                    </div>
                                    <div>
                                        <p>Spesa: <span className="font-semibold">{expense.amount} €</span> </p>
                                        <p className="text-xs">Il giorno {expense.expirationDate} del mese.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {expense.isPaid ? (
                                        <Button size="sm" variant='link' onClick={() => handleMarkAsUnpaid(expense.id)}>
                                            <Clock className="w-4 h-4 mr-2" />
                                            Anulla
                                        </Button>
                                    ) : (
                                        <Button size="sm" variant='outline' onClick={() => handleMarkAsPaid(expense.id)}>
                                            <Clock className="w-4 h-4 mr-2" />
                                            Paga
                                        </Button>
                                    )}
                                    <Button onClick={() => handleDeleteExpense(expense.id)} variant='subCustom' className="hidden group-hover:flex">
                                        <Trash className="w-5 h-5" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FixedExpenses;
