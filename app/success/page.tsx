"use client";

import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      setDoc(userRef, { isPremium: true }, { merge: true });

      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    }
  }, [user, router]);

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Pagamento riuscito! 🎉</h2>
      <p className="text-gray-600">Ora hai accesso al piano Premium.</p>
      <p className="text-gray-500">Verrai reindirizzato alla Dashboard...</p>
    </div>
  );
};

export default SuccessPage;
