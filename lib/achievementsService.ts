import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";

interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: (stats: UserStats) => boolean;
}

interface UserStats {
  xp: number;
  streak: number;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "xp_100", name: "Novizio", description: "Raggiungi 100 XP", condition: (stats) => stats.xp >= 100 },
  { id: "xp_500", name: "Esperto", description: "Raggiungi 500 XP", condition: (stats) => stats.xp >= 500 },
  { id: "streak_7", name: "Costante", description: "Usa l'app per 7 giorni consecutivi", condition: (stats) => stats.streak >= 7 },
  { id: "streak_30", name: "Maestro della Costanza", description: "Usa l'app per 30 giorni consecutivi", condition: (stats) => stats.streak >= 30 },
];

export const checkAndAwardAchievements = async (userId: string | undefined) => {
  if (!userId) return; // 🔹 Verifică dacă `userId` este valid

  const userRef = doc(db, `users/${userId}/gamification`, "stats");
  const achievementsRef = doc(db, `users/${userId}/gamification`, "achievements");

  try {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const stats = userSnap.data() as UserStats;
    let unlockedAchievements: { id: string; name: string; description: string }[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (achievement.condition(stats)) {
        // 🔹 Adăugăm doar `id`, `name` și `description`
        unlockedAchievements.push({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
        });
      }
    }

    if (unlockedAchievements.length > 0) {
      await setDoc(achievementsRef, { achievements: unlockedAchievements }, { merge: true });
    }
  } catch (error) {
    console.error("❌ Errore nel controllo degli achievements:", error);
  }
};
