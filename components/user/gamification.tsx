"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Trophy, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { checkAndAwardAchievements } from "@/lib/achievementsService";

const XP_PER_LEVEL = 100; // 🔹 XP necesar pentru Level-Up

const Gamification = () => {
  const { user } = useAuth();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [lastLogin, setLastLogin] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserStats = async () => {
      const userRef = doc(db, `users/${user.uid}/gamification`, "stats");
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setXp(data.xp || 0);
        setLevel(Math.floor(data.xp / XP_PER_LEVEL) + 1);
        setStreak(data.streak || 0);
        setLastLogin(data.lastLogin?.toDate() || null);

        // 🔹 Verifică Daily Streak
        checkDailyStreak(userRef, data.lastLogin?.toDate());
      } else {
        await setDoc(userRef, { xp: 0, streak: 0, lastLogin: new Date() });
      }
    };

    if (user) checkAndAwardAchievements(user.uid);

    fetchUserStats();
  }, [user]);

  const checkDailyStreak = async (userRef: any, lastLoginDate: Date | null) => {
    const today = new Date();
    if (!lastLoginDate) {
      await updateDoc(userRef, { lastLogin: today, streak: 1, xp: xp + 10 });
      setStreak(1);
      setXp(xp + 10);
      return;
    }

    const diffDays = Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      await updateDoc(userRef, { lastLogin: today, streak: streak + 1, xp: xp + 10 });
      setStreak(streak + 1);
      setXp(xp + 10);
    } else if (diffDays > 1) {
      await updateDoc(userRef, { lastLogin: today, streak: 0, xp });
      setStreak(0);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2 border-b pb-2 mb-2">
          Gamification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 🔹 Level & XP */}
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500 w-5 h-5" />
          <p className="text-sm">Livello: <span className="font-bold">{level}</span></p>
        </div>
        <div className="w-full">
          <Progress value={(xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100} />
          <p className="text-xs text-gray-500 mt-1">XP: {xp}/{XP_PER_LEVEL}</p>
        </div>

        {/* 🔹 Daily Streak */}
        <div className="flex items-center gap-2">
          <Flame className="text-red-500 w-5 h-5" />
          <p className="text-sm">Streak attuale: <span className="font-bold">{streak} giorni</span></p>
        </div>

        {/* 🔹 XP Total */}
        <div className="flex items-center gap-2">
          <Target className="text-blue-500 w-5 h-5" />
          <p className="text-sm">XP Totale: <span className="font-bold">{xp}</span></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Gamification;
