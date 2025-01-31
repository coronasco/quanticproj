'use client'

import { useState } from 'react';
import ExpensesBreadcrumb from '@/components/breadcrumbs/expensesBreadcrumb';
import ExpenseForm from '@/components/expenseForm';
import { Button } from '@/components/ui/button'
import { 
    Dialog, 
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { ExpenseType } from '@/lib/types';
import ExpenseList from '@/components/expenseList';

const Expenses = () => {

    const [expenses, setExpenses] = useState<ExpenseType[]>([]);

    const handleExpenseAdded = (newExpense: ExpenseType) => {
      setExpenses((prev) => [newExpense, ...prev]);
    };

    return (
      <div className="mt-[70px] lg:mt-[80px] p-4 md:p-6">
        <ExpensesBreadcrumb />
        <div>
          <Dialog>
            <DialogTrigger>
              <Button className="mt-4" variant='custom'>Aggiungi Spesa</Button>
            </DialogTrigger>
            <DialogContent className="">
              <DialogHeader>
                <DialogTitle className="text-left my-4">
                  Aggiungi Incasso
                </DialogTitle>
              </DialogHeader>
              <ExpenseForm onExpenseAdded={handleExpenseAdded} />
            </DialogContent>
          </Dialog>
        </div>
        <ExpenseList expenses={expenses} setExpenses={setExpenses} /> 
      </div>
    );
}

export default Expenses