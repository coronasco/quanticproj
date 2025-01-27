"use client";

import { useAuth } from "@/context/authContext";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const LogoutButton = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast()


  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth");
      toast({title: "Success", description: "Disconnessione Riuscita"})
    } catch (error: unknown) {
      toast({title: "Errore", description: (error as Error).message})
    }
  };

  return <button onClick={handleLogout} className="p-5 md:p-6 border-l flex items-center"><LogOut className="w-4 h-4" /></button>;
};

export default LogoutButton;
