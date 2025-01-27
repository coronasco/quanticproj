'use client'

import React, { useState } from 'react'
import { addExpense } from '@/lib/incomeService'
import { useAuth } from '@/context/authContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from './ui/button'
import { ExpenseType } from '@/lib/types'

const ExpenseForm = ({onExpenseAdded}: {onExpenseAdded: (expense: ExpenseType) => void}) => {
    const {user} = useAuth()
    const {toast} = useToast()

    const [amount, setAmount] = useState<number>(0)
    const [description, setDescription] = useState<string>('')
    const [category, setCategory] = useState<string>('General')
    const [date, setDate] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toast({ title: 'Errore', description: 'Utente non autenticato' })
            return
        }

        try {
            const expenseData = {
                amount,
                description,
                category,
                date: new Date(date),
            }

            const addedExpense = await addExpense(user.uid, expenseData)

            toast({ title: 'Spesa aggiunta', description: 'La spesa è stata aggiunta con successo' })

            onExpenseAdded({ ...expenseData, id: addedExpense.id })
            setAmount(0)
            setDescription('')
            setCategory('General')
            setDate('')
        } catch (error) {
            toast({ title: 'Errore', description: 'Errore durante l\'aggiunta della spesa' })
            console.log('Errore durante l\'aggiunta della spesa:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="amount" className='text-xs font-semibold'>Spesa</label>
                <input 
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className='w-full border p-2 outline-none'
                    required 
                />
            </div>
            <div>
                <label htmlFor="description" className='text-xs font-semibold'>Descrizione</label>
                <input 
                    type="text" 
                    id="description" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='w-full border p-2 outline-none'
                    required
                />
            </div>
            <div>
                <label htmlFor="category">Categoria</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className='w-full border p-2 outline-none'>
                    <option value='General'>Generale</option>
                    <option value='Rent'>Affitto</option>
                    <option value='Supplies'>Forniture</option>
                    <option value='Utilities'>Utilità</option>
                </select>
            </div>
            <div>
                <label htmlFor="date">Data</label>
                <input 
                    type="date" 
                    id="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className='w-full border p-2 outline-none'
                    required
                />
            </div>
            <Button type='submit' className='mt-4'>Aggiungi spesa</Button>
        </form>
    )
}

export default ExpenseForm