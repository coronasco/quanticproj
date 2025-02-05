'use client';

import { useAuth } from "@/context/authContext";
import { usePremium } from "@/hooks/usePremium";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

const PremiumPage = () => {
  const { user } = useAuth();
  const isPremium = usePremium();
  const router = useRouter();

  const handleUpgrade = async () => {
    if (!user) {
      alert("Devi effettuare il login per passare a Premium!");
      return;
    }

    // 🚀 Redirect către Stripe Checkout
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Passa a Premium 🚀</h1>
        <p className="text-gray-600 mb-6">
          Ottieni funzioni avanzate per la gestione del tuo bar o ristorante.
        </p>

        {/* 🔹 Confronto Base vs Premium */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 🆓 Piano Base */}
          <Card className="border border-gray-300">
            <CardHeader>
              <CardTitle className="text-lg">Piano Gratuito</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-3 text-gray-600">
              <p><Check className="w-4 h-4 inline text-green-500" /> Gestione entrate e spese</p>
              <p><Check className="w-4 h-4 inline text-green-500" /> Statistiche base</p>
              <p><X className="w-4 h-4 inline text-red-500" /> Fatture automatiche</p>
              <p><X className="w-4 h-4 inline text-red-500" /> Salvataggio clienti</p>
              <p><X className="w-4 h-4 inline text-red-500" /> Notifiche per spese fisse</p>
              <p><X className="w-4 h-4 inline text-red-500" /> Generazione menu digitale</p>
              <p><X className="w-4 h-4 inline text-red-500" /> Lista della spesa intelligente</p>
            </CardContent>
          </Card>

          {/* 💎 Piano Premium */}
          <Card className="border border-yellow-400 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-500">Piano Premium</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-3 text-gray-600">
              <p><Check className="w-4 h-4 inline text-green-500" /> Tutte le funzioni del Piano Base</p>
              <p><Check className="w-4 h-4 inline text-green-500" /> Generazione fatture PDF</p>
              <p><Check className="w-4 h-4 inline text-green-500" /> Gestione clienti</p>
              <p><Check className="w-4 h-4 inline text-green-500" /> Notifiche per spese fisse</p>
              <p><Check className="w-4 h-4 inline text-green-500" /> Generazione menu digitale con QR Code</p>
              <p><Check className="w-4 h-4 inline text-green-500" /> Lista della spesa con calcolo IVA automatico</p>
              <p><Check className="w-4 h-4 inline text-green-500" /> Supporto prioritario</p>
            </CardContent>
          </Card>
        </div>

        {/* 🔹 Pulsante Upgrade */}
        <button
          onClick={handleUpgrade}
          className={`mt-6 px-6 py-3 text-white font-semibold rounded-md ${
            isPremium ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
          disabled={isPremium}
        >
          {isPremium ? "Già Premium" : "Passa a Premium"}
        </button>
      </div>
    </div>
  );
};

export default PremiumPage;
