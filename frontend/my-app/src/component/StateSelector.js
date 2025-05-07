import React from "react";

function StateSelector({ state, states, onChange, onLoad }) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
      <select
        className="input input-bordered w-full md:w-auto"
        value={state}
        onChange={onChange}
        disabled={states.length === 0} // Disable dropdown if no states are available
      >
        <option value="" disabled>
          Select State
        </option>
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        className="btn btn-primary w-full md:w-auto"
        onClick={onLoad}
        // disabled={!state} // Disable button if no state is selected
      >
        Load State Data
      </button>
    </div>
  );
}

export default StateSelector;