import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function InstrumentDistributionChart({ instruments = [] }) {
  // Count by category or types
  const types = {
    'Retail Electronic Scales': 0,
    'Weighbridges': 0,
    'Fuel Dispensers': 0,
    'Laboratory Microbalances': 0,
    'Packaging & Flowmeters': 0
  };

  instruments.forEach((inst) => {
    if (inst.type.includes('Scale')) types['Retail Electronic Scales']++;
    else if (inst.type.includes('Weighbridge')) types['Weighbridges']++;
    else if (inst.type.includes('Fuel') || inst.type.includes('Petrol')) types['Fuel Dispensers']++;
    else if (inst.type.includes('Microbalance') || inst.type.includes('Precision')) types['Laboratory Microbalances']++;
    else types['Packaging & Flowmeters']++;
  });

  // Ensure non-zero for visual appeal if small dataset
  const values = [
    Math.max(types['Retail Electronic Scales'], 1),
    Math.max(types['Weighbridges'], 1),
    Math.max(types['Fuel Dispensers'], 1),
    Math.max(types['Laboratory Microbalances'], 1),
    Math.max(types['Packaging & Flowmeters'], 1)
  ];

  const data = {
    labels: [
      'Retail Scales',
      'Weighbridges',
      'Fuel Dispensers',
      'Microbalances',
      'Packaging Machines'
    ],
    datasets: [
      {
        data: values,
        backgroundColor: [
          '#0284c7', // Sky blue
          '#10b981', // Emerald green
          '#f59e0b', // Amber
          '#8b5cf6', // Violet
          '#ec4899'  // Pink
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: { family: 'Plus Jakarta Sans', size: 11 }
        }
      }
    }
  };

  return (
    <div style={{ height: '220px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
