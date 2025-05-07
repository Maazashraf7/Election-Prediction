// src/components/YearSelector.jsx

import React from "react";

function yearSelector({ year, years, onChange, onLoad }) {
  return (
    
    <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
      <select
        className="input input-bordered w-full md:w-auto"
        value={year}
        onChange={onChange}
      >
        <option value="" disabled>
          Select Year
        </option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <button className="btn btn-primary w-full md:w-auto" onClick={onLoad} disabled={!year}>
        Load Party Votes
      </button>
    </div>
  );
}

export default yearSelector;
