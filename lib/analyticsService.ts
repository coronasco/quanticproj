import { db } from "./firebase";
import { collection, getDocs, query, where, Timestamp, orderBy, limit } from "firebase/firestore";

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

/**
 * 📌 Fetch financial data for the last 6 months
 */
export const fetchFinancialHistory = async (userId: string, months: number = 6) => {
    if (!userId) return null;

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - months, 1); // First day of the period
    const startTimestamp = Timestamp.fromDate(startDate);

    try {
        // 🔹 Fetch income data
        const incomeQuery = query(
            collection(db, `users/${userId}/income`),
            where("date", ">=", startTimestamp)
        );
        const incomeSnapshot = await getDocs(incomeQuery);

        // 🔹 Fetch expenses data
        const expensesQuery = query(
            collection(db, `users/${userId}/expenses`),
            where("date", ">=", startTimestamp)
        );
        const expensesSnapshot = await getDocs(expensesQuery);

        // 🔹 Organize data by month
        const dataByMonth: Record<string, { income: number; expenses: number }> = {};

        const formatDate = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}`; // Ex: "2024-05"

        incomeSnapshot.forEach((doc) => {
            const data = doc.data();
            const monthKey = formatDate(data.date.toDate());
            if (!dataByMonth[monthKey]) dataByMonth[monthKey] = { income: 0, expenses: 0 };
            dataByMonth[monthKey].income += data.total || 0;
        });

        expensesSnapshot.forEach((doc) => {
            const data = doc.data();
            const monthKey = formatDate(data.date.toDate());
            if (!dataByMonth[monthKey]) dataByMonth[monthKey] = { income: 0, expenses: 0 };
            dataByMonth[monthKey].expenses += data.amount || 0;
        });

        // 🔹 Convert to array and sort by date
        const financialHistory = Object.keys(dataByMonth)
            .map((month) => ({
                month,
                ...dataByMonth[month],
            }))
            .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

        return financialHistory;
    } catch (error) {
        console.error("❌ Error fetching financial history:", error);
        return null;
    }
};

/**
 * 📌 Predict next month's financial data based on past trends
 */
export const predictNextMonth = async (userId: string) => {
    try {
        // 🔹 Fetch the last 6 months' data
        const incomeRef = collection(db, `users/${userId}/income`);
        const expensesRef = collection(db, `users/${userId}/expenses`);

        const incomeSnapshot = await getDocs(query(incomeRef, orderBy("date", "desc"), limit(6)));
        const expensesSnapshot = await getDocs(query(expensesRef, orderBy("date", "desc"), limit(6)));

        const lastMonthsIncome = incomeSnapshot.docs.map((doc) => doc.data().total || 0);
        const lastMonthsExpenses = expensesSnapshot.docs.map((doc) => doc.data().amount || 0);

        // 🔹 Calculate weighted average (recent months have more influence)
        const weights = [0.5, 0.3, 0.2]; // Last month = 50%, previous = 30%, before = 20%
        const weightedIncome = lastMonthsIncome.slice(0, 3).reduce((sum, val, i) => sum + val * weights[i], 0);
        const weightedExpenses = lastMonthsExpenses.slice(0, 3).reduce((sum, val, i) => sum + val * weights[i], 0);

        // 🔹 Detect trend using a simple linear regression
        const trendIncome = (lastMonthsIncome[0] - lastMonthsIncome[1]) * 0.5;
        const trendExpenses = (lastMonthsExpenses[0] - lastMonthsExpenses[1]) * 0.3;

        // 🔹 Apply seasonality (if the same month last year had a pattern)
        const seasonalFactor = 1.05; // Example: assume next month typically grows by 5%

        // 🔹 Final predicted values
        const predictedIncome = (weightedIncome + trendIncome) * seasonalFactor;
        const predictedExpenses = (weightedExpenses + trendExpenses) * seasonalFactor;
        const predictedProfit = predictedIncome - predictedExpenses;

        // 🔹 Generate AI message based on prediction
        let message = "Bilancio stabile, continua a monitorare le spese.";
        if (predictedProfit < 0) message = "⚠️ Attenzione! Le spese previste superano gli incassi.";
        else if (predictedProfit > weightedIncome * 0.3) message = "✅ Ottime prospettive! Il profitto sta crescendo.";
        else if (trendIncome < 0) message = "📉 Gli incassi sono in calo. Considera nuove strategie di marketing.";

        return {
            predictedIncome,
            predictedExpenses,
            predictedProfit,
            message,
        };
    } catch (error) {
        console.error("Errore nella previsione:", error);
        return { predictedIncome: 0, predictedExpenses: 0, predictedProfit: 0, message: "❌ Errore nel calcolo." };
    }
};