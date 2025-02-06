'use client';

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { resetMonthlyPayments } from "@/lib/financeService";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Clock } from "lucide-react";
import { Separator } from "../ui/separator";
import { v4 as uuidv4 } from "uuid";
import { Badge } from "../ui/badge";

interface Bill {
    id: string;
    name: string;
    amount: number;
    dueDay: number;
    isPaid: boolean;
}

const BillsReminder = () => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [billsList, setBillsList] = useState<Bill[]>([]);
    const [newBill, setNewBill] = useState({
        name: '',
        amount: 0,
        dueDay: 1,
    });

    // 📌 Fetch bills from Firebase
    const fetchBills = useCallback(async () => {
        if (!user) return;
        try {
            const querySnapshot = await getDocs(collection(db, `users/${user.uid}/bills`));
            const billsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Bill[];
            setBillsList(billsData);
        } catch (error) {
            console.error("Error fetching bills:", error);
        }
    }, [user]);

    // 📌 Check for reminders
    const checkForReminders = useCallback(() => {
        const today = new Date();
        const todayDay = today.getDate();
        billsList.forEach((bill) => {
            if (bill.dueDay - todayDay === 1 || bill.dueDay - todayDay === 2) {
                alert(`Reminder: ${bill.name} da ${bill.amount}€ sta per scadere il ${bill.dueDay}`);
            }
        });
    }, [billsList]);

    useEffect(() => {
        if (user) fetchBills();
    }, [user, fetchBills]);

    useEffect(() => {
        checkForReminders();
    }, [checkForReminders]);

    useEffect(() => {
        if (user) {
            resetMonthlyPayments(user.uid, "fixedExpenses", setBillsList);
        }
    }, [user]);

    const handleSaveBill = async () => {
        if (!user || !newBill.name || newBill.amount <= 0 || !newBill.dueDay) return;

        const billToAdd: Bill = {
            id: uuidv4(),
            name: newBill.name,
            amount: newBill.amount,
            dueDay: newBill.dueDay,
            isPaid: false,
        };

        try {
            await setDoc(doc(db, `users/${user.uid}/bills`, billToAdd.id), billToAdd);
            setBillsList((prev) => [...prev, billToAdd]);
            setNewBill({ name: '', amount: 0, dueDay: 1 });
            setOpen(false);
        } catch (error) {
            console.error("Error saving bill:", error);
        }
    };

    const handleDeleteBill = async (id: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, `users/${user.uid}/bills`, id));
            setBillsList((prev) => prev.filter(bill => bill.id !== id));
        } catch (error) {
            console.error("Error deleting bill:", error);
        }
    };

    // Mark as paid
    const handleMarkAsPaid = async (billId: string) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, `users/${user.uid}/bills`, billId), { isPaid: true });
            setBillsList(prevBills =>
                prevBills.map(bill =>
                    bill.id === billId ? { ...bill, isPaid: true } : bill
                )
            );
        } catch (error) {
            console.error("Error marking bill as paid:", error);
        }
    };

    // 🔹 Mark as unpaid
    const handleMarkAsUnpaid = async (billId: string) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, `users/${user.uid}/bills`, billId), { isPaid: false });
            setBillsList(prevBills =>
                prevBills.map(bill =>
                    bill.id === billId ? { ...bill, isPaid: false } : bill
                )
            );
        } catch (error) {
            console.error("Error marking bill as unpaid:", error);
        }
    };


    return (
        <div>
            <Button onClick={() => setOpen(!open)} variant="custom">
                <Plus />
                Aggiungi fattura ...
            </Button>
            {open && (
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Gas / Luce / Rai / Altro"
                        value={newBill.name}
                        onChange={(e) => setNewBill((prev) => ({ ...prev, name: e.target.value }))}
                        className="border p-2 w-full"
                    />
                    <input
                        type="number"
                        placeholder="Importo"
                        value={newBill.amount}
                        onChange={(e) => setNewBill((prev) => ({ ...prev, amount: parseFloat(e.target.value) }))}
                        className="border p-2 w-full mt-2"
                    />
                    <select
                        value={newBill.dueDay}
                        onChange={(e) => setNewBill({ ...newBill, dueDay: parseInt(e.target.value) })}
                        className="border p-2 w-full mt-2"
                    >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <option key={day} value={day}>{`Giorno ${day}`}</option>
                        ))}
                    </select>
                    <Button className="mt-2" onClick={handleSaveBill}>Salva</Button>
                </div>
            )}
            <Separator className="my-4" />
            <div className="">
                {billsList.length <= 0 ? (
                    <p className="text-xs text-gray-500">Non hai impostato alcuna fattura al momento.</p>
                ) : (
                    <ul>
                        {billsList.map((bill) => (
                            <li key={bill.id} className={`flex justify-between items-center border ${bill.isPaid ? "border-green-300" : ""} p-4 md:p-6 bg-white mt-2 group`}>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="font-semibold">{bill.name}</p>
                                        {bill.isPaid && 
                                            <Badge variant='custom'>
                                                Pagato
                                            </Badge>
                                        }
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {bill.amount}€ - {bill.isPaid ? <span>Si ripristina il primo del mese</span> : <span>Scadenza il giorno {bill.dueDay}</span>}  
                                    </p>
                                    
                                </div>
                                <div className="flex gap-4 items-center">
                                    {bill.isPaid ? (
                                        <Button size="sm" variant='link' onClick={() => handleMarkAsUnpaid(bill.id)}>
                                            <Clock className="w-4 h-4 mr-2" />
                                            Anulla
                                        </Button>
                                    ) : (
                                        <Button size="sm" variant='outline' onClick={() => handleMarkAsPaid(bill.id)}>
                                            <Clock className="w-4 h-4 mr-2" />
                                            Paga
                                        </Button>
                                    )}
                                    <Button variant="destructive" onClick={() => handleDeleteBill(bill.id)} className="hidden group-hover:flex">
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

export default BillsReminder;
