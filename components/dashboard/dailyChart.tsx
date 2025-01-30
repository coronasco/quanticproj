'use client';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/authContext";

const mesiItaliani: { [key: string]: string } = {
    January: "Gennaio",
    February: "Febbraio",
    March: "Marzo",
    April: "Aprile",
    May: "Maggio",
    June: "Giugno",
    July: "Luglio",
    August: "Agosto",
    September: "Settembre",
    October: "Ottobre",
    November: "Novembre",
    December: "Dicembre"
};

const getBarColor = (amount: number) => {
    if (amount < 10000) return "#FF4C4C"; // Rosso scuro
    if (amount < 15000) return "#FFA07A"; // Rosso chiaro
    if (amount <= 25000) return "#90EE90"; // Verde chiaro
    return "#008000"; // Verde scuro
};

const getExpenseBarColor = (amount: number) => {
    if (amount < 3000) return "#D3D3D3"; // Grigio chiaro
    if (amount < 5000) return "#A9A9A9"; // Grigio medio
    if (amount < 8000) return "#808080"; // Grigio scuro
    return "#505050"; // Grigio più scuro
};

const DailyChart = () => {
    const { user } = useAuth();
    const [chartData, setChartData] = useState<{ month: string; incasso: number; spese: number }[]>([]);
    const [trend, setTrend] = useState<number>(0);

    useEffect(() => {
        if (user) fetchMonthlyData();
    }, [user]);

    const fetchMonthlyData = async () => {
        if (!user) return;
        try {
            const incomeSnapshot = await getDocs(collection(db, `users/${user.uid}/income`));
            const expensesSnapshot = await getDocs(collection(db, `users/${user.uid}/expenses`));
            
            const monthlyDataMap: Record<string, { incasso: number; spese: number }> = {};
            
            incomeSnapshot.docs.forEach((doc) => {
                const data = doc.data();
                const date = new Date(data.date.seconds * 1000);
                const monthInEnglish = date.toLocaleString('en-US', { month: 'long' });
                const month = mesiItaliani[monthInEnglish] || monthInEnglish;
                
                if (!monthlyDataMap[month]) {
                    monthlyDataMap[month] = { incasso: 0, spese: 0 };
                }
                monthlyDataMap[month].incasso += data.total;
            });

            expensesSnapshot.docs.forEach((doc) => {
                const data = doc.data();
                const date = new Date(data.date.seconds * 1000);
                const monthInEnglish = date.toLocaleString('en-US', { month: 'long' });
                const month = mesiItaliani[monthInEnglish] || monthInEnglish;
                
                if (!monthlyDataMap[month]) {
                    monthlyDataMap[month] = { incasso: 0, spese: 0 };
                }
                monthlyDataMap[month].spese += data.amount;
            });

            const sortedData = Object.entries(monthlyDataMap)
                .map(([month, { incasso, spese }]) => ({ month, incasso, spese }))
                .sort((a, b) => new Date(`01 ${a.month} 2024`).getMonth() - new Date(`01 ${b.month} 2024`).getMonth());
            
            setChartData(sortedData);
            
            if (sortedData.length >= 2) {
                const lastMonth = sortedData[sortedData.length - 1].incasso;
                const previousMonth = sortedData[sortedData.length - 2].incasso;
                setTrend(((lastMonth - previousMonth) / previousMonth) * 100);
            }
        } catch (error) {
            console.error("Errore nel recupero dei dati mensili:", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Entrate e Spese Mensili</CardTitle>
                <CardDescription>Andamento delle entrate e spese negli ultimi mesi</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis />
                        <Tooltip />
                        {chartData.map((entry, index) => (
                            <>
                                <Bar key={`income-${index}`} dataKey="incasso" fill={getBarColor(entry.incasso)} radius={8} />
                                <Bar key={`expense-${index}`} dataKey="spese" fill={getExpenseBarColor(entry.spese)} radius={8} />
                            </>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    {trend >= 0 ? (
                        <>Aumento del {trend.toFixed(2)}% <TrendingUp className="h-4 w-4 text-green-500" /></>
                    ) : (
                        <>Diminuzione del {Math.abs(trend).toFixed(2)}% <TrendingDown className="h-4 w-4 text-red-500" /></>
                    )}
                </div>
                <div className="leading-none text-muted-foreground">
                    Mostrando il totale delle entrate e spese degli ultimi mesi
                </div>
            </CardFooter>
        </Card>
    );
};

export default DailyChart;