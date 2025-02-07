import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, CheckCircle, LineChart, PlayCircle, UserCheck, Clock } from "lucide-react";

const features = [
  { icon: <LineChart className="w-6 h-6 text-blue-500" />, title: "Analisi Finanziaria", description: "Monitora entrate e uscite con statistiche dettagliate." },
  { icon: <Clock className="w-6 h-6 text-yellow-500" />, title: "Reminder Pagamenti", description: "Ricevi notifiche per non dimenticare mai una fattura." },
  { icon: <CheckCircle className="w-6 h-6 text-green-500" />, title: "Gestione Spese", description: "Organizza le spese e ottimizza il budget del tuo bar o ristorante." },
  { icon: <Trophy className="w-6 h-6 text-purple-500" />, title: "Sistema XP & Livelli", description: "Guadagna XP e badge mentre gestisci le tue finanze." },
];

const testimonials = [
  { name: "Alessandro R.", text: "Un’app fantastica! Mi ha aiutato a gestire il mio bar in modo efficiente e divertente!", image: "/user1.jpg" },
  { name: "Francesca B.", text: "Non ho mai gestito così bene le mie spese! Il sistema XP mi motiva ogni giorno.", image: "/user2.jpg" },
];

export default function Home() {
  return (
    <div className="space-y-16">
      
      {/* 🔹 Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">Gestisci il tuo locale <br /> in modo Smart e Divertente</h1>
        <p className="mt-4 text-lg md:text-xl opacity-90">L'unica app che combina analisi finanziaria con un sistema di gamification.</p>
        <div className="mt-6">
          <Link href="/auth">
            <Button className="px-6 py-3 text-lg bg-white text-blue-600 hover:bg-gray-200">Prova Gratis</Button>
          </Link>
        </div>
      </section>

      {/* 🔹 Features Section */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">🚀 Funzionalità Principali</h2>
        <p className="text-gray-600 mt-2">Semplice, potente e perfetta per il tuo business.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6">
              <CardHeader className="flex items-center justify-center">{feature.icon}</CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 🔹 Gamification Section */}
      <section className="text-center bg-gray-100 py-16">
        <h2 className="text-3xl font-bold">🎮 Guadagna XP & Badge</h2>
        <p className="text-gray-600 mt-2">Ogni azione ti avvicina a nuovi livelli e ricompense.</p>
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <Card className="p-6">
            <CardHeader>
              <Star className="w-10 h-10 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg">Ottieni XP</h3>
              <p className="text-gray-600">Completa missioni giornaliere e challenge mensili.</p>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardHeader>
              <Trophy className="w-10 h-10 text-purple-500" />
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg">Sblocca Badge</h3>
              <p className="text-gray-600">Dimostra la tua costanza e ottieni badge esclusivi.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 🔹 Testimoniale Section */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">💬 Cosa dicono i nostri utenti?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 flex flex-col items-center text-center">
              <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full" />
              <h3 className="font-semibold text-lg mt-4">{testimonial.name}</h3>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 🔹 CTA Final */}
      <section className="text-center py-20 bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <h2 className="text-4xl font-bold">Pronto a trasformare il tuo business?</h2>
        <p className="mt-2 text-lg opacity-90">Unisciti alla community e scopri il potere della gestione smart.</p>
        <div className="mt-6">
          <Link href="/auth">
            <Button className="px-6 py-3 text-lg bg-white text-green-600 hover:bg-gray-200">Inizia Gratis</Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
