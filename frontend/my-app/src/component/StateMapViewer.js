import React, { useState, useEffect } from "react";
import { fetchStateData } from "../service/api"; // Assuming this API call exists for state-specific data
import StateSelector from "../component/StateSelector";  // Assuming this is the StateSelector component
import IndiaMap from "../component/IndiaMap";  // Assuming this is the IndiaMap component
import ErrorMessage from "../component/errorMessage";

function StateMapViewer({ partyVotesData, year }) {
  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [error, setError] = useState("");

  const handleStateChange = (state) => {
    setSelectedState(state);
    fetchStateData(state, year)
      .then(setStateData)
      .catch((err) => {
        console.error(err);
        setError("Could not load state data.");
      });
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold text-center">State Election Map</h2>

      {error && <ErrorMessage message={error} />}

      {/* State Selector */}
      <StateSelector
        states={[...new Set(partyVotesData.map((item) => item.st_name))]}
        onStateChange={handleStateChange}
      />

      {/* India Map with Party Votes */}
      {selectedState && (
        <IndiaMap
          partyVotes={partyVotesData}
          selectedState={selectedState}
        />
      )}
    </div>
  );
}

export default StateMapViewer;
