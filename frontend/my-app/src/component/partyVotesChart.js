import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function generateChartData(data) {
  const states = [...new Set(data.map((item) => item.st_name))];
  const parties = [...new Set(data.map((item) => item.partyname))];

  const datasets = parties.map((party) => ({
    label: party,
    data: states.map((state) => {
      const match = data.find(
        (item) => item.st_name === state && item.partyname === party
      );
      return match ? match.totvotpoll : 0;
    }),
    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
  }));

  return {
    labels: states,
    datasets,
  };
}

function PartyVotesChart({ data, year }) {
  const chartData = generateChartData(data);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-center mb-4">
        Party Votes by State ({year})
      </h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: `Party Votes by State for ${year}`,
            },
          },
        }}
      />
    </div>
  );
}

export default PartyVotesChart;
