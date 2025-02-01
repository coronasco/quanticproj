import { db } from "./firebase";
import { 
    QueryDocumentSnapshot, 
    DocumentData,
    collection, 
    doc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    query, 
    orderBy,
    startAfter,
    limit,
    where,
    Timestamp,
} from "firebase/firestore";
import { ExpenseType, IncomeType } from "./types";

/**
 *  INCOME FUNCTIONS
 *  What this code does is to move the logic of fetching, adding, updating and deleting income data to a separate file.
 *  This will make the code more modular and easier to test.
 *  The fetchIncome function fetches income data from the database, while the addIncome function adds income data to the database. 
 */

export const fetchIncome = async (userId: string, month: number, year: number) => {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const incomeRef = collection(db, "users", userId, "income");
    const q = query(incomeRef, where("date", ">=", startOfMonth), where("date", "<=", endOfMonth));

    const snapshot = await getDocs(q);
    const income = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as IncomeType[];

    return { income };
};


// The addIncome function adds income data to the database.
export const addIncome = async (userId: string, incomeData: { cash: number; pos: number; total: number; date: Date }) => {
    const incomeRef = collection(db, 'users', userId, 'income')
    await addDoc(incomeRef, incomeData)
}

// The updateIncome function updates income data in the database.
export const updateIncome = async (userId: string, incomeId: string, updatedData: { cash: number; pos: number; total: number}) => {
    const incomeRef = doc(db, 'users', userId, 'income', incomeId)
    await updateDoc(incomeRef, updatedData)
}

// The deleteIncome function deletes income data from the database.
export const deleteIncome = async (userId: string, incomeId: string) => {
    const incomeRef = doc(db, 'users', userId, 'income', incomeId) 
    await deleteDoc(incomeRef)
}

/**
 * END OF INCOME FUNCTIONS
 */

/**
 * EXPENSE FUNCTIONS
 * ADD, DELETE, EDIT, FETCH
 */

// Add expense function
export const addExpense = async (
    userId: string, 
    expenseData: { amount: number; description: string; category: string; date: Date}
): Promise<{id: string}> => {
    try {
        const expenseRef = collection(db, 'users', userId, 'expenses')
        const docRef = await addDoc(expenseRef, expenseData)
        return { id: docRef.id }
    } catch (error) {
        console.error('Eroare la addExpense:', error)
        throw error
    }
}

// Fetch expense function
export const fetchExpenses = async (userId: string, month: number, year: number): Promise<ExpenseType[]> => {
    if (!userId) return [];
  
    try {
      // 📅 Setează începutul și sfârșitul lunii selectate
      const startOfMonth = Timestamp.fromDate(new Date(year, month - 1, 1));
      const endOfMonth = Timestamp.fromDate(new Date(year, month, 0, 23, 59, 59));
  
      const expensesRef = collection(db, "users", userId, "expenses");
      const q = query(expensesRef, where("date", ">=", startOfMonth), where("date", "<=", endOfMonth));
  
      const snapshot = await getDocs(q);
  
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ExpenseType[];
    } catch (error) {
      console.error("Errore nel recupero delle spese:", error);
      return [];
    }
  };

// Delete expense function
export const deleteExpense = async (userId: string, expenseId: string) => {
    try {
        const expenseRef = doc(db, 'users', userId, 'expenses', expenseId)
        await deleteDoc(expenseRef)
    } catch (error) {
        console.error('Eroare la deleteExpense:', error)
        throw error
    }
}

// Update expense function
export const updateExpense = async (userId: string, expenseId: string, updatedData: Partial<{ amount: number; description: string; category: string; date: Date}>) => {
    try {
        const expenseRef = doc(db, 'users', userId, 'expenses', expenseId)
        await updateDoc(expenseRef, updatedData)
    } catch (error) {
        console.error('Eroare la updateExpense:', error)
        throw error
    }
}