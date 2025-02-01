"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot, collection, query, where, Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const MonthlyGoal = () => {
  const { user } = useAuth();
  const today = new Date();
  const [goal, setGoal] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    const goalRef = doc(db, "users", user.uid, "settings", "monthlyGoal");

    // 🔹 Ascultăm în timp real obiectivul lunar
    const unsubscribeGoal = onSnapshot(goalRef, (docSnap) => {
      if (docSnap.exists()) {
        setGoal(docSnap.data().goal);
      }
    });

    // 🔹 Ascultăm în timp real veniturile lunare
    const startOfMonth = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), 1));
    const endOfMonth = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59));

    const incomeRef = collection(db, "users", user.uid, "income");
    const incomeQuery = query(incomeRef, where("date", ">=", startOfMonth), where("date", "<=", endOfMonth));

    const unsubscribeIncome = onSnapshot(incomeQuery, (snapshot) => {
      const totalIncome = snapshot.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0);
      setProgress(totalIncome); // 🔹 Acum progress-ul este suma veniturilor lunare
    });

    return () => {
      unsubscribeGoal();
      unsubscribeIncome();
    };
  }, [user]);

  // 🔹 Salvăm noul obiectiv
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
          <Input 
            type="number" 
            value={goal} 
            onChange={(e) => setGoal(Number(e.target.value))} 
            placeholder="Es: 5000" 
          />
          <Button onClick={handleSaveGoal}>Salva</Button>
        </div>
        <p className="mt-4 font-semibold text-gray-700 text-xs text-center">
          {progress.toFixed(2)}€ / {goal.toFixed(2)}€
        </p>
        <Progress value={(progress / goal) * 100} className="mt-2"/>
      </CardContent>
    </Card>
  );
};

export default MonthlyGoal;
