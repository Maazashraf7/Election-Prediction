import React, { useState, useEffect } from "react";
import { fetchStates, fetchStatePartyVotes, fetchYears } from "../service/api";
import StateSelector from "../component/StateSelector";
import YearSelector from "../component/yearSelector";
import ErrorMessage from "../component/errorMessage";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function Statewise() {
  const [state, setState] = useState(""); // State for the selected state
  const [states, setStates] = useState([]); // State for available states
  const [year, setYear] = useState(""); // State for the selected year
  const [years, setYears] = useState([]); // State for available years
  const [partyVotesData, setPartyVotesData] = useState(null); // State for party vote percentage data
  const [error, setError] = useState(""); // State for error messages

  // Fetch available years when the component mounts
  useEffect(() => {
    fetchYears()
      .then((data) => {
        console.log("Fetched Years:", data); // Debugging log
        setYears(data);
      })
      .catch((err) => {
        console.error("Error fetching years:", err);
        setError("Could not load available years.");
      });
  }, []);

  // Fetch available states when a year is selected
  useEffect(() => {
    if (!year) return;
    fetchStates(year)
      .then((data) => {
        console.log("Fetched States:", data); // Debugging log
        setStates(data);
      })
      .catch((err) => {
        console.error("Error fetching states:", err);
        setError("Could not load available states.");
      });
  }, [year]);

  // Function to load state-party vote percentage data
  const loadPartyVotesData = () => {
    fetchStatePartyVotes(state, year)
      .then((data) => {
        console.log("Fetched Party Votes Data:", data); // Debugging log
        setPartyVotesData(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load party vote percentage data.");
      });
  };

  // Generate chart data for visualization
  const generateChartData = () => {
    if (!partyVotesData || partyVotesData.length === 0) return null;

    return {
      labels: partyVotesData.map((item) => item.partyname), // Party names
      datasets: [
        {
          label: "Vote Percentage",
          data: partyVotesData.map((item) => item.vote_percentage), // Vote percentages
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)", // Red
            "rgba(54, 162, 235, 0.6)", // Blue
            "rgba(255, 206, 86, 0.6)", // Yellow
            "rgba(75, 192, 192, 0.6)", // Teal
            "rgba(153, 102, 255, 0.6)", // Purple
            "rgba(255, 159, 64, 0.6)", // Orange
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Generate color scale for the map
  const getColorForState = (stateName) => {
    if (!partyVotesData || partyVotesData.length === 0) return "#EEE"; // Default color
    const stateData = partyVotesData.find((item) => item.partyname === stateName);
    if (!stateData) return "#EEE"; // Default color if no data for the state
    const percentage = stateData.vote_percentage;
    if (percentage > 50) return "#FF5733"; // High percentage (red)
    if (percentage > 30) return "#FFC300"; // Medium percentage (yellow)
    return "#DAF7A6"; // Low percentage (green)
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-center text-black">Statewise Data Viewer</h1>

      {/* Year Selector */}
      <YearSelector
        year={year}
        years={years}
        onChange={(e) => setYear(e.target.value)}
      />

      {/* State Selector */}
      <StateSelector
        state={state}
        states={states}
        onChange={(e) => setState(e.target.value)}
        onLoad={loadPartyVotesData}
      />

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Party Votes Chart */}
      {partyVotesData && partyVotesData.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-center mb-4">
            Party Vote Percentage for {state} ({year})
          </h2>
          <Pie data={generateChartData()} />
        </div>
      )}

      {/* Map Visualization */}
      

    </div>
  );
}

export default Statewise;