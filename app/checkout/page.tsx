"use client";

import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const router = useRouter();

  const handlePayment = async () => {
    const response = await fetch("/api/checkout", { method: "POST" });
    const { url } = await response.json();

    if (url) {
      window.location.href = url; // Redirecționează către Stripe
    } else {
      alert("Eroare la procesarea plății");
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Finalizza il tuo Upgrade</h2>
      <p className="text-gray-600 mb-6">Piano Premium - 19€/mese</p>
      <button
        onClick={handlePayment}
        className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
      >
        Paga Ora
      </button>
    </div>
  );
};

export default CheckoutPage;
