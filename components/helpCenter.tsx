"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, HelpCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  { question: "Come posso aggiungere una nuova spesa?", answer: "Vai nella sezione 'Spese' e clicca su 'Aggiungi Spesa'. Inserisci i dettagli e salva." },
  { question: "Come posso vedere la mia analisi finanziaria?", answer: "Clicca su 'Analisi Finanziaria' nel menu principale per visualizzare il riepilogo delle entrate e uscite." },
  { question: "Posso sincronizzare l'app con il mio conto bancario?", answer: "Al momento non supportiamo la sincronizzazione diretta con conti bancari." },
  { question: "Come guadagno XP e salgo di livello?", answer: "Completando missioni giornaliere, challenge mensili e registrando entrate e uscite regolarmente." },
];

const HelpCenter = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      toast({ title: "Errore", description: "Compila tutti i campi prima di inviare!" });
      return;
    }
    // 🔹 Simulare trimiterea formularului
    toast({ title: "Messaggio Inviato!", description: "Ti risponderemo al più presto." });
    setEmail("");
    setMessage("");
  };

  return (
    <div className="space-y-6 p-4">
      {/* 🔹 Header */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-500" />
          <CardTitle>Centro di Supporto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Hai bisogno di aiuto? Trova risposte rapide alle tue domande o contattaci direttamente.</p>
        </CardContent>
      </Card>

      {/* 🔹 FAQ Section */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-green-500" />
          <CardTitle>Domande Frequenti (FAQ)</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* 🔹 Contact Form */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Mail className="w-6 h-6 text-red-500" />
          <CardTitle>Contattaci</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold">Email</label>
              <input
                type="email"
                placeholder="Inserisci la tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Messaggio</label>
              <textarea
                placeholder="Scrivi il tuo messaggio..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border p-2 w-full outline-none h-24"
                required
              />
            </div>
            <Button type="submit" className="w-full">Invia Richiesta</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpCenter;
