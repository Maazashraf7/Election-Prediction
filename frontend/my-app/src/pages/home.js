import React, { useState, useEffect } from "react";
import { fetchYears, fetchPartyVotes } from "../service/api";
import YearSelector from "../component/yearSelector";
import PartyVotesChart from "../component/partyVotesChart";
import ErrorMessage from "../component/errorMessage";

function Home() {
  const [year, setYear] = useState("");
  const [years, setYears] = useState([]);
  const [partyVotesData, setPartyVotesData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchYears()
      .then(setYears)
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

export default Home;
