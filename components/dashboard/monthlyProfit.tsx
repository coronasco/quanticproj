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
import { ChartData, ChartDataset } from "chart.js";

// Register the modules needed for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlyChart = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ChartData<"line", number[], string>>({
    labels: [],
    datasets: [] as ChartDataset<"line", number[]>[],
  });
  
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadChartData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // data for the last 6 months
        const today = new Date();
        const chartData = [];
        const labels = [];

        for (let i = 5; i >= 0; i--) {
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const income = await fetchMonthlyIncome(user.uid, month, year);
          const expenses = await fetchMonthlyExpenses(user.uid, month, year);

          chartData.push({ income, expenses, profit: income - expenses });
          labels.push(`${month}/${year}`);
        }

        // data configuration for the chart component
        setData({
          labels,
          datasets: [
            {
              label: "Incassi (€)",
              data: chartData.map((d) => d.income),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
            {
              label: "Spese (€)",
              data: chartData.map((d) => d.expenses),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
            },
            {
              label: "Profitto (€)",
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
      {loading ? (
        <p>Carico grafico...</p>
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
                text: "Grafico incassi e spese mensili (ultimi 6 mesi)",
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default MonthlyChart;
