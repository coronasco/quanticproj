'use client'

import { useState } from 'react'
import IncomeForm from '@/components/incomeForm'
import IncomeList from '@/components/incomeList'
import { Button } from '@/components/ui/button'
import { 
    Dialog, 
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import IncomeBreadcrumb from '@/components/breadcrumbs/incomeBreadcrumb'

const Income = () => {
    const [ income, setIncome ] = useState<any[]>([])

    const handleIncomeAdded = (newIncome: any) => {
        setIncome((prev) => [newIncome, ...prev])
    }
  return (
    <div className='mt-[80px] md:mt-[80px] px-4 md:px-6'>
        <IncomeBreadcrumb />
        
        <Dialog>
            <DialogTrigger>
                <Button className='mt-4'>Aggiungi Incasso</Button>
            </DialogTrigger>
            <DialogContent className=''>
                <DialogHeader>
                    <DialogTitle className='text-left my-4'>Aggiungi Incasso</DialogTitle>
                </DialogHeader>
                <IncomeForm onIncomeAdded={handleIncomeAdded}/>
            </DialogContent>
        </Dialog>
        <IncomeList income={income} setIncome={setIncome}/>
    </div>
  )
}

export default Income