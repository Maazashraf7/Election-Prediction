import React, { useState, useEffect } from "react";
import { fetchYears, fetchPartyVotes } from "../service/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

function Partywise() {
  const [year, setYear] = useState("");
  const [years, setYears] = useState([]);
  const [partyVotes, setPartyVotes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchYears()
      .then(setYears)
      .catch(() => setError("Could not load available years."));
  }, []);

  // Fetch party votes when year changes
  useEffect(() => {
    if (!year) return;
    fetchPartyVotes(year)
      .then(setPartyVotes)
      .catch(() => setError("Could not load party votes data."));
  }, [year]);

  // Show only top N parties for clarity
  const TOP_N = 10;
  const sortedPartyVotes = [...partyVotes]
    .sort((a, b) => (b.totvotpoll || b.votes) - (a.totvotpoll || a.votes))
    .slice(0, TOP_N);

  const othersVotes = partyVotes
    .slice(TOP_N)
    .reduce((sum, p) => sum + (p.totvotpoll || p.votes), 0);

  if (partyVotes.length > TOP_N) {
    sortedPartyVotes.push({
      partyname: "Others",
      totvotpoll: othersVotes,
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow mt-8">
      
      <button
        className="flex items-center text-[#FF9933] hover:text-[#138808] font-semibold mb-4"
        onClick={() => navigate("/")}
      >
        <span className="mr-2 text-2xl">&#8592;</span> Back to Home
      </button>
      <h1 className="text-2xl font-bold text-center mb-6 text-[#FF9933]">
        Party-wise Votes Viewer
      </h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <select
          className="input input-bordered w-full md:w-auto px-4 py-2 rounded shadow text-[#138808] font-semibold border-2 border-[#FF9933] focus:border-[#138808] bg-gradient-to-r from-[#fff7e6] via-white to-[#e6ffe6] transition"
          value={year}
          onChange={e => setYear(e.target.value)}
        >
          <option value="" disabled>Select Year</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      {sortedPartyVotes && sortedPartyVotes.length > 0 && (
        <div className="w-full flex flex-col gap-8 mb-8">
          {/* Bar Chart */}
          <div className="flex-1 min-w-0 overflow-x-auto">
            <h2 className="text-lg font-semibold text-center mb-2 text-[#138808]">Bar Chart (Top {TOP_N})</h2>
            <div className="w-full h-[300px] min-w-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedPartyVotes}>
                  <XAxis dataKey="partyname" tick={{ fontSize: 12 }} interval={0} angle={-30} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totvotpoll" fill="#FF9933" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Pie Chart */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-center mb-2 text-[#138808]">Pie Chart (Top {TOP_N})</h2>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sortedPartyVotes}
                    dataKey="totvotpoll"
                    nameKey="partyname"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#138808"
                    label
                  >
                    {sortedPartyVotes.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={["#FF9933", "#138808", "#1976d2", "#e53935", "#8884d8"][idx % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      {partyVotes && partyVotes.length === 0 && year && (
        <div className="text-center text-gray-500 mt-4">No data available for this year.</div>
      )}
    </div>
  );
}

export default Partywise;