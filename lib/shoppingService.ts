import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

export const fetchProducts = async (userId: string) => {
    const querySnapshot = await getDocs(collection(db, `users/${userId}/products`));
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",  // Asigurăm că avem un nume valid
        price: doc.data().price || 0, // Asigurăm că avem un preț valid
        vat: doc.data().vat || 0,     // Folosim "vat" uniform în loc de "iva"
        store: doc.data().store || "", // Magazin opțional
    }));
};


export const saveProduct = async (userId: string, product: { name: string; price: number; vat: number; store?: string }) => {
    const docRef = await addDoc(collection(db, `users/${userId}/products`), product);
    return { id: docRef.id, ...product };
};
  

export const addShoppingItem = async (userId: string, item: { name: string; price: number; vat?: number; iva?:number; store?: string }) => {
    try {
        const formattedItem = {
            ...item,
            vat: item.vat ?? item.iva ?? 0, // 🔹 Folosim "vat" și dacă nu există, luăm "iva"
        };
        const docRef = await addDoc(collection(db, `users/${userId}/shopping`), formattedItem);
        return { id: docRef.id, ...item }; 
    } catch (error) {
        console.error("Eroare la adăugarea produsului:", error);
        return null
    }
};

export const deleteShoppingItem = async (userId: string, itemId: string) => {
    try {
        const docRef = doc(db, `users/${userId}/shopping`, itemId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Eroare la ștergerea produsului:", error);
    }
};


export const fetchShoppingItems = async (userId: string) => {
    try {
        const querySnapshot = await getDocs(collection(db, `users/${userId}/shopping`));
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || "",
            price: Number(doc.data().price) || 0,  // 🔹 Convertim la număr
            vat: Number(doc.data().vat) || 0,      // 🔹 Convertim la număr
            store: doc.data().store || "Negozio Sconosciuto",
        }));
    } catch (error) {
        console.error("Eroare la obținerea produselor:", error);
        return [];
    }
};

