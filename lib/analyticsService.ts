import { db } from "./firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";

// 📌 Function to fetch income and expenses for the selected month
export const fetchFinancialData = async (userId: string, month: number, year: number) => {
    try {
        // 🔹 Define the start and end of the month
        const startOfMonth = Timestamp.fromDate(new Date(year, month - 1, 1));
        const endOfMonth = Timestamp.fromDate(new Date(year, month, 0, 23, 59, 59));

        // 🔹 Query income and expenses
        const incomeRef = collection(db, `users/${userId}/income`);
        const expensesRef = collection(db, `users/${userId}/expenses`);

        const incomeQuery = query(incomeRef, where("date", ">=", startOfMonth), where("date", "<=", endOfMonth));
        const expensesQuery = query(expensesRef, where("date", ">=", startOfMonth), where("date", "<=", endOfMonth));

        // 🔹 Fetch data
        const incomeSnapshot = await getDocs(incomeQuery);
        const expensesSnapshot = await getDocs(expensesQuery);

        let totalIncome = 0;
        let totalExpenses = 0;
        let dailyIncomeMap: Record<number, number> = {}; // 🔹 Store daily income

        // 🔹 Process income
        incomeSnapshot.forEach((doc) => {
            const data = doc.data();
            totalIncome += data.total || 0;

            const day = data.date.toDate().getDate();
            dailyIncomeMap[day] = (dailyIncomeMap[day] || 0) + data.total;
        });

        // 🔹 Process expenses
        expensesSnapshot.forEach((doc) => {
            const data = doc.data();
            totalExpenses += data.amount || 0;
        });

        // 🔹 Identify the most profitable day
        const bestDay = Object.keys(dailyIncomeMap).reduce((a, b) => 
            dailyIncomeMap[parseInt(a)] > dailyIncomeMap[parseInt(b)] ? a : b, "1"
        );

        // 🔹 Calculate daily average up to last income entry
        const lastIncomeDay = Math.max(...Object.keys(dailyIncomeMap).map(Number));
        const dailyAverage = lastIncomeDay > 0 ? totalIncome / lastIncomeDay : 0;

        return {
            totalIncome,
            totalExpenses,
            profit: totalIncome - totalExpenses,
            dailyAverage,
            bestDay: parseInt(bestDay),
        };

    } catch (error) {
        console.error("❌ Errore durante il recupero dei dati finanziari:", error);
        return null;
    }
};
