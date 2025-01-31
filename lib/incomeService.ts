import { db } from "./firebase";
import { 
    onSnapshot,
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
    where
} from "firebase/firestore";
import { ExpenseType, IncomeType } from "./types";

/**
 *  INCOME FUNCTIONS
 *  What this code does is to move the logic of fetching, adding, updating and deleting income data to a separate file.
 *  This will make the code more modular and easier to test.
 *  The fetchIncome function fetches income data from the database, while the addIncome function adds income data to the database. 
 */

export const fetchIncome = async (
    userId: string, 
    lastVisible: QueryDocumentSnapshot<DocumentData> | null
): Promise<{income: IncomeType[], lastVisible: QueryDocumentSnapshot<DocumentData> | null}> => {
    
    try {
        const incomeRef = collection(db, 'users', userId, 'income');
        const incomeQuery = lastVisible
          ? query(incomeRef, orderBy('date', 'desc'), startAfter(lastVisible), limit(10))
          : query(incomeRef, orderBy('date', 'desc'), limit(10));
    
        const snapshot = await getDocs(incomeQuery);
        const income = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as IncomeType[];
    
        const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
    
        return { income, lastVisible: lastVisibleDoc };
    } catch (error) {
        console.error('Eroare la fetchIncome:', error);
        throw error;
    }
    
}

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
export const fetchExpenses = async ( userId: string ): Promise<ExpenseType[]> => {
    try {
        const expenseRef = collection(db, 'users', userId, 'expenses')
        const expenseQuery = query(expenseRef, orderBy('date', 'desc'))
        const snapshot = await getDocs(expenseQuery)
        return snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            amount: data.amount,
            description: data.description,
            category: data.category,
            date: data.date, // Must be timestamp type
          } as ExpenseType;
        });
    } catch (error) {
        console.error('Eroare la fetchExpenses:', error)
        throw error
    }
}

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

/**
 * END OF EXPENSE FUNCTIONS
 */

/**
 * Monthly report functions
 */

// Fetch monthly report function
// export const fetchMonthlyIncome = async (userId: string, month: number, year: number): Promise<number> => {
//     try {
//         const startMonth = new Date(year, month -1, 1) // first day of the month
//         const endMonth = new Date(year, month, 0) // last day of the month

//         const incomeRef = collection(db, 'users', userId, 'income')
//         const incomeQuery = query(
//             incomeRef,
//             where("date", ">=", startMonth),
//             where("date", "<=", endMonth)
//         )

//         const snapshot = await getDocs(incomeQuery)
//         const totalIncome = snapshot.docs.reduce((sum, doc) => {
//             const data = doc.data() as IncomeType
//             return sum + data.total
//         }, 0)

//         return totalIncome
//     } catch (error) {
//         console.error('Eroare la fetchMonthlyIncome:', error)
//         throw error
//     }
// }



// Fetch monthly expenses function
// export const fetchMonthlyExpenses = async (
//   userId: string,
//   month: number,
//   year: number
// ): Promise<number> => {
//   try {
//     const startOfMonth = new Date(year, month - 1, 1);
//     const endOfMonth = new Date(year, month, 0);

//     const expenseRef = collection(db, "users", userId, "expenses");
//     const expenseQuery = query(
//       expenseRef,
//       where("date", ">=", startOfMonth),
//       where("date", "<=", endOfMonth)
//     );

//     const snapshot = await getDocs(expenseQuery);
//     const totalExpenses = snapshot.docs.reduce((sum, doc) => {
//       const data = doc.data() as ExpenseType;
//       return sum + data.amount;
//     }, 0);

//     return totalExpenses;
//   } catch (error) {
//     console.error("Error fetching monthly expenses:", error);
//     throw error;
//   }
// };