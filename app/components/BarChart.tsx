'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Record {
  date: string;
  amount: number;
}

const BarChart = ({ records }: { records: Record[] }) => {
  const data = {
    labels: records.map((record) =>
      new Date(record.date).toLocaleDateString()
    ),
    datasets: [
      {
        data: records.map((record) => record.amount),
        backgroundColor: records.map((record) =>
          record.amount < 7
            ? 'rgba(239, 68, 68, 0.7)' // red
            : 'rgba(132, 204, 22, 0.7)' // green
        ),
        borderColor: records.map((record) =>
          record.amount < 7 ? 'rgb(239, 68, 68)' : 'rgb(132, 204, 22)'
        ),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: { size: 14, weight: 'bold' as const },
          color: '#374151', // gray-700
        },
        ticks: {
          font: { size: 12 },
          color: '#6b7280', // gray-500
        },
        grid: { display: false },
      },
      y: {
        title: {
          display: true,
          text: 'Hours Slept',
          font: { size: 16, weight: 'bold' as const },
          color: '#374151',
        },
        ticks: {
          font: { size: 12 },
          color: '#6b7280',
        },
        grid: {
          color: '#e5e7eb', // gray-200
        },
        suggestedMin: 4,
        suggestedMax: 10,
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="dark:bg-gray-800 rounded-xl p-4">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
