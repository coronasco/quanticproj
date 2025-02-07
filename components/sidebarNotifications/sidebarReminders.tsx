'use client';

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { CalendarDays, CreditCard } from "lucide-react";
import Link from "next/link";

interface Reminder {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  type: "bill" | "fixedExpense";
}

const SidebarReminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    if (!user) return;

    // ✅ Listen to changes in "bills" collection
    const unsubscribeBills = onSnapshot(collection(db, `users/${user.uid}/bills`), (snapshot) => {
      const billsData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          amount: doc.data().amount,
          dueDay: doc.data().dueDay,
          isPaid: doc.data().isPaid,
          type: "bill",
        }))
        .filter((bill) => !bill.isPaid) as Reminder[]; // 🔹 Only unpaid bills

      setReminders((prev) => {
        const fixedExpenses = prev.filter((item) => item.type === "fixedExpense");
        return [...fixedExpenses, ...billsData].sort((a, b) => a.dueDay - b.dueDay);
      });
    });

    // ✅ Listen to changes in "fixedExpenses" collection
    const unsubscribeFixedExpenses = onSnapshot(collection(db, `users/${user.uid}/fixedExpenses`), (snapshot) => {
      const fixedExpensesData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          amount: doc.data().amount,
          dueDay: doc.data().expirationDate || 0, // ✅ Ensure it exists
          isPaid: doc.data().isPaid || false,
          type: "fixedExpense",
        }))
        .filter((expense) => !expense.isPaid) as Reminder[]; // 🔹 Only unpaid expenses

      setReminders((prev) => {
        const bills = prev.filter((item) => item.type === "bill");
        return [...bills, ...fixedExpensesData].sort((a, b) => a.dueDay - b.dueDay);
      });
    });

    return () => {
      unsubscribeBills();
      unsubscribeFixedExpenses();
    };
  }, [user]);


  // ✅ Corectăm `useEffect`, adăugând `fetchReminders` în dependențe
  useEffect(() => {
    if (user) setReminders(reminders);
  }, [user, setReminders]);

  return (
    <div className="space-y-4 p-4 md:p-6 bg-white rounded-md border">
      <h2 className="text-sm font-semibold">Reminders</h2>
      <p className="text-xs text-gray-500">
        Le spese fisse le puoi creare/eliminare in 
        <Link href="/dashboard/reminders" className="text-blue-600 italic">
          &quot;Reminders&quot;
        </Link>
      </p>
      {reminders.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nessuna bolletta o spesa fissa nelle vicinanze.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {reminders.map((reminder) => (
            <li key={reminder.id} className="py-2 md:py-4 border p-2 rounded-md">
              <div className="flex items-center gap-2 justify-between mb-2">
                <div className="flex items-center gap-1">
                  {reminder.type === "bill" ? (
                    <CalendarDays className="text-blue-500 w-5 h-5" />
                  ) : (
                    <CreditCard className="text-red-500 w-5 h-5" />
                  )}
                  <h3 className="text-sm text-gray-600 font-semibold">
                    {reminder.name}
                  </h3>
                </div>
                <span className="font-semibold">{reminder.amount}€</span>
              </div>
              <div className="text-sm text-gray-500">
                <p className="text-xs">
                  Scade il {reminder.dueDay} del mese.
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarReminders;
