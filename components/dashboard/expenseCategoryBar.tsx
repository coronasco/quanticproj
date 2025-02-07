'use client';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { usePremium } from "@/hooks/usePremium";
import Premium from "../premium";

// 🔹 Define colors for different expense categories
const categoryColors: Record<string, string> = {
    "General": "#FF6B6B",
    "Rent": "#6B7BFF",
    "Supplies": "#B66BFF",
    "Utilities": "#6BFFFA",
};

// 🔹 Italian month names
const monthNames = [
    "Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
    "Lug", "Ago", "Set", "Ott", "Nov", "Dic"
];

const ExpenseCategoryBar = () => {
    const { user } = useAuth();
    const today = new Date();
    const isPremium = usePremium();

    // 🔹 State for selected month and year
    const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

    const [categoryData, setCategoryData] = useState<{ category: string; amount: number }[]>([]);
    const [totalExpenses, setTotalExpenses] = useState<number>(0);

    useEffect(() => {
        if (!user) return;

        // 🔹 Set date range for the selected month and year
        const startOfMonth = Timestamp.fromDate(new Date(selectedYear, selectedMonth - 1, 1));
        const endOfMonth = Timestamp.fromDate(new Date(selectedYear, selectedMonth, 0, 23, 59, 59));

        const expensesRef = collection(db, "users", user.uid, "expenses");
        const expensesQuery = query(expensesRef, where("date", ">=", startOfMonth), where("date", "<=", endOfMonth));

        // 🔹 Listen for real-time updates
        const unsubscribe = onSnapshot(expensesQuery, (snapshot) => {
            const categoryMap: Record<string, number> = {};
            let total = 0;

            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                const category = data.category || "Altro";
                const amount = data.amount || 0;

                total += amount;
                categoryMap[category] = (categoryMap[category] || 0) + amount;
            });

            const sortedData = Object.entries(categoryMap)
                .map(([category, amount]) => ({ category, amount }))
                .sort((a, b) => b.amount - a.amount);

            setCategoryData(sortedData);
            setTotalExpenses(total);
        });

        return () => unsubscribe();
    }, [user, selectedMonth, selectedYear]);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-md">Distribuzione delle Spese</CardTitle>
                    <div className="flex gap-1 items-center">
                        {/* 🔹 Month selector */}
                        <Select onValueChange={(value) => setSelectedMonth(parseInt(value))} defaultValue={selectedMonth.toString()}>
                            <SelectTrigger className="w-18">
                                <SelectValue placeholder="Mese" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthNames.map((month, index) => (
                                    <SelectItem key={index} value={(index + 1).toString()}>
                                        {month}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* Year Selector */}
                        <Select onValueChange={(value) => setSelectedYear(parseInt(value))} defaultValue={selectedYear.toString()}>
                            <SelectTrigger className="w-[80px]">
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
            </CardHeader>
            <CardContent>
                {isPremium ? 
                    
                    <div>
                        {/* 🔹 Display total expenses */}
                        <div className="w-full h-3 bg-gray-200 rounded-lg overflow-hidden flex">
                            {categoryData.map((item) => (
                                <div
                                    key={item.category}
                                    className="h-full"
                                    style={{
                                        width: `${(item.amount / totalExpenses) * 100}%`,
                                        backgroundColor: categoryColors[item.category] || "#CBD5E1",
                                    }}
                                    title={`${item.category}: ${item.amount.toFixed(2)}€`}
                                />
                            ))}
                        </div>
                        {/* 🔹 Show a legend for categories */}
                        <div className="mt-4 space-y-2">
                            {categoryData.map((item) => (
                                <div key={item.category} className="flex items-center gap-2 text-sm">
                                    <span
                                        className="inline-block w-2 h-2 rounded-full"
                                        style={{ backgroundColor: categoryColors[item.category] || "#CBD5E1" }}
                                    />
                                    <span>{item.category} - <strong>{item.amount.toFixed(2)}€</strong></span>
                                </div>
                            ))}
                        </div>
                    </div>
                    :
                    <Premium />
                }
                
            </CardContent>
        </Card>
    );
};

export default ExpenseCategoryBar;