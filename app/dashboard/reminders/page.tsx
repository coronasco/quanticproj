import BillsReminder from '@/components/settings/billsReminder'
import FixedExpenses from '@/components/settings/fixedExpenses'
import React from 'react'

const Reminders = () => {
  return (
    <div className='mt-[60px] md:mt-0'>
        <div className='p-4 md:p-6'>
            <h1 className='mb-6'>Pagamenti in scadenza</h1>
            <div className='mb-4 border-b pb-4'>
                <p className='p-2 border border-yellow-300 rounded-md mb-2 text-sm text-gray-600 bg-yellow-100'>Aggiungi le tue spese fisse. Ricorda che vengono calcolate direttamente nelle spese tutti i mesi, non bisogna inserirle mensilmente.</p>
                <FixedExpenses />
            </div>
            <div>
            <p className='p-2 border border-yellow-300 rounded-md mb-2 text-sm text-gray-600 bg-yellow-100'>Inserisci le tue bollete/fatture e seleziona il giorno della scadenza(valido tutti i mesi), verrai avisato 3 giorni prima.</p>
                <BillsReminder />
            </div>
        </div>
    </div>
  )
}

export default Reminders