"use client";

import { useState, useEffect } from "react";
import { QUESTIONS } from "@/lib/triviaQuestions";
import { useAuth } from "@/context/authContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// 📌 Definim tipul întrebărilor
interface TriviaQuestion {
  question: string;
  options: string[];
  answer: number;
  xp: number;
}

const Trivia = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]); // ✅ Tipizare corectă
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchXP = async () => {
      const statsRef = doc(db, `users/${user.uid}/gamification`, "stats");
      const statsSnap = await getDoc(statsRef);
      if (statsSnap.exists()) {
        setXp(statsSnap.data().xp || 0);
      }
    };

    const fetchCompletedQuestions = async () => {
      const today = new Date().toISOString().split("T")[0];
      const userRef = doc(db, `users/${user.uid}/gamification`, "trivia");
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().date === today) {
        const answeredQuestions = userSnap.data().questions as string[];
        if (answeredQuestions.length >= QUESTIONS.length) {
          setCompleted(true);
        } else {
          const remainingQuestions = QUESTIONS.filter(q => !answeredQuestions.includes(q.question));
          setQuestions([...remainingQuestions].sort(() => Math.random() - 0.5)); // ✅ Corectare sortare
        }
      } else {
        await setDoc(userRef, { date: today, questions: [] });
        setQuestions([...QUESTIONS].sort(() => Math.random() - 0.5)); // ✅ Corectare sortare
      }
    };

    fetchXP();
    fetchCompletedQuestions();
  }, [user]);

  const handleAnswer = async (index: number) => {
    if (!user || completed) return;

    const currentQuestion = questions[questionIndex];
    if (!currentQuestion) return; // ✅ Verificare existență

    const isCorrect = index === currentQuestion.answer;
    const xpGained = isCorrect ? currentQuestion.xp : 0;

    // 🔔 Show toast notification
    toast({
      title: isCorrect ? "Risposta corretta! 🎉" : "Risposta sbagliata 😢",
      description: isCorrect
        ? `Hai guadagnato ${xpGained} XP!`
        : `La risposta corretta era: ${currentQuestion.options[currentQuestion.answer]}`,
    });

    if (isCorrect) {
      const statsRef = doc(db, `users/${user.uid}/gamification`, "stats");
      const statsSnap = await getDoc(statsRef);
      if (statsSnap.exists()) {
        const newXP = (statsSnap.data().xp || 0) + xpGained;
        await updateDoc(statsRef, { xp: newXP });
        setXp(newXP);
      }
    }

    // 🔄 Save answered question
    const userRef = doc(db, `users/${user.uid}/gamification`, "trivia");
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const answeredQuestions = userSnap.data().questions as string[];
      answeredQuestions.push(currentQuestion.question);
      await updateDoc(userRef, { questions: answeredQuestions });

      if (answeredQuestions.length >= QUESTIONS.length) {
        setCompleted(true);
      }
    }

    // 🔄 Move to the next question
    setQuestionIndex((prev) => (prev + 1 < questions.length ? prev + 1 : 0));
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-md">🎮 Financial Trivia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {completed ? (
          <p className="text-center text-green-600">✅ Hai completato tutte le domande di oggi! Torna domani per altre sfide.</p>
        ) : (
          <>
            <p className="text-sm font-semibold">{questions[questionIndex]?.question ?? "Caricamento domanda..."}</p> {/* ✅ Verificare existență */}
            <div className="space-y-2">
              {questions[questionIndex]?.options?.map((option: string, i: number) => ( // ✅ Tipizare corectă
                <Button key={i} variant="outline" className="w-full" onClick={() => handleAnswer(i)}>
                  {option}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500">📊 XP Attuale: <span className="font-bold">{xp}</span></p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Trivia;
