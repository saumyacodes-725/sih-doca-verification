import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ZonePerformanceChart() {
  const data = {
    labels: ['North Zone', 'West Zone', 'South Zone', 'East Zone', 'Central Zone'],
    datasets: [
      {
        label: 'Verifications Completed',
        data: [142, 118, 96, 78, 85],
        backgroundColor: '#0284c7',
        borderRadius: 6
      },
      {
        label: 'Pending In-Field Audits',
        data: [12, 8, 5, 9, 6],
        backgroundColor: '#f59e0b',
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: { family: 'Plus Jakarta Sans', size: 11 }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { font: { family: 'Plus Jakarta Sans' } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Plus Jakarta Sans' } }
      }
    }
  };

  return (
    <div style={{ height: '220px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
