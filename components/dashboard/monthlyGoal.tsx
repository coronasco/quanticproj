'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const MonthlyGoal = () => {
  const { user } = useAuth();
  const [goal, setGoal] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    const goalRef = doc(db, "users", user.uid, "settings", "monthlyGoal");

    const unsubscribe = onSnapshot(goalRef, (docSnap) => {
      if (docSnap.exists()) {
        setGoal(docSnap.data().goal);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleSaveGoal = async () => {
    if (!user) return;
    const goalRef = doc(db, "users", user.uid, "settings", "monthlyGoal");
    await setDoc(goalRef, { goal });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md">Obiettivo Mensile</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">Inserisci il tuo obiettivo di profitto per il mese.</p>
        <div className="flex gap-2 mt-3">
          <Input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} placeholder="Es: 5000" />
          <Button onClick={handleSaveGoal}>Salva</Button>
        </div>
        <p className="mt-4 font-semibold text-gray-700 text-xs text-center">{progress.toFixed(2)}€ / {goal.toFixed(2)}€</p>
        <Progress value={(progress / goal) * 100} className="mt-2"/>
      </CardContent>
    </Card>
  );
};

export default MonthlyGoal;
