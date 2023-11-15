import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
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

const BarChart = (props: any) => {
  const { title, values, dataName, dataCount, secondValues, secondDataName } = props
  const labels = Object.keys(values);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  let datasets = [
    {
      label: dataName,
      data: values,
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ]

  if (dataCount === 2　&& datasets.length === 1) {
    datasets.push({
      label: secondDataName,
      data: secondValues,
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    });
  }

  const data = {
    labels,
    datasets: datasets
  };

  return (
    <Bar options={options} data={data} />
  )
}

export default BarChart


