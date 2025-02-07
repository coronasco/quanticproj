"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, CheckCircle, LineChart, UserCheck, Clock, Rocket, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: <LineChart className="w-6 h-6 text-indigo-500" />, title: "Analisi Finanziaria", description: "Monitora entrate e uscite con statistiche dettagliate." },
  { icon: <Clock className="w-6 h-6 text-yellow-500" />, title: "Reminder Pagamenti", description: "Ricevi notifiche per non dimenticare mai una fattura." },
  { icon: <CheckCircle className="w-6 h-6 text-green-500" />, title: "Gestione Spese", description: "Organizza le spese e ottimizza il budget del tuo locale." },
  { icon: <Trophy className="w-6 h-6 text-purple-500" />, title: "Sistema XP & Livelli", description: "Guadagna XP e badge mentre gestisci le tue finanze." },
];

const futureFeatures = [
  { icon: <Rocket className="w-6 h-6 text-blue-500" />, title: "Nuove Statistiche Avanzate", description: "Più insight per ottimizzare il tuo business." },
  { icon: <ShieldCheck className="w-6 h-6 text-green-500" />, title: "Sicurezza Potenziata", description: "Dati criptati e sicurezza di livello enterprise." },
  { icon: <Zap className="w-6 h-6 text-yellow-500" />, title: "Automazione Finanziaria", description: "Gestione smart delle spese ricorrenti." },
];

const faq = [
  { question: "L'app è gratuita?", answer: "Sì! Puoi iniziare gratuitamente e utilizzare tutte le funzionalità base." },
  { question: "Come guadagno XP?", answer: "Completando missioni giornaliere e partecipando alle challenge mensili." },
  { question: "Ci saranno altre funzionalità?", answer: "Assolutamente! Siamo in continua espansione per offrirti il meglio." },
];

export default function LandingPage() {
  return (
    <div className="space-y-20">
      
      {/* 🔹 Hero Section */}
      <section className="text-center py-24 bg-gradient-to-r from-indigo-600 to-purple-800 text-white">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold leading-tight text-white"
        >
          La gestione finanziaria <br /> diventa un gioco!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 text-lg md:text-2xl opacity-90 text-gray-200"
        >
          L'unica app che combina analisi finanziaria con un sistema di gamification.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <Link href="/auth">
            <Button className="px-8 py-4 text-lg bg-white text-indigo-600 hover:bg-gray-200 hover:scale-105 transition-transform font-semibold">
              Prova Gratis Ora
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* 🔹 Features Section */}
      <section className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold">🚀 Funzionalità Principali</h2>
        <p className="text-gray-600 mt-2">Gestione finanziaria semplice e potente per il tuo business.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }}>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-center justify-center">{feature.icon}</CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🔹 Future Features */}
      <section className="text-center bg-gray-100 py-20">
        <h2 className="text-4xl font-bold">🔮 Stiamo Crescendo Velocemente!</h2>
        <p className="text-gray-600 mt-2">Nuove funzionalità in arrivo per rendere la tua esperienza ancora migliore.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {futureFeatures.map((feature, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }}>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-center justify-center">{feature.icon}</CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🔹 FAQ Section */}
      <section className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold">❓ Domande Frequenti</h2>
        <div className="mt-8 space-y-4 text-left max-w-3xl mx-auto">
          {faq.map((item, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
              <Card className="p-6">
                <CardTitle className="text-lg">{item.question}</CardTitle>
                <CardContent>
                  <p className="text-gray-600">{item.answer}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🔹 CTA Final */}
      <section className="text-center py-24 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <h2 className="text-4xl font-bold text-white">Inizia oggi e rivoluziona la tua gestione finanziaria!</h2>
        <div className="mt-6">
          <Link href="/auth">
            <Button className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-200 hover:scale-105 transition-transform">
              Prova Gratis Ora
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
