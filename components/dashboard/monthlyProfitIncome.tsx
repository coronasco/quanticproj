'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { TrendingUp, TrendingDown, CalendarDays } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Lunile în italiană
const monthName = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

// // Funcție pentru a calcula zilele din lună
// const getDaysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate();

// // Fetch pentru cheltuielile fixe
// const fetchFixedExpenses = async (userId: string, month: number, year: number) => {
//   try {
//     const expensesSnapshot = await getDocs(collection(db, `users/${userId}/fixedExpenses`));
//     return expensesSnapshot.docs.map(doc => doc.data().amount) || [];
//   } catch (error) {
//     console.error("Errore nel recupero delle spese fisse:", error);
//     return [];
//   }
// };

const MonthlyProfitIncome = () => {
  const { user } = useAuth();
  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [previousIncome, setPreviousIncome] = useState<number>(0);
  const [previousExpenses, setPreviousExpenses] = useState<number>(0);
  const [dailyAverage, setDailyAverage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const startOfMonth = Timestamp.fromDate(new Date(selectedYear, selectedMonth - 1, 1));
    const endOfMonth = Timestamp.fromDate(new Date(selectedYear, selectedMonth, 0, 23, 59, 59));

    const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    const startOfPrevMonth = Timestamp.fromDate(new Date(prevYear, prevMonth - 1, 1));
    const endOfPrevMonth = Timestamp.fromDate(new Date(prevYear, prevMonth, 0, 23, 59, 59));

    // 🔹 Ascultă modificările în real-time
    const incomeRef = collection(db, "users", user.uid, "income");
    const expensesRef = collection(db, "users", user.uid, "expenses");
    const fixedExpensesRef = collection(db, "users", user.uid, "fixedExpenses");

    const incomeQuery = query(incomeRef, where("date", ">=", startOfMonth), where("date", "<=", endOfMonth));
    const expensesQuery = query(expensesRef, where("date", ">=", startOfMonth), where("date", "<=", endOfMonth));
    const prevIncomeQuery = query(incomeRef, where("date", ">=", startOfPrevMonth), where("date", "<=", endOfPrevMonth));
    const prevExpensesQuery = query(expensesRef, where("date", ">=", startOfPrevMonth), where("date", "<=", endOfPrevMonth));

    // 🔹 Ascultăm veniturile
    const unsubscribeIncome = onSnapshot(incomeQuery, (snapshot) => {
      const totalIncome = snapshot.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0);
      setIncome(totalIncome);
    });

    // 🔹 Ascultăm cheltuielile normale + fixe
    const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
      const totalExpenses = snapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
      const unsubscribeFixedExpenses = onSnapshot(fixedExpensesRef, (snapshot) => {
        const fixedExpensesTotal = snapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
        setExpenses(totalExpenses + fixedExpensesTotal);
      });
      return unsubscribeFixedExpenses;
    });
  
    // 🔹 Ascultăm veniturile lunii trecute
    const unsubscribePrevIncome = onSnapshot(prevIncomeQuery, (snapshot) => {
      const prevTotalIncome = snapshot.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0);
      setPreviousIncome(prevTotalIncome);
    });
  
    // 🔹 Ascultăm cheltuielile lunii trecute
    const unsubscribePrevExpenses = onSnapshot(prevExpensesQuery, (snapshot) => {
      const prevTotalExpenses = snapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
      setPreviousExpenses(prevTotalExpenses);
    });
  
    // 🔹 Calculăm media zilnică
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    setDailyAverage(income / daysInMonth);
  
    setLoading(false);
  
    return () => {
      unsubscribeIncome();
      unsubscribeExpenses();
      unsubscribePrevIncome();
      unsubscribePrevExpenses();
    };
  }, [user, income, selectedMonth, selectedYear]);

  // Calculează profitul și diferențele față de luna trecută
  const profit = income - expenses;
  const previousProfit = previousIncome - previousExpenses;



  const calculatePercentage = (current: number, previous: number) => {
    return previous > 0 ? ((current - previous) / previous) * 100 : 0;
  };

  const incomeChange = calculatePercentage(income, previousIncome);
  const expensesChange = calculatePercentage(expenses, previousExpenses);
  const profitChange = calculatePercentage(profit, previousProfit);

  return (
    <div className="border p-4 md:p-6 rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="text-blue-500 w-5 h-5" />
          <span className="text-sm font-semibold text-blue-600">
            {monthName[selectedMonth - 1]} {selectedYear}
          </span>
        </div>
        <div className="flex gap-1">
          <Select onValueChange={(value) => setSelectedMonth(parseInt(value))} defaultValue={selectedMonth.toString()}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Luna" />
            </SelectTrigger>
            <SelectContent>
              {monthName.map((month, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSelectedYear(parseInt(value))} defaultValue={selectedYear.toString()}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Anul" />
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
      </div>

      <p className="text-gray-500 text-sm mt-2">
        Media giornaliera: <span className="font-semibold">{dailyAverage.toFixed(2)}€</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {/* Card Venituri */}
        <Card className="border shadow-sm">
          <CardHeader><CardTitle className="text-md">Incasso</CardTitle></CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-full" /> : <p className="text-2xl font-bold">{income.toFixed(2)}€</p>}
            <p className="flex items-center gap-1 mt-2">
              <span>
                {incomeChange >= 0 ?
                  <span className="text-xs font-semibold p-1 rounded-md bg-green-100 text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    {incomeChange.toFixed(2)}%
                  </span> :
                  <span className="text-xs font-semibold p-1 rounded-md bg-red-100 text-red-600 flex items-center">
                    <TrendingDown className="w-4 h-4 inline mr-1" />
                    {incomeChange.toFixed(2)}%
                  </span>

                }
              </span>
              <p className="text-xs text-gray-500">
                vs mese scorso
              </p>
            </p>
          </CardContent>
        </Card>

        {/* Card Cheltuieli */}
        <Card className="border shadow-sm">
          <CardHeader><CardTitle className="text-md">Spese</CardTitle></CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-full" /> : <p className="text-2xl font-bold">{expenses.toFixed(2)}€</p>}
            <p className="flex items-center gap-1 mt-2">
              <span>
                {expensesChange >= 0 ?
                  <span className="text-xs font-semibold p-1 rounded-md bg-green-100 text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    {expensesChange.toFixed(2)}%
                  </span> :
                  <span className="text-xs font-semibold p-1 rounded-md bg-red-100 text-red-600 flex items-center">
                    <TrendingDown className="w-4 h-4 inline mr-1" />
                    {expensesChange.toFixed(2)}%
                  </span>

                }
              </span>
              <p className="text-xs text-gray-500">
                vs mese scorso
              </p>
            </p>
          </CardContent>
        </Card>

        {/* Card Profit */}
        <Card className="border shadow-sm">
          <CardHeader><CardTitle className="text-md">Profitto Netto</CardTitle></CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-full" /> : <p className={`text-2xl font-bold ${profit < 0 ? "text-red-600" : ""}`}>{profit.toFixed(2)}€</p>}
            <p className="flex items-center gap-1 mt-2">
              <span>
                {profitChange >= 0 ?
                  <span className="text-xs font-semibold p-1 rounded-md bg-green-100 text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    {profitChange.toFixed(2)}%
                  </span> :
                  <span className="text-xs font-semibold p-1 rounded-md bg-red-100 text-red-600 flex items-center">
                    <TrendingDown className="w-4 h-4 inline mr-1" />
                    {profitChange.toFixed(2)}%
                  </span>

                }
              </span>
              <p className="text-xs text-gray-500">
                vs mese scorso
              </p>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlyProfitIncome;
