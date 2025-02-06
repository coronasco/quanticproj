'use client';

import { useState, useEffect } from "react";
import { predictNextMonth } from "@/lib/analyticsService";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart, Lightbulb, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FinancialPrediction = () => {
    const { user } = useAuth();
    const [prediction, setPrediction] = useState<{
        predictedIncome: number;
        predictedExpenses: number;
        predictedProfit: number;
        message: string;
    } | null>(null);

    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        if (!user) return;

        // 🔹 Fetch predicted financial data
        predictNextMonth(user.uid).then(setPrediction);
    }, [user]);

    return (
        <div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between w-full">
                    <div>
                        <CardTitle className="text-md flex items-center gap-2">
                            📈 Previsione Finanziaria - Prossimo Mese
                        </CardTitle>
                    </div>
                    {/* 🔹 Tooltip Info Icon */}
                    <div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        className="text-gray-500 hover:text-gray-700 transition"
                                        onClick={() => setShowTooltip(!showTooltip)}
                                    >
                                        <Info className="w-5 h-5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-sm text-gray-600 max-w-[250px]">
                                    Questa previsione analizza le tendenze passate per stimare i tuoi guadagni e le tue spese nel mese successivo. L'accuratezza dipende dalla quantità di dati disponibili: più dati hai, più precise saranno le previsioni.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </CardHeader>
                <CardContent>
                    {prediction ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-4">
                                    <TrendingUp className="text-green-500 w-6 h-6" />
                                    <p className="text-sm">Incassi Stimati</p>
                                    <p className="text-xl font-bold">{prediction.predictedIncome.toFixed(2)}€</p>
                                </Card>
                                <Card className="p-4">
                                    <TrendingDown className="text-red-500 w-6 h-6" />
                                    <p className="text-sm">Spese Stimate</p>
                                    <p className="text-xl font-bold">{prediction.predictedExpenses.toFixed(2)}€</p>
                                </Card>
                                <Card className="p-4 col-span-2">
                                    <BarChart className="text-blue-500 w-6 h-6" />
                                    <p className="text-sm">Profitto Stimato</p>
                                    <p className={`text-xl font-bold ${prediction.predictedProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                                        {prediction.predictedProfit.toFixed(2)}€
                                    </p>
                                </Card>
                            </div>

                            {/* 🔹 Recommendation Section */}
                            <Card className="p-4 flex gap-2">
                                <div>
                                    <Lightbulb className="text-yellow-500 w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold mb-1">Consiglio</p>
                                    <p className="text-gray-600 text-sm">{prediction.message}</p>
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

export default FinancialPrediction;
