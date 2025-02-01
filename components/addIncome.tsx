'use client'
import { useState } from "react"
import { IncomeType } from '@/lib/types';

import IncomeForm from "./incomeForm"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

const AddIncome = () => {

    const [ income, setIncome ] = useState<IncomeType[]>([])

    const handleIncomeAdded = (newIncome: IncomeType) => {
        setIncome((prev) => [newIncome, ...prev])
    }


    return (
        <Dialog>
            <DialogTrigger>
                <Button variant='custom'>Aggiungi Incasso</Button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle className="text-left my-4">
                        Aggiungi Incasso
                    </DialogTitle>
                </DialogHeader>
                <IncomeForm onIncomeAdded={handleIncomeAdded} />
            </DialogContent>
        </Dialog>
    )
}

export default AddIncome