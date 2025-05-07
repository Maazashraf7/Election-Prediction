export const fetchYears = async () => {
	const res = await fetch("http://127.0.0.1:5000/years");
	if (!res.ok) throw new Error("Failed to fetch years");
	return res.json();
  };
  
  export const fetchPartyVotes = async (year) => {
	const res = await fetch(`http://127.0.0.1:5000/party-votes/${year}`);
	if (!res.ok) throw new Error("Failed to fetch party votes");
	return res.json();
  };
 


export const fetchStateData = async () => {
	try {
	  const response = await fetch("http://localhost:5000/state-data");
	  if (!response.ok) {
		throw new Error("Failed to fetch state data");
	  }
	  return await response.json();
	} catch (error) {
	  console.error("Error fetching state data:", error);
	  throw error;
	}
  };
  
// src/service/api.js
export const fetchPartyVotesByState = (state) => {
	return fetch(`your-api-endpoint/party-votes-by-state/${state}`)
	  .then((response) => response.json())
	  .catch((error) => {
		console.error("Error fetching party votes by state:", error);
		throw error;
	  });
  };
  
  export const fetchStates = async (year) => {
	try {
	  const response = await fetch(`http://127.0.0.1:5000/states/${year}`);
	  if (!response.ok) {
		throw new Error("Failed to fetch states");
	  }
	  return await response.json();
	} catch (error) {
	  console.error("Error fetching states:", error);
	  throw error;
	}
  };
  export const fetchStatePartyVotes = async (state, year) => {
	try {
	  const response = await fetch(`http://127.0.0.1:5000/state-party-votes/${state}/${year}`);
	  if (!response.ok) {
		throw new Error("Failed to fetch state-party vote percentage data");
	  }
	  return await response.json();
	} catch (error) {
	  console.error("Error fetching state-party vote percentage data:", error);
	  throw error;
	}
  };