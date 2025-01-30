'use client';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Bell } from "lucide-react";
import { Separator } from "../ui/separator";
import { v4 as uuidv4 } from "uuid";

interface Bill {
    id: string;
    name: string;
    amount: number;
    dueDay: number;
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

    useEffect(() => {
        if (user) fetchBills();
    }, [user]);

    useEffect(() => {
        checkForReminders();
    }, [billsList]);

    const fetchBills = async () => {
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
    };

    const handleSaveBill = async () => {
        if (!user || !newBill.name || newBill.amount <= 0 || !newBill.dueDay) return;

        const billToAdd: Bill = {
            id: uuidv4(),
            name: newBill.name,
            amount: newBill.amount,
            dueDay: newBill.dueDay,
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

    const checkForReminders = () => {
        const today = new Date();
        const todayDay = today.getDate();
        billsList.forEach((bill) => {
            if (bill.dueDay - todayDay === 1 || bill.dueDay - todayDay === 2) {
                alert(`Reminder: ${bill.name} de ${bill.amount}€ este scadent pe data de ${bill.dueDay}`);
            }
        });
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
                            <li key={bill.id} className="flex justify-between items-center border p-4 md:p-6 bg-white mt-2 group">
                                <div>
                                    <p className="font-semibold">{bill.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {bill.amount}€ - Scadenza il giorno {bill.dueDay}
                                    </p>
                                </div>
                                <Button variant="destructive" onClick={() => handleDeleteBill(bill.id)} className="hidden group-hover:flex">
                                    <Trash className="w-5 h-5" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default BillsReminder;