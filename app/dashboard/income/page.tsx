'use client'

import { useState } from 'react'
import IncomeList from '@/components/incomeList'
import { IncomeType } from '@/lib/types'
import IncomesBreadcrumb from '@/components/breadcrumbs/incomesBreadcrumb'
import AddIncome from '@/components/addIncome'

const Income = () => {
    const [ income, setIncome ] = useState<IncomeType[]>([])

  return (
    <div className='mt-[60px] md:mt-4 px-4 md:px-6'>
        <IncomesBreadcrumb />
        <AddIncome />
        <IncomeList income={income} setIncome={setIncome}/>
    </div>
  )
}

export default Income