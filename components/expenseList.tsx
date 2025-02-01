"use client";

import { useEffect, useState } from "react";
import { fetchExpenses, deleteExpense } from "@/lib/incomeService";
import { useAuth } from "@/context/authContext";
import { ExpenseType } from "@/lib/types";
import { CalendarDays, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const monthNames = [
  "Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
  "Lug", "Ago", "Set", "Ott", "Nov", "Dic"
];

const ExpenseList = ({
  expenses,
  setExpenses,
}: {
  expenses: ExpenseType[];
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseType[]>>;
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  useEffect(() => {
    const loadExpenses = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const fetchedExpenses = await fetchExpenses(user.uid, selectedMonth, selectedYear);
        setExpenses(fetchedExpenses);
      } catch (error) {
        toast({
          title: "Errore",
          description: "Non ho potuto caricare le spese.",
        });
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [user, selectedMonth, selectedYear, setExpenses, toast]);

  const deleteHandler = async (id: string) => {
    if (!user) return;

    if (window.confirm("Sei sicuro che vuoi cancellare la spesa?")) {
      try {
        await deleteExpense(user.uid, id);
        setExpenses((prev) => prev.filter((expense) => expense.id !== id));
        toast({
          title: "Successo",
          description: "La spesa è stata cancellata!",
        });
      } catch (error) {
        toast({
          title: "Errore",
          description: "Non ho potuto cancellare la spesa.",
        });
        console.log(error);
      }
    }
  };

  return (
    <div className="mt-6">
      <h2 className="font-semibold border-b pb-2 flex items-center gap-1">
        <CalendarDays className="w-5 h-5 text-blue-500" />
        Spese - {monthNames[selectedMonth - 1]} {selectedYear}
      </h2>

      {/* 🔹 Selectoare pentru luna și anul */}
      <div className="flex justify-between items-center my-4 w-full border-b pb-2">
        <div className="flex gap-2">
          <Select onValueChange={(value) => setSelectedMonth(parseInt(value))} defaultValue={selectedMonth.toString()}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Luna" />
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((month, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSelectedYear(parseInt(value))} defaultValue={selectedYear.toString()}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Anno" />
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

      {/* 🔹 Skeleton Loader când se încarcă */}
      {loading ? (
        <ul className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="p-4">
              <Skeleton className="h-24 w-full rounded-lg" />
            </li>
          ))}
        </ul>
      ) : expenses.length === 0 ? (
        /* 🔹 Mesaj dacă nu sunt cheltuieli în luna selectată */
        <p className="text-gray-500 text-center py-6">
          Nessuna spesa registrata per questo mese.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-5">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="group relative flex flex-col p-5 bg-white border rounded-xl hover:bg-gray-50 transition-all"
            >
              {/* Titlul și butonul de ștergere */}
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-800">{expense.description}</p>
                <button
                  onClick={() => deleteHandler(expense.id)}
                  className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-all"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>

              {/* Detalii cheltuieli */}
              <div className="mt-3 text-gray-600 text-sm">
                <p>
                  <span className="font-medium text-gray-700">Categoria:</span>{" "}
                  <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs">
                    {expense.category}
                  </span>
                </p>
                <p className="mt-1">
                  <span className="font-medium text-gray-700">Importo:</span>{" "}
                  <span className="text-gray-900 font-semibold">{expense.amount.toFixed(2)}€</span>
                </p>
              </div>

              {/* Data și stilizare extra */}
              <div className="mt-4 flex justify-between items-center">
                <Badge className="text-xs bg-gray-100 text-gray-600 py-1 px-2 rounded-md">
                  {expense.date instanceof Date
                    ? expense.date.toLocaleDateString()
                    : expense.date.toDate().toLocaleDateString()}
                </Badge>
              </div>
            </li>
          ))}
        </ul>

      )}
    </div>
  );
};

export default ExpenseList;
