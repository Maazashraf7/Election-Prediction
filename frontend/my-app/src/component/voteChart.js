import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function voteChart() {
  const [year, setYear] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const fetchVotes = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/votes', { year });
      setData(response.data);
      setError('');
    } catch (err) {
      setError('No data found for this year.');
      setData([]);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4">
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Enter election year"
          className="border p-2 mr-2"
        />
        <button onClick={fetchVotes} className="bg-blue-600 text-white px-4 py-2 rounded">
          Get Results
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <XAxis dataKey="pc_name" angle={-45} textAnchor="end" interval={0} height={150} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totvotpoll" fill="#3182CE" name="Votes" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default voteChart;
