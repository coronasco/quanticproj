"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { BadgeCheck } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
}

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const achievementsRef = doc(db, `users/${user.uid}/gamification`, "achievements");
        const achievementsSnap = await getDoc(achievementsRef);

        if (achievementsSnap.exists()) {
          const data = achievementsSnap.data().achievements;
          if (Array.isArray(data)) {
            setAchievements(data);
          } else {
            console.warn("Achievements data is not an array:", data);
          }
        } else {
          console.warn("No achievements found for this user.");
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-md text-gray-700 border-b mb-2 pb-2 font-semibold">Badge Ottenuti</h2>
      {loading ? (
        <p className="text-gray-500 text-sm">Caricamento...</p>
      ) : achievements.length === 0 ? (
        <p className="text-gray-500 text-sm">Nessun badge sbloccato ancora.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {achievements.map((ach) => (
            <li key={ach.id} className="flex items-center gap-2 text-sm">
              <BadgeCheck className="text-green-500 w-5 h-5" />
              <div>
                <p className="font-semibold">{ach.name}</p>
                <p className="text-gray-500 text-xs">{ach.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Achievements;
