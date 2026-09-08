import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function VerificationTimelineChart() {
  const data = {
    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug 2026'],
    datasets: [
      {
        label: 'Verifications Completed',
        data: [42, 65, 58, 81, 74, 95],
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.12)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#0284c7',
        pointRadius: 4
      },
      {
        label: 'New Applications Filed',
        data: [50, 70, 62, 90, 80, 110],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        borderDash: [5, 5],
        tension: 0.35,
        fill: false,
        pointBackgroundColor: '#f59e0b',
        pointRadius: 3
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
          font: { family: 'Plus Jakarta Sans', size: 12 }
        }
      },
      tooltip: {
        padding: 10,
        cornerRadius: 8
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
    <div style={{ height: '240px' }}>
      <Line data={data} options={options} />
    </div>
  );
}
