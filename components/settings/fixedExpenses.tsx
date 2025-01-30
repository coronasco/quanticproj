'use client';

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/context/authContext";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "../ui/separator";

interface Expense {
    id: string
    name: string
    amount: number
    expirationDate: number
}

const FixedExpenses = () => {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [expenseList, setExpenseList] = useState<Expense[]>([])
    const [newExpense, setNewExpense] = useState({
        name: '',
        amount: 0,
        expirationDay: 0,
    })

    const toggle = () => {
        setOpen(!open)
    }

    useEffect(() => {
        if(user)
            fetchExpenses()
    }, [user])

    const fetchExpenses = async () => {
        if(!user) return
        const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'fixedExpenses'))
        const expensesData = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})) as Expense[]
        setExpenseList(expensesData)
    }

    const handleSaveExpense = async () => {
        if(!user || !newExpense.name || !newExpense.amount || !newExpense.expirationDay) return

        const expenseToAdd: Expense = {
            id: uuidv4(),
            name: newExpense.name,
            amount: newExpense.amount,
            expirationDate: newExpense.expirationDay
        }

        await setDoc(doc(db, 'users', user.uid, 'fixedExpenses', expenseToAdd.id), expenseToAdd)
        setExpenseList((prev) => [...prev, expenseToAdd])
        setNewExpense({ name: '', amount: 0, expirationDay: 1 })
        setOpen(false)
    }

    const handleDeleteExpense = async (id: string) => {
        if(!user) return
        await deleteDoc(doc(db, 'users', user.uid, 'fixedExpenses', id))
        setExpenseList((prev) => prev.filter(expense => expense.id !== id))
    }

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
          <Button className="mt-2" onClick={handleSaveExpense}>Salva</Button> {/* Adauga onClick pentru a salva spesa */}
        </div>
      )}
      <Separator className="my-4" />
      <div className="">
        {expenseList.length <= 0 ? (
            <p className="text-xs text-gray-500">Al momento non hai setato nessuna spesa fissa.</p>
        ) : (
            <ul className="flex flex-col gap-3">
            {expenseList.map((expense) => (
                <li key={expense.id} className="flex justify-between group p-4 md:p-6 bg-white border">
                    <div>
                        <h3>{expense.name}</h3>
                        <div>
                            <p>Spesa: <span className="font-semibold">{expense.amount} €</span> </p>
                            <p className="text-xs">Il giorno {expense.expirationDate} del mese.</p>
                        </div>
                    </div>
                    <Button onClick={() => handleDeleteExpense(expense.id)} variant='subCustom' className="hidden group-hover:flex">Elimina</Button>
                </li>
            ))}
            </ul>
        )}
      </div>
    </div>
  );
};

export default FixedExpenses;
