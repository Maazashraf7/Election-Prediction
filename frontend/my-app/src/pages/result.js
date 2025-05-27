import { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#FF9933", "#138808", "#1976d2", "#e53935", "#8884d8", "#ffc658", "#ff8042", "#8dd1e1"];

export default function Result() {
  const [stateName, setStateName] = useState("");
  const [state, setStates] = useState([]);
  const [prediction, setPrediction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await axios.get("http://localhost:5000/state");
        setStates(res.data);
      } catch (error) {
        setError("Failed to load states");
      }
    };
    fetchState();
  }, []);

  const handlePredict = async () => {
    if (!stateName) return alert("Select a state");
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/predict", { state: stateName });
      setPrediction(res.data);
    } catch (error) {
      setError("Prediction failed. Please try again.");
    }
    setLoading(false);
  };

 // Aggregate by party: count wins and sum probabilities
const partyStats = {};
prediction.forEach((item) => {
  const party = item.predicted_party;
  if (!partyStats[party]) {
    partyStats[party] = { seats: 0, totalProb: 0, partyname: item.partyname };
  }
  partyStats[party].seats += 1;
  partyStats[party].totalProb += parseFloat(item.party_probabilities[party] || 0);
});


let chartData = Object.keys(partyStats).map((party) => ({
  name: partyStats[party].partyname || party,
  seats: partyStats[party].seats,
  avgProb: (partyStats[party].totalProb / partyStats[party].seats) * 100,
}));

// Sort by seats descending and take top 5
chartData = chartData.sort((a, b) => b.seats - a.seats).slice(0, 5);
  return (
    <div className="max-w-3xl mx-auto p-4 bg-gradient-to-br from-[#fff7e6] via-white to-[#e6ffe6] rounded-2xl shadow-2xl mt-8">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-[#FF9933] tracking-wider drop-shadow">
        🗳️ Election Prediction Dashboard
      </h2>

      
      {error && (
        <div className="text-red-600 bg-red-100 p-3 rounded mb-4 text-center font-semibold shadow">
          {error}
        </div>
      )}

      {/* State Selector */}
<div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center w-full">
  <div className="w-full md:w-2/3 flex">
    <select
      value={stateName}
      onChange={(e) => setStateName(e.target.value)}
      className="w-full px-4 py-3 rounded-l-lg md:rounded-lg shadow focus:outline-none text-[#138808] font-semibold border-2 border-[#FF9933] focus:border-[#138808] bg-gradient-to-r from-[#fff7e6] via-white to-[#e6ffe6] transition text-lg"
      style={{
        minWidth: 0,
        borderRight: "none",
        borderTopRightRadius: "0",
        borderBottomRightRadius: "0",
      }}
    >
      <option value="" disabled>
        Select State
      </option>
      {state.map((state) => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </select>
    <button
      onClick={handlePredict}
      className="px-6 py-3 rounded-r-lg md:rounded-lg shadow-lg transition-all duration-200 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white font-bold text-lg border-2 border-[#138808] hover:from-[#138808] hover:to-[#FF9933] hover:text-[#fff7e6] disabled:opacity-60"
      disabled={loading || !stateName}
      style={{
        minWidth: "150px",
        borderTopLeftRadius: "0",
        borderBottomLeftRadius: "0",
        marginLeft: "-2px"
      }}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Predicting...
        </span>
      ) : (
        "Get Prediction"
      )}
    </button>
  </div>
</div>
      {prediction.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-6 text-center text-[#138808] tracking-wide">
            Predicted Winning Parties Overview
          </h3>
          {/* Pie Chart */}
          <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-center mb-10">
            <div className="w-full max-w-md h-[320px] bg-white rounded-xl shadow-lg flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="seats"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              fill="#FF9933"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              formatter={(value) => (
                <span className="font-semibold text-[#138808]">{value}</span>
              )}
            />
            <Tooltip
              formatter={(value, name) => [`${value} seats`, `${name}`]}
            />
          </PieChart>
        </ResponsiveContainer>
        
      </div>
      
      <div className="flex-1 min-w-[220px]">
        <div className="bg-[#f9f9f9] rounded-xl shadow p-4">
          <h4 className="text-lg font-bold mb-2 text-[#FF9933] text-center">Summary</h4>
          <ul className="space-y-2 text-black text-base">
            {chartData.map((item, idx) => (
              <li key={item.name} className="flex items-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ background: COLORS[idx % COLORS.length] }}
                ></span>
                <span className="font-semibold">{item.name}:</span>
                {/* <span className="ml-1">{item.seats} seats</span> */}
                <span className="ml-2 text-gray-500 text-sm">
                  (Avg. Win Probability: {item.avgProb.toFixed(2)}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    {/* List of Constituency Predictions */}
    <div className="bg-[#f9f9f9] rounded-2xl shadow p-6">
      <h4 className="text-xl font-bold mb-4 text-[#FF9933] text-center">Constituency-wise Predictions</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-3 py-2 text-[#138808] font-bold">Candidate</th>
              <th className="px-3 py-2 text-[#138808] font-bold">Constituency</th>
              <th className="px-3 py-2 text-[#138808] font-bold">Predicted Party</th>
              <th className="px-3 py-2 text-[#138808] font-bold">Win/Loss</th>
              <th className="px-3 py-2 text-[#138808] font-bold">Probabilities</th>
            </tr>
          </thead>
          <tbody>
            {prediction.map((item, index) => (
              <tr key={index} className="bg-white rounded shadow-sm">
                <td className="px-3 py-2 font-semibold text-[#1976d2]">{item.candidate}</td>
                <td className="px-3 py-2">{item.constituency}</td>
                <td className="px-3 py-2">
                  <span className="font-bold text-[#FF9933]">{item.predicted_party}</span>
                  <span className="ml-2 text-gray-500 text-sm">({item.partyname})</span>
                </td>
                <td className="px-3 py-2">
                  <span className={
                    item.predicted_party === item.partyname
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }>
                    {item.predicted_party === item.partyname ? "Win" : "Loss"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <ul className="list-disc ml-4">
                    {Object.entries(item.party_probabilities).map(([party, prob]) => (
                      <li key={party} className="text-sm">
                        <span className="font-semibold">{party}:</span> {(prob * 100).toFixed(2)}%
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}
          
      {!prediction.length && (
        <div className="text-center text-gray-500 mt-8 text-lg">
          Select a state and click <span className="font-semibold text-[#FF9933]">Get Prediction</span> to view election insights.
        </div>
      )}
    </div>
  );
}