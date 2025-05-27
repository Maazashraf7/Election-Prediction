import React, { useState, useEffect } from "react";
import { fetchYears, fetchPartyVotes } from "../service/api";
import YearSelector from "../component/yearSelector";
import PartyVotesChart from "../component/partyVotesChart";
import ErrorMessage from "../component/errorMessage";
import { useNavigate } from "react-router-dom"; // Add this import

function DataViewer() {
  const [year, setYear] = useState("");
  const [years, setYears] = useState([]);
  const [partyVotesData, setPartyVotesData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  // Fetch years and auto-load latest year data
  useEffect(() => {
    fetchYears()
      .then((yearsArr) => {
        setYears(yearsArr);
        if (yearsArr && yearsArr.length > 0) {
          // Pick the latest year (assuming sorted, else use Math.max(...yearsArr))
          const latestYear = yearsArr[yearsArr.length - 1];
          setYear(latestYear);
          // Fetch data for latest year
          fetchPartyVotes(latestYear)
            .then(setPartyVotesData)
            .catch((err) => {
              console.error(err);
              setError("Could not load party votes data.");
            });
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load available years.");
      });
  }, []);

  const loadPartyVotes = () => {
    fetchPartyVotes(year)
      .then(setPartyVotesData)
      .catch((err) => {
        console.error(err);
        setError("Could not load party votes data.");
      });
  };

  return (
    <div className="space-y-6 p-4">
      {/* Back Arrow */}
      <button
        className="flex items-center text-[#FF9933] hover:text-[#138808] font-semibold mb-2"
        onClick={() => navigate("/")}
      >
        <span className="mr-2 text-2xl">&#8592;</span> Back to Home
      </button>

      <h1 className="text-2xl font-bold text-center text-black">Election Data Viewer</h1>

      <YearSelector
        year={year}
        years={years}
        onChange={(e) => setYear(e.target.value)}
        onLoad={loadPartyVotes}
      />

      {error && <ErrorMessage message={error} />}

      {partyVotesData && partyVotesData.length > 0 && (
        <PartyVotesChart data={partyVotesData} year={year} />
      )}
    </div>
  );
}

export default DataViewer;