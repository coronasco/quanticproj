'use client';

import { useEffect, useState } from "react";
import { checkMonthlyChallenge } from "@/lib/monthlyChallenges";
import { useAuth } from "@/context/authContext";
import { Calendar, CheckCircle } from "lucide-react";

interface Challenge {
  text: string;
  reward: number;
  completed: boolean;
  progress: number;
}

const MonthlyChallenges = () => {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchChallenge = async () => {
      const challengeData = await checkMonthlyChallenge(user.uid);
      if (challengeData) setChallenge(challengeData);
    };

    fetchChallenge();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-500" />
        Challenge del Mese
      </h2>
      {challenge ? (
        <div className="space-y-2">
          <p className="text-sm flex items-center gap-2">
            {challenge.completed ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Challenge completata!</span>
              </>
            ) : (
              <>
                🎯 {challenge.text} - <span className="font-semibold">{challenge.reward} XP</span>
              </>
            )}
          </p>
          
          {/* 🔥 Progress Bar */}
          {!challenge.completed && (
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${challenge.progress}%` }}
              ></div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Nessuna challenge attiva.</p>
      )}
    </div>
  );
};

export default MonthlyChallenges;
