'use client'
import { usePremium } from "@/hooks/usePremium";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Crown, Lightbulb } from "lucide-react";
import Link from "next/link";

const AdSpot = () => {
  const isPremium = usePremium();

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
      <CardHeader className="flex items-center gap-2">
        {isPremium ? <Lightbulb className="w-8 h-8 text-yellow-300" /> : <Crown className="w-5 h-5 text-yellow-400" />}
        <CardTitle className="text-lg text-center">
          {isPremium ? "Sfida la tua conoscenza!" : "Passa a Premium"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-center mb-4 text-white">
          {isPremium 
            ? "Metti alla prova le tue conoscenze finanziarie con il Trivia e guadagna XP extra!" 
            : "Sblocca tutte le funzionalità premium e migliora la gestione del tuo business."}
        </p>
        <div>
            {isPremium ? 
                ""
                :
                <Link href="/premium">
                    <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 transition">
                        Scopri Premium
                    </Button>
                </Link>
            }
        </div>
      </CardContent>
    </Card>
  );
};

export default AdSpot;
