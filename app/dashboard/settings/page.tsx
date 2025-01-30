import BillsReminder from '@/components/settings/billsReminder'
import FixedExpenses from '@/components/settings/fixedExpenses'
import { Separator } from '@/components/ui/separator'
import React from 'react'

const Settings = () => {
  return (
    <div className='mt-[70px] p-4 md:-6'>
        <h1 className='text-lg'>Settings</h1>
        <section className='mt-4 p-4 md:p-6 border'>
            <h2 className='text-sm text-gray-700 mb-2'>Spese fisse</h2>
            <p className='text-sm text-gray-500'>Aggiungi le tue spese fisse per poi ricevere notifiche di avviso.</p>
            <Separator className='my-4' />
            <FixedExpenses />
        </section>
        <section className='mt-4 p-4 md:p-6 border'>
            <h2 className='text-sm text-gray-700 mb-2'>Promemoria bollette</h2>
            <p className='text-sm text-gray-500'>Aggiungi le tue bollette per ricevere un promemoria prima della scadenza.</p>
            <Separator className='my-4' />
            <BillsReminder />
        </section>
    </div>
  )
}

export default Settings