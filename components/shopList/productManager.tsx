"use client";

import { useState, useEffect } from "react";
import { saveProduct, fetchProducts } from "@/lib/shoppingService";
import { useAuth } from "@/context/authContext";
import { usePremium } from "@/hooks/usePremium";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Premium from "../premium";

const ProductManager = () => {
  const { user } = useAuth();
  const isPremium = usePremium();
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [vat, setVat] = useState("22");
  const [store, setStore] = useState(""); // 🔹 Adăugăm magazinul

  useEffect(() => {
    if (user) {
      fetchProducts(user.uid).then(setProducts);
    }
  }, [user]);

  const handleSaveProduct = async () => {
    if (!user || !name || !price) return;

    const newProduct = await saveProduct(user.uid, {
      name,
      price: parseFloat(price),
      vat: parseFloat(vat),
      store: store || "Negozio Sconosciuto", // 🔹 Dacă nu se introduce magazin, setăm "Necunoscut"
    });

    setProducts((prev) => [...prev, newProduct]);

    // Reset form fields
    setName("");
    setPrice("");
    setVat("19");
    setStore("");
  };

  return (
    <div className="p-4 m-4 md:m-6 border rounded-lg bg-gray-50 mb-6">
      <h2 className="text-lg font-semibold mb-1">Gestisci prodotti</h2>
      <p className="mb-6 text-sm">
        Aggiungi prodotti per poi creare lista spese
      </p>
      {isPremium ? (
        <div className="flex flex-wrap lg:flex-nowrap gap-2 items-end">
          <div className="w-full">
            <label htmlFor="product" className="text-xs">
              Prodotto
            </label>
            <Input
              placeholder="Prodotto"
              id="product"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label htmlFor="price" className="text-xs">
              Prezzo
            </label>
            <Input
              type="number"
              id="price"
              placeholder="Prezzo"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label htmlFor="vat" className="text-xs">
              Iva
            </label>
            <Input
              type="number"
              id="vat"
              placeholder="Iva"
              value={vat}
              onChange={(e) => setVat(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label htmlFor="shop" className="text-xs">
              Negozio
            </label>
            <Input
              placeholder="Negozio"
              id="negozio"
              value={store}
              onChange={(e) => setStore(e.target.value)}
            />{" "}
            {/* 🔹 Magazin */}
          </div>
          <Button onClick={handleSaveProduct} className="mt-2 ">
            Salva Prodotto
          </Button>
        </div>
      ) : (
        <Premium />
      )}
      <div className="mt-6">
        {products.length < 1 ? (
          <p className="text-sm text-gray-500 text-center">
            Non hai aggiunto nessun prodotto!
          </p>
        ) : (
          <Table>
            <TableCaption>Lista dei tuoi prodotti</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Prodotto</TableHead>
                <TableHead className="w-[100px]">Negozio</TableHead>
                <TableHead className="w-[60px]">Iva</TableHead>
                <TableHead className="text-right w-[100px]">Prezzo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.store}</TableCell>
                  <TableCell>{product.vat}%</TableCell>
                  <TableCell className="text-right">
                    {product.price} €
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Prodotti inseriti</TableCell>
                <TableCell className="text-right">{products.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ProductManager;
