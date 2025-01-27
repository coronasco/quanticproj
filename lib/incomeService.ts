import { db } from "./firebase";
import { 
    collection, 
    doc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    query, 
    orderBy,
    startAfter,
    limit 
} from "firebase/firestore";
import { IncomeType } from "./types";

// What this code does is to move the logic of fetching, adding, updating and deleting income data to a separate file.
// This will make the code more modular and easier to test.
// The fetchIncome function fetches income data from the database, while the addIncome function adds income data to the database.
export const fetchIncome = async (
    userId: string, 
    lastVisible: IncomeType
): Promise<{income: IncomeType[], lastVisible: unknown}> => {
    
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
