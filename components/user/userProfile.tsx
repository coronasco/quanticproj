"use client";

import { useAuth } from "@/context/authContext";
import { useState } from "react";
import { updateEmail, updatePassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  const handleChangeEmail = async () => {
    if (!user || !newEmail) return;
    try {
      await updateEmail(auth.currentUser!, newEmail);
      toast({ title: "Successo", description: "Email aggiornata con successo!" });
    } catch (error) {
      toast({ title: "Errore", description: "Non è stato possibile aggiornare l'email." });
    }
  };

  const handleChangePassword = async () => {
    if (!user || !newPassword) return;
    try {
      await updatePassword(auth.currentUser!, newPassword);
      toast({ title: "Successo", description: "Password aggiornata con successo!" });
    } catch (error) {
      toast({ title: "Errore", description: "Non è stato possibile aggiornare la password." });
    }
  };

  return (
    <Card className="p-4">
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar>
          <AvatarImage src="/avatar-placeholder.png" />
          <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{user?.email || "Utente sconosciuto"}</CardTitle>
          <p className="text-sm text-gray-500">Gestisci il tuo account</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm">Nuova email:</label>
          <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Inserisci nuova email" />
          <Button onClick={handleChangeEmail} className="mt-2">Aggiorna Email</Button>
        </div>
        <div>
          <label className="text-sm">Nuova password:</label>
          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Inserisci nuova password" />
          <Button onClick={handleChangePassword} className="mt-2">Aggiorna Password</Button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Tema scuro</span>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
