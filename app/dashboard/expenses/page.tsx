'use client'

import { useState } from 'react';
import ExpensesBreadcrumb from '@/components/breadcrumbs/expensesBreadcrumb';
import { ExpenseType } from '@/lib/types';
import ExpenseList from '@/components/expenseList';
import AddExpense from '@/components/addExpense';

const Expenses = () => {

    const [expenses, setExpenses] = useState<ExpenseType[]>([]);

    return (
      <div className="mt-[60px] md:mt-4 px-4 md:px-6">
        <ExpensesBreadcrumb />
        <div>
          <AddExpense />
        </div>
        <ExpenseList expenses={expenses} setExpenses={setExpenses} /> 
      </div>
    );
}

export default Expenses