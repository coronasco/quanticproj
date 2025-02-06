'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

import { Bar, Line } from 'react-chartjs-2';

// 🔹 Înregistrăm modulele necesare
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// 🔹 Props pentru a reutiliza componenta cu orice grafic
interface ChartProps {
    type: "bar" | "line";
    data: any;
    options?: any;
}

const Chart = ({ type, data, options }: ChartProps) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            {type === "bar" ? <Bar data={data} options={options} /> : <Line data={data} options={options} />}
        </div>
    );
};

export default Chart;
