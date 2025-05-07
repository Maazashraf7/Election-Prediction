import { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

export default function Result() {
  const [stateName, setStateName] = useState("");
  const [states, setStates] = useState([]); // State for available states
  const [prediction, setPrediction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State for error message

  // Fetch distinct states from the backend
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get("http://localhost:5000/states");
        console.log("Fetched States:", res.data); // Debugging log
        setStates(res.data);
      } catch (error) {
        console.error("Error fetching states:", error);
        alert("Failed to load states");
      }
    };

    fetchStates();
  }, []);

  const handlePredict = async () => {
    if (!stateName) return alert("Select a state");
    setLoading(true);
    setError(""); // Clear any previous error
    try {
      const res = await axios.post("http://localhost:5000/predict", { state: stateName });
      setPrediction(res.data);
    } catch (error) {
      setError("Prediction failed. Please try again."); // Set error message
      console.error(error);
    }
    setLoading(false);
  };

  // Aggregate by party for chart
  const aggregated = prediction.reduce((acc, curr) => {
    acc[curr.predicted_party] = (acc[curr.predicted_party] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(aggregated).map((party) => ({
    name: party,
    count: aggregated[party],
  }));

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow mt-4">
      <h2 className="text-xl font-semibold mb-4">Election Prediction</h2>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 bg-red-100 p-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* State Selector */}
      <select
        value={stateName}
        onChange={(e) => setStateName(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded mb-4"
      >
        <option value="" disabled>
          Select State
        </option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      <button
        onClick={handlePredict}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Predicting..." : "Get Prediction"}
      </button>

      {prediction.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Predicted Winning Parties</h3>

          {/* Pie Chart */}
          {/* Pie Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`} // Add party name and percentage
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {/* Add Legend to display party names */}
              <Legend
                formatter={(value) => `${value}`} // Display party name in the legend
              />
              {/* Add Tooltip to display detailed info */}
              <Tooltip
                formatter={(value, name) => [`${value} seats`, `${name}`]} // Show seat count and party name
              />
            </PieChart>
          </ResponsiveContainer>
          {/* List of Constituency Predictions */}
          {/* List of Constituency Predictions */}
          {/* List of Constituency Predictions */}
          <ul className="mt-4 space-y-2 text-black">
            {prediction.map((item, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded">
                <strong>{item.candidate}</strong> ({item.constituency}): Predicted Party: {item.predicted_party} - {item.partyname}
                <ul className="ml-4">
                  {Object.entries(item.party_probabilities).map(([party, prob]) => (
                    <li key={party}>
                      {party}: {(prob * 100).toFixed(2)}%
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}