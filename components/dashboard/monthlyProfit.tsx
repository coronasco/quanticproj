'use client';

import React, { useState, useEffect } from "react";
import { fetchMonthlyIncome, fetchMonthlyExpenses } from "@/lib/incomeService";
import { useAuth } from "@/context/authContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Înregistrăm modulele necesare pentru Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlyChart = () => {
  const { user } = useAuth();
  const [data, setData] = useState<{ labels: string[]; datasets: any[] }>({
    labels: [], // Etichetele (ex: lunile)
    datasets: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadChartData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Datele pentru ultimele 6 luni
        const today = new Date();
        const chartData = [];
        const labels = [];

        for (let i = 5; i >= 0; i--) {
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const month = date.getMonth() + 1; // Lunile încep de la 0
          const year = date.getFullYear();
          const income = await fetchMonthlyIncome(user.uid, month, year);
          const expenses = await fetchMonthlyExpenses(user.uid, month, year);

          chartData.push({ income, expenses, profit: income - expenses });
          labels.push(`${month}/${year}`);
        }

        // Configurarea datelor pentru grafic
        setData({
          labels, // Etichetele de pe axa X (lunile)
          datasets: [
            {
              label: "Venituri (€)",
              data: chartData.map((d) => d.income),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
            {
              label: "Cheltuieli (€)",
              data: chartData.map((d) => d.expenses),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
            },
            {
              label: "Profit (€)",
              data: chartData.map((d) => d.profit),
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
            },
          ],
        });
      } catch (error) {
        console.error("Error loading chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [user]);

  return (
    <div className="mt-6 p-4 border rounded">
      <h3 className="text-lg font-semibold">Venituri și cheltuieli (ultimele 6 luni)</h3>
      {loading ? (
        <p>Se încarcă...</p>
      ) : (
        <Line
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Grafic venituri și cheltuieli",
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default MonthlyChart;
