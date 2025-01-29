'use client'

import { useEffect, useState } from "react";
import { fetchMonthlyIncome, fetchMonthlyExpenses } from "@/lib/incomeService";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { TrendingUp, TrendingDown, CalendarDays } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const monthName = ['Gennaio' , 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']

const MonthlyProfitIncome = ({month}: {month: number}) => {

    const { user } = useAuth()
    const today = new Date()

    // State for the selected month and year
    const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear())

    // State for the income, expenses and daily average
    const [income, setIncome] = useState<number>(0)
    const [expenses, setExpenses] = useState<number>(0)
    const [dailyAverage, setDailyAverage] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const calculateProfit = async () => {
            if (!user) return
            setLoading(true)

            try {
                const totalIncome = await fetchMonthlyIncome(user.uid, selectedMonth, selectedYear)
                const totalExpenses = await fetchMonthlyExpenses(user.uid, selectedMonth, selectedYear)
                setIncome(totalIncome)
                setExpenses(totalExpenses)

                // Calculate daily average
                const today = new Date()
                const currentDay = today.getMonth() + 1 === month ? today.getDate() : 30
                const dailyAverage = totalIncome / currentDay

                setDailyAverage(dailyAverage)
            } catch (error) {
                console.error('Errore nel calcolo del profitto mensile:', error)
            } finally {
                setLoading(false)
            }
        }

        calculateProfit()
        
    }, [user, selectedMonth, selectedYear, month])

    const profit = income - expenses

    return (
      <div className="border p-2 md:p-4 lg:p-6">
        <div>
          <div>
            <div className="flex gap-4 items-center justify-start mb-2">
              <Select
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
                defaultValue={selectedMonth.toString()}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Selectează luna" />
                </SelectTrigger>
                <SelectContent>
                  {monthName.map((month, index) => (
                    <SelectItem key={index} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) => setSelectedYear(parseInt(value))}
                defaultValue={selectedYear.toString()}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Selectează anul" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }).map((_, index) => {
                    const year = today.getFullYear() - index;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 mb-2 mt-4">
              <CalendarDays className="text-blue-500 w-5 h-5" />
              <span className="text-sm font-semibold text-blue-600 flex items-center gap-1">
                {monthName[selectedMonth - 1]} {selectedYear}
              </span>
            </div>
          </div>
          <p className="text-gray-500">
            Media giornaliera -{" "}
            <span className="font-semibold">{dailyAverage.toFixed(2)}€</span>
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {/* 🟢 Card Income */}
          <Card className="border border-green-200 shadow-sm dark:border-gray-700 bg-green-100">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-gray-300">
                <p className="text-lg lg:text-lg">Incasso</p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <p className="text-2xl font-bold text-green-600">
                  {income.toFixed(2)}€
                </p>
              )}
            </CardContent>
          </Card>

          {/* 🔴 Card expenses */}
          <Card className="border border-red-200 shadow-sm dark:border-gray-700 bg-red-100">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-gray-300">
                <p className="text-lg lg:text-lg">Spese</p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <p className="text-2xl font-bold text-red-500">
                  {expenses.toFixed(2)}€
                </p>
              )}
            </CardContent>
          </Card>

          {/* ⚖️ Card Profit */}
          <Card className="border border-cyan-200 shadow-sm dark:border-gray-700 bg-cyan-100">
            <CardHeader>
              <CardTitle className="text-cyan-700 dark:text-gray-300 flex items-center gap-2">
                <div>
                  <p className="text-lg lg:text-xl">Profitto</p>
                </div>
                {profit >= 0 ? (
                  <TrendingUp className="text-green-500 w-5 h-5" />
                ) : (
                  <TrendingDown className="text-red-500 w-5 h-5" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <p
                  className={`text-2xl font-bold ${
                    profit >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {profit.toFixed(2)}€
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
}

export default MonthlyProfitIncome