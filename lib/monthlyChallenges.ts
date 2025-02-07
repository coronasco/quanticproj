import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const checkMonthlyChallenge = async (userId: string | undefined) => {
  if (!userId) return null;

  const userRef = doc(db, `users/${userId}/gamification`, "stats");

  try {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return null;

    const stats = userSnap.data() || {};

    // 📌 Generăm challenge-uri bazate pe datele reale ale utilizatorului
    const challenges = generateMonthlyChallenges(stats);

    // 📌 Găsim challenge-ul lunii curente
    const today = new Date();
    const currentMonth = today.getMonth(); // 0 = Ianuarie, 1 = Februarie...
    const activeChallenge = challenges[currentMonth];

    if (!activeChallenge) return null;

    const progress = activeChallenge.progress;

    // 📌 Verificăm dacă challenge-ul a fost deja completat
    const alreadyCompleted = stats.completedChallenges?.includes(activeChallenge.id);

    // 📌 Dacă challenge-ul este completat, actualizăm în Firebase
    if (!alreadyCompleted && activeChallenge.completed) {
      await updateDoc(userRef, {
        xp: (stats.xp || 0) + activeChallenge.reward,
        completedChallenges: [...(stats.completedChallenges || []), activeChallenge.id],
      });
    }

    return {
      ...activeChallenge,
      completed: alreadyCompleted || activeChallenge.completed,
      progress,
    };
  } catch (error) {
    console.error("❌ Errore nel controllo della challenge mensile:", error);
    return null;
  }
};

// 🔹 Creăm challenge-uri dinamice pe baza datelor reale ale utilizatorului
const generateMonthlyChallenges = (stats: any) => [
  {
    id: "add_30_transactions",
    text: "Registra almeno 30 transazioni questo mese",
    condition: stats.transactions >= 30,
    progress: Math.min((stats.transactions / 30) * 100, 100),
    reward: 100,
    completed: stats.transactions >= 30,
  },
  {
    id: "streak_10_days",
    text: "Usa l'app per 10 giorni consecutivi",
    condition: stats.streak >= 10,
    progress: Math.min((stats.streak / 10) * 100, 100),
    reward: 75,
    completed: stats.streak >= 10,
  },
  {
    id: "analyze_finances",
    text: "Controlla la tua analisi finanziaria almeno 5 volte",
    condition: stats.analyticsViews >= 5,
    progress: Math.min((stats.analyticsViews / 5) * 100, 100),
    reward: 50,
    completed: stats.analyticsViews >= 5,
  },
  {
    id: "reduce_expenses",
    text: "Riduci le spese del 10% rispetto al mese scorso",
    condition: stats.previousMonthExpenses > stats.currentMonthExpenses * 1.1,
    progress: Math.min((stats.previousMonthExpenses / (stats.currentMonthExpenses * 1.1)) * 100, 100),
    reward: 100,
    completed: stats.previousMonthExpenses > stats.currentMonthExpenses * 1.1,
  },
  {
    id: "save_500",
    text: "Risparmia almeno 500€ questo mese",
    condition: stats.savings >= 500,
    progress: Math.min((stats.savings / 500) * 100, 100),
    reward: 125,
    completed: stats.savings >= 500,
  },
];
