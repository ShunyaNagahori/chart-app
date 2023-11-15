'use client'
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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const LineChart = (props: any) => {
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
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ]

  if (dataCount === 2　&& datasets.length === 1) {
    datasets.push({
      label: secondDataName,
      data: secondValues,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
    });
  }

  const data = {
    labels,
    datasets: datasets
  };

  return (
    <div className=''>
      <Line options={options} data={data} />
    </div>
  )
}

export default LineChart
