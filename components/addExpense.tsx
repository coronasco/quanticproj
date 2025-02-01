'use client'
import { useState } from "react"
import { ExpenseType } from '@/lib/types';

import ExpenseForm from "./expenseForm"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

const AddExpense = () => {

    const [expenses, setExpenses] = useState<ExpenseType[]>([]);

    const handleExpenseAdded = (newExpense: ExpenseType) => {
        setExpenses((prev) => [newExpense, ...prev]);
    };


    return (
        <Dialog>
            <DialogTrigger>
                <Button variant='custom'>Aggiungi Spesa</Button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle className="text-left my-4">
                        Aggiungi Spesa
                    </DialogTitle>
                </DialogHeader>
                <ExpenseForm onExpenseAdded={handleExpenseAdded} />
            </DialogContent>
        </Dialog>
    )
}

export default AddExpense