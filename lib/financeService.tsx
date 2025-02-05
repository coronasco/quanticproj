import { db } from "./firebase";
import { doc, updateDoc, collection, getDocs, query, where, writeBatch, setDoc } from "firebase/firestore";

export const shouldResetPayments = async (userId: string) => {
    const today = new Date();
    const resetDateDoc = doc(db, `users/${userId}/metadata`, "lastReset");

    try {
        const resetSnapshot = await getDocs(collection(db, `users/${userId}/metadata`));
        const lastReset = resetSnapshot.docs.find(doc => doc.id === "lastReset")?.data()?.date || null;

        if (!lastReset) {
            // 🔹 Se non c'è nessun reset registrato, lo impostiamo ad oggi
            await setDoc(resetDateDoc, { date: today.toISOString() });
            return true;
        }

        const lastResetDate = new Date(lastReset);
        return today.toDateString() !== lastResetDate.toDateString(); // 🔹 Restituisce TRUE solo se il giorno è diverso

    } catch (error) {
        console.error("Errore nel verificare il reset:", error);
        return false; // 🔹 Se c'è un errore, evitiamo il reset
    }
};

export const resetMonthlyPayments = async (userId: string, collectionName: "bills" | "fixedExpenses", setState: any) => {
    try {
        const today = new Date();
        if (today.getDate() !== 1) {
            console.log("⏳ Il reset avviene solo il primo giorno del mese.");
            return;
        }

        const shouldReset = await shouldResetPayments(userId);
        if (!shouldReset) {
            console.log("🔹 Il reset è già stato eseguito oggi.");
            return;
        }

        const q = query(collection(db, `users/${userId}/${collectionName}`), where("isPaid", "==", true));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);

        snapshot.forEach((doc) => {
            batch.update(doc.ref, { isPaid: false });
        });

        await batch.commit();
        console.log(`✅ Reset completato per ${collectionName}`);

        // 🔹 Aggiorniamo lo stato
        const updatedItems = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isPaid: false,
        }));
        setState(updatedItems);

        // 🔹 Registriamo il reset
        const resetDateDoc = doc(db, `users/${userId}/metadata`, "lastReset");
        await setDoc(resetDateDoc, { date: today.toISOString() });

    } catch (error) {
        console.error("❌ Errore nel reset delle spese:", error);
    }
};

// 🔹 Marchează o factură sau cheltuială fixă drept plătită
export const markAsPaid = async (userId: string, expenseId: string, collectionName: "bills" | "fixedExpenses") => {
    try {
        const docRef = doc(db, `users/${userId}/${collectionName}`, expenseId);
        await updateDoc(docRef, { isPaid: true });

        console.log(`✅ ${collectionName} ${expenseId} marked as paid`);
    } catch (error) {
        console.error("Eroare la marcarea plății:", error);
    }
};
