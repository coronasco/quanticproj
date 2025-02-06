"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ListChecks, Star } from "lucide-react";
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
  const [missions, setMissions] = useState<{ id: string; text: string; xp: number; completed: boolean }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchMissions = async () => {
      const today = new Date().toISOString().split("T")[0]; // 📌 Data curentă în format YYYY-MM-DD
      const userRef = doc(db, `users/${user.uid}/gamification`, "missions");
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().date === today) {
        setMissions(userSnap.data().missions);
      } else {
        const newMissions = missionsList.sort(() => Math.random() - 0.5).slice(0, 3).map(m => ({ ...m, completed: false }));
        await setDoc(userRef, { date: today, missions: newMissions });
        setMissions(newMissions);
      }
    };

    fetchMissions();
  }, [user]);

  const completeMission = async (missionId: string) => {
    if (!user) return;

    const updatedMissions = missions.map(m => (m.id === missionId ? { ...m, completed: true } : m));
    setMissions(updatedMissions);

    const userRef = doc(db, `users/${user.uid}/gamification`, "missions");
    await updateDoc(userRef, { missions: updatedMissions });

    const completedMission = missions.find(m => m.id === missionId);
    if (completedMission) {
      const statsRef = doc(db, `users/${user.uid}/gamification`, "stats");
      const statsSnap = await getDoc(statsRef);
      const newXP = (statsSnap.exists() ? statsSnap.data().xp : 0) + completedMission.xp;

      await updateDoc(statsRef, { xp: newXP });

      toast({
        title: "Missione compiuta!",
        description: `Hai vinto ${completedMission.xp} XP!`,
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
          <div key={mission.id} className="flex justify-between items-center p-2 border rounded-md">
            <p className={`text-sm ${mission.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
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
