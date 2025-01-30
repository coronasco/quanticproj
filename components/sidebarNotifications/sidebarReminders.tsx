'use client';

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
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

  // ✅ Corectăm `fetchReminders` și îl memorăm cu `useCallback`
  const fetchReminders = useCallback(async () => {
    if (!user) return;
    try {
      const billsSnapshot = await getDocs(collection(db, `users/${user.uid}/bills`));
      const fixedExpensesSnapshot = await getDocs(collection(db, `users/${user.uid}/fixedExpenses`));

      const billsData = billsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "bill",
      })) as Reminder[];

      const fixedExpensesData = fixedExpensesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          amount: data.amount,
          dueDay: data.expirationDate || 0, // ✅ Ensure it exists
          type: "fixedExpense",
        };
      }) as Reminder[];

      const allReminders = [...billsData, ...fixedExpensesData];
      allReminders.sort((a, b) => a.dueDay - b.dueDay);
      setReminders(allReminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  }, [user]);

  // ✅ Corectăm `useEffect`, adăugând `fetchReminders` în dependențe
  useEffect(() => {
    if (user) fetchReminders();
  }, [user, fetchReminders]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <h2 className="text-sm font-semibold">Reminders</h2>
      <p className="text-xs text-gray-500">
        Le spese fisse le puoi creare/eliminare in 
        <Link href="/dashboard/settings" className="text-blue-600 italic">
          &quot;settings&quot;
        </Link>
      </p>
      {reminders.length === 0 ? (
        <p className="text-sm text-gray-500">
          Nessuna bolletta o spesa fissa nelle vicinanze.
        </p>
      ) : (
        <ul>
          {reminders.map((reminder) => (
            <li key={reminder.id} className="py-2 md:py-4 border-b">
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
