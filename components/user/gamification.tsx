"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Trophy, Target } from "lucide-react";

const Gamification = () => {
  const { user } = useAuth();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchUserStats = async () => {
      const userRef = doc(db, `users/${user.uid}/gamification`, "stats");
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setXp(data.xp || 0);
        setLevel(Math.floor(data.xp / 100) + 1);
        setStreak(data.streak || 0);
      } else {
        await setDoc(userRef, { xp: 0, streak: 0 });
      }
    };

    fetchUserStats();
  }, [user]);

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>🎮 Gamification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500 w-5 h-5" />
          <p className="text-sm">Livello: <span className="font-bold">{level}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="text-red-500 w-5 h-5" />
          <p className="text-sm">Streak attuale: <span className="font-bold">{streak} giorni</span></p>
        </div>
        <div className="flex items-center gap-2">
          <Target className="text-blue-500 w-5 h-5" />
          <p className="text-sm">XP: <span className="font-bold">{xp}</span></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Gamification;
