"use client";

import { useEffect, useState } from "react";
import { fetchExpenses, deleteExpense } from "@/lib/incomeService";
import { useAuth } from "@/context/authContext";
import { ExpenseType } from "@/lib/types";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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

  useEffect(() => {
    const loadExpenses = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const fetchedExpenses = await fetchExpenses(user.uid);
        setExpenses(fetchedExpenses);
      } catch (error) {
        toast({
          title: "Errore",
          description: "Non ho potuto caricare le spese.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [user, setExpenses, toast]);

  const deleteHandler = async (id: string) => {
    if (!user) return;

    if (window.confirm("Sei sicuro che vuoi cancellare la spesa?")) {
      try {
        await deleteExpense(user.uid, id);
        setExpenses((prev) => prev.filter((expense) => expense.id !== id));
        toast({
          title: "Succes",
          description: "La spese e stata cancellata!",
        });
      } catch (error) {
        toast({
          title: "Errore",
          description: "Non ho potuto cancellare la spese.",
        });
      }
    }
  };

  return (
    <div className="mt-6">
      <h2 className="font-semibold text-lg mb-4">Spese</h2>
      {loading ? (
        <p>Carico...</p>
      ) : (
        <ul className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {expenses.map((expense) => (
            <li key={expense.id} className="border p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <p className="font-semibold">{expense.description}</p>
                <button
                  onClick={() => deleteHandler(expense.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Categoria:</span>{" "}
                  {expense.category}
                </p>
                <p>
                  <span className="font-semibold">Spesa:</span> {expense.amount}€
                </p>
              </div>
              <Badge>
                {
                  expense.date instanceof Date
                    ? expense.date.toLocaleDateString() // Dacă este de tip Date
                    : expense.date.toDate().toLocaleDateString() // Dacă este de tip Timestamp
                }
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;
