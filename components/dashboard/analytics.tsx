'use client';

import { useEffect, useState } from "react";
import { fetchFinancialData } from "@/lib/analyticsService";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, BarChart, Lightbulb, ArrowUpRight } from "lucide-react";

const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

const Analytics = () => {
    const { user } = useAuth();
    const today = new Date();

    // 🔹 States for selected month & year
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [data, setData] = useState<{
        totalIncome: number;
        totalExpenses: number;
        profit: number;
        dailyAverage: number;
        bestDay: number;
    } | null>(null);

    useEffect(() => {
        if (!user) return;

        // 🔹 Fetch financial data when user changes month
        fetchFinancialData(user.uid, selectedMonth, selectedYear).then(setData);
    }, [user, selectedMonth, selectedYear]);

    // 🔹 Generate dynamic suggestions based on financial data
    const generateSuggestions = () => {
        if (!data) return [];

        const suggestions = [];

        // 🔥 High profitability, suggest reinvestment
        if (data.profit > 5000) {
            suggestions.push("Ottimi profitti! Valuta di reinvestire per espandere il tuo business.");
        }

        // 🔻 Loss-making month
        if (data.profit < 0) {
            suggestions.push("Le tue spese superano i tuoi guadagni. Controlla le spese e rivedi il budget.");
        }

        // ⚠️ High expenses warning
        if (data.totalExpenses > data.totalIncome * 0.7) {
            suggestions.push("Le spese sono molto alte rispetto agli incassi. Taglia le spese non essenziali.");
        }

        // 📉 If daily average is below 100€
        if (data.dailyAverage < 100) {
            suggestions.push("Gli incassi medi sono bassi. Offri promozioni o sconti per aumentare le vendite.");
        }

        // 🚀 If the best day is at the start of the month
        if (data.bestDay <= 10) {
            suggestions.push("L'inizio del mese è forte. Pianifica offerte speciali per aumentare il profitto.");
        }

        // 📅 If the best day is at the end of the month
        if (data.bestDay >= 25) {
            suggestions.push("I clienti spendono di più alla fine del mese. Proponi promozioni last-minute.");
        }

        // 🔄 If profit is stable but not increasing
        if (data.profit > 0 && data.profit < 1000) {
            suggestions.push("Il profitto è positivo, ma potrebbe migliorare. Valuta nuove strategie di marketing.");
        }

        // 📈 If profits are rising
        if (data.profit > 1000 && data.profit < 5000) {
            suggestions.push("Buona crescita! Mantieni le strategie che funzionano e continua a monitorare le spese.");
        }

        return suggestions;
    };

    return (
        <div className="">
            <Card>
                <CardHeader >
                    <div className="flex flex-col xl:flex-row gap-2 xl:items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BarChart className="text-blue-500 w-5 h-5" />
                            <CardTitle className="text-md">Analisi Finanziaria</CardTitle>
                        </div>

                        {/* 🔹 Month & Year Selectors */}
                        <div className="flex gap-2">
                            <Select onValueChange={(value) => setSelectedMonth(parseInt(value))} defaultValue={selectedMonth.toString()}>
                                <SelectTrigger className="w-[100px]">
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
                </CardHeader>

                <CardContent>
                    {data ? (
                        <div className="space-y-4">
                            {/* 🔹 Display financial summary */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-4">
                                    <TrendingUp className="text-green-500 w-6 h-6" />
                                    <p className="text-sm">Incassi</p>
                                    <p className="text-xl font-bold">{data.totalIncome.toFixed(2)}€</p>
                                </Card>
                                <Card className="p-4">
                                    <TrendingDown className="text-red-500 w-6 h-6" />
                                    <p className="text-sm">Spese</p>
                                    <p className="text-xl font-bold">{data.totalExpenses.toFixed(2)}€</p>
                                </Card>
                                <Card className="p-4 col-span-2">
                                    <BarChart className="text-blue-500 w-6 h-6" />
                                    <p className="text-sm">Profitto</p>
                                    <p className={`text-xl font-bold ${data.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                                        {data.profit.toFixed(2)}€
                                    </p>
                                </Card>
                            </div>

                            {/* 🔹 Daily average and best day */}
                            <p className="text-gray-600 text-sm">💰 Media giornaliera: {data.dailyAverage.toFixed(2)}€</p>
                            <p className="text-gray-600 text-sm">📅 Giorno più redditizio: {data.bestDay} {monthNames[selectedMonth - 1]}</p>

                            {/* 🔹 Dynamic Recommendations */}
                            <Card className="p-4 flex gap-2">
                                <div>
                                    <Lightbulb className="text-yellow-500 w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold mb-1">Suggerimenti</p>
                                    <ul className="text-gray-600 text-sm space-y-1">
                                        {generateSuggestions().length > 0 ? (
                                            generateSuggestions().map((suggestion, index) => (
                                                <li key={index}>• {suggestion}</li>
                                            ))
                                        ) : (
                                            <p className="text-green-600">Tutto sembra in ordine! Continua così!</p>
                                        )}
                                    </ul>
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <p>Caricamento dati...</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Analytics;
