import React from "react";

function StateSelector({ state, states, onChange, onLoad }) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
      <select
        className="input input-bordered w-full md:w-auto px-4 py-2 rounded shadow text-[#138808] font-semibold border-2 border-[#FF9933] focus:border-[#138808] bg-gradient-to-r from-[#fff7e6] via-white to-[#e6ffe6] transition"
        value={state}
        onChange={onChange}
        disabled={states.length === 0}
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
        className="w-full md:w-auto font-semibold px-4 py-2 rounded shadow transition
          bg-gradient-to-r from-[#FF9933] via-white to-[#138808]
          text-gray-900 border-2 border-[#138808] hover:from-[#FF9933] hover:to-[#138808] hover:text-white"
        onClick={onLoad}
        disabled={!state}
        style={{
          background: "linear-gradient(90deg, #FF9933 0%, #fff 50%, #138808 100%)",
          color: "#222",
          border: "2px solid #138808"
        }}
      >
        Load State Data
      </button>
    </div>
  );
}

export default StateSelector;