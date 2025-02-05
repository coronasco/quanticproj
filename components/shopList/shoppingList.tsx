'use client';

import { useEffect, useState } from "react";
import { fetchShoppingItems, deleteShoppingItem, addShoppingItem } from "@/lib/shoppingService";
import { fetchProducts } from "@/lib/shoppingService"; // Funcție care preia produsele existente
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

const ShoppingList = () => {
    const { user } = useAuth();
    const [shoppingList, setShoppingList] = useState<{ id: string; name: string; price: number; vat: number; store?: string }[]>([]);
    const [products, setProducts] = useState<{ id: string; name: string; price: number; vat: number; store?: string }[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<typeof products>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const existingProduct = products.find((p) => p.name.toLowerCase() === searchTerm.toLowerCase());

    useEffect(() => {
        if (user) {
            loadShoppingList();
            loadProducts();
        }
    }, [user]);

    // 🔹 Obține lista de cumpărături salvată
    const loadShoppingList = async () => {
        if (!user) return;
        const items = await fetchShoppingItems(user.uid) as { id: string; name: string; price: number; vat: number; store?: string }[];
        setShoppingList(items);
    };

    // 🔹 Obține produsele existente
    const loadProducts = async () => {
        if (!user) return;
        const items = await fetchProducts(user.uid);
        setProducts(items);
    };

    // 🔹 Caută produse existente
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (value.length > 0) {
            const filtered = products.filter((item) =>
                item.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredProducts(filtered);
            setDropdownVisible(true);
        } else {
            setDropdownVisible(false);
        }
    };

    // 🔹 Adaugă produsul selectat în listă
    const handleAddItem = async (product: { name: string; price: number; vat: number; store?: string }) => {
        if (!user) return;
        await addShoppingItem(user.uid, product);
        setSearchTerm("");
        setDropdownVisible(false);
        loadShoppingList();
    };

    // 🔹 Șterge produsul din listă
    const handleDeleteItem = async (itemId: string) => {
        if (!user || !itemId) return;
    
        try {
            await deleteShoppingItem(user.uid, itemId);
            setShoppingList((prev) => prev.filter((item) => item.id !== itemId)); // 🔹 Elimină vizual itemul după ștergere
        } catch (error) {
            console.error("Eroare la ștergerea produsului:", error);
        }
    };
    
    
    // 🔹 Grupează produsele după magazin
    const groupedItems = shoppingList.reduce((acc, item) => {
        const store = item.store || "Negozio Sconosciuto";
        if (!acc[store]) acc[store] = [];
        acc[store].push(item);
        return acc;
    }, {} as Record<string, typeof shoppingList>);

    const handleAddToShoppingList = async () => {
        if (!user || !searchTerm.trim()) return;
    
        const newItem = {
            name: searchTerm.trim(),
            price: 0,  // Inițial fără preț
            vat: 0,    // Inițial fără TVA
            store: "Negozio Sconosciuto" // Magazin necunoscut
        };
    
        const savedItem = await addShoppingItem(user.uid, newItem); // 🔹 Returnează ID-ul Firebase
        if (savedItem) {
            setShoppingList((prev) => [...prev, { ...savedItem, vat: savedItem.vat ?? 0 }]); // 🔹 Adăugăm în listă cu ID-ul corect
            setSearchTerm(""); // Resetăm input-ul după adăugare
            setDropdownVisible(false);
        }

    };
    

    // 🔹 Calculează totalul listei
    const totalPrice = shoppingList.reduce((sum, item) => sum + (item.price * (1 + item.vat / 100)), 0);

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Lista delle spese</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        {/* 🔹 Input de căutare produse */}
                        <Input
                            placeholder="Cerca prodotto..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />

                        {/* 🔹 Dropdown pentru selectarea produselor existente */}
                        {dropdownVisible && (
                            <div className="border rounded-md bg-white shadow-md p-2">
                                {!existingProduct && (<div className="p-2 text-sm text-gray-500 flex justify-between items-center">
                                    <span>Questo prodotto non è salvato. Vuoi aggiungerlo alla lista?</span>
                                    <button
                                        onClick={handleAddToShoppingList}
                                        className="bg-blue-500 text-white text-xs p-2 rounded-md hover:bg-blue-600"
                                    >
                                        Salva prodotto
                                    </button>
                                </div>)
                                }
                                {filteredProducts.map((item) => (
                                    <div
                                        key={item.name}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleAddItem({ name: item.name, price: item.price, vat: item.vat, store: item.store })}
                                    >
                                        {item.name} - {item.price * (1 + item.vat / 100)}€
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 🔹 Lista de cumpărături grupată pe magazine */}
                    <div className="mt-6">
                        {Object.keys(groupedItems).map((store) => (
                            <div key={store} className="mb-4">
                                <h3 className="text-md font-semibold text-gray-500 border-b pb-1">{store}</h3>
                                <ul className="mt-2 space-y-2">
                                    {groupedItems[store].map((item) => (
                                        <li key={item.id} className="flex justify-between items-center border p-2 rounded-md group overflow-hidden cursor-pointer">
                                            <span>
                                                {item.name}
                                            </span>
                                            <div className="flex items-center gap-6 translate-x-10 group-hover:translate-x-0 transition-all">
                                                <span className="font-semibold">{(item.price * (1 + item.vat / 100)).toFixed(2)}€</span>
                                                <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700">
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* 🔹 Total final */}
                    <div className="mt-6 text-sm font-bold">
                        Totale: {totalPrice.toFixed(2)}€
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ShoppingList;
