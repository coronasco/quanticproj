"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ListChecks, Star, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const missionsList = [
  { id: "add_expense", text: "Aggiungi una spesa oggi", xp: 10 },
  { id: "add_income", text: "Registra un incasso", xp: 10 },
  { id: "view_analytics", text: "Controlla la tua analisi finanziaria", xp: 5 },
  { id: "streak_3_days", text: "Usa l'app per 3 giorni consecutivi", xp: 15 },
  { id: "reduce_expenses", text: "Riduci le spese rispetto a ieri", xp: 20 },
];

const DailyMissions = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<
    { id: string; text: string; xp: number; completed: boolean }[]
  >([]);
  const [streak, setStreak] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchMissions = async () => {
      const today = new Date().toISOString().split("T")[0]; // 📌 Data curentă YYYY-MM-DD
      const userRef = doc(db, `users/${user.uid}/gamification`, "missions");
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().date === today) {
        setMissions(userSnap.data().missions);
      } else {
        const newMissions = missionsList
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((m) => ({ ...m, completed: false }));

        await setDoc(userRef, { date: today, missions: newMissions });
        setMissions(newMissions);
      }
    };

    const fetchStreak = async () => {
      const statsRef = doc(db, `users/${user.uid}/gamification`, "stats");
      const statsSnap = await getDoc(statsRef);
      const today = new Date();
      const lastLogin = statsSnap.exists() ? statsSnap.data().lastLogin?.toDate() : null;

      if (!statsSnap.exists()) {
        await setDoc(statsRef, { xp: 0, streak: 1, lastLogin: today });
        setStreak(1);
        return;
      }

      const diffDays = lastLogin
        ? Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      if (diffDays === 1) {
        await updateDoc(statsRef, { streak: streak + 1, lastLogin: today });
        setStreak(streak + 1);
      } else if (diffDays !== null && diffDays > 1) {
        await updateDoc(statsRef, { streak: 0, lastLogin: today });
        setStreak(0);
      }
    };

    fetchMissions();
    fetchStreak();
  }, [user]);

  const completeMission = async (missionId: string) => {
    if (!user) return;

    const updatedMissions = missions.map((m) =>
      m.id === missionId ? { ...m, completed: true } : m
    );
    setMissions(updatedMissions);

    const userRef = doc(db, `users/${user.uid}/gamification`, "missions");
    await updateDoc(userRef, { missions: updatedMissions });

    const completedMission = missions.find((m) => m.id === missionId);
    if (completedMission) {
      const statsRef = doc(db, `users/${user.uid}/gamification`, "stats");
      const statsSnap = await getDoc(statsRef);
      const currentXP = statsSnap.exists() ? statsSnap.data().xp : 0;
      const newXP = currentXP + completedMission.xp;

      await updateDoc(statsRef, { xp: newXP });

      toast({
        title: "Missione compiuta!",
        description: `Hai vinto ${completedMission.xp} XP!`,
      });
    }

    // 🔹 Check if all missions are completed for XP bonus
    const allCompleted = updatedMissions.every((m) => m.completed);
    if (allCompleted) {
      const statsRef = doc(db, `users/${user.uid}/gamification`, "stats");
      const statsSnap = await getDoc(statsRef);
      const currentXP = statsSnap.exists() ? statsSnap.data().xp : 0;

      await updateDoc(statsRef, { xp: currentXP + 20 }); // XP bonus
      toast({
        title: "Tutte le missioni completate!",
        description: "Hai guadagnato 20 XP bonus!",
      });
      
    }
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="text-blue-500 w-5 h-5" />
          Missioni giornaliere
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="flex justify-between items-center p-2 border rounded-md"
          >
            <p
              className={`text-sm ${
                mission.completed ? "line-through text-gray-400" : "text-gray-700"
              }`}
            >
              {mission.text}
            </p>
            {mission.completed ? (
              <CheckCircle className="text-green-500 w-5 h-5" />
            ) : (
              <Button size="sm" onClick={() => completeMission(mission.id)}>
                Completa
              </Button>
            )}
          </div>
        ))}
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <Star className="text-yellow-500 w-4 h-4" />
          Completa tutte le missioni per ottenere punti esperienza bonus!
        </p>
        
      </CardContent>
    </Card>
  );
};

export default DailyMissions;
