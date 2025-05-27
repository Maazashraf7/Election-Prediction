import React, { useState, useRef, useEffect } from "react";
import { fetchTweets } from "../service/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#FF9933", "#138808", "#1976d2"];
const TIMER_SECONDS = 900; // 15 minutes

export default function TweetSentiments() {
  const [query, setQuery] = useState("");
  const [tweets, setTweets] = useState([]);
  const [sentiments, setSentiments] = useState({ Positive: 0, Negative: 0, Neutral: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [lastQuery, setLastQuery] = useState("");
  const timerRef = useRef(null);

  // Restore timer and last results from localStorage on mount
  useEffect(() => {
    const savedTimer = parseInt(localStorage.getItem("tweet_timer") || "0", 10);
    const savedTime = parseInt(localStorage.getItem("tweet_timer_start") || "0", 10);
    const now = Math.floor(Date.now() / 1000);
    if (savedTimer && savedTime) {
      const diff = now - savedTime;
      if (diff < TIMER_SECONDS) {
        setTimer(TIMER_SECONDS - diff);
        timerRef.current = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              localStorage.removeItem("tweet_timer");
              localStorage.removeItem("tweet_timer_start");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
    // Restore previous tweets and sentiments
    const savedTweets = localStorage.getItem("tweet_results");
    const savedSentiments = localStorage.getItem("tweet_sentiments");
    const savedQuery = localStorage.getItem("tweet_last_query");
    if (savedTweets) setTweets(JSON.parse(savedTweets));
    if (savedSentiments) setSentiments(JSON.parse(savedSentiments));
    if (savedQuery) setLastQuery(savedQuery);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTweets(query);
      setTweets(data);

      // Sentiment count
      const sentimentCount = { Positive: 0, Negative: 0, Neutral: 0 };
      data.forEach(tweet => {
        sentimentCount[tweet.sentiment]++;
      });
      setSentiments(sentimentCount);
      setLastQuery(query);

      // Save to localStorage
      localStorage.setItem("tweet_results", JSON.stringify(data));
      localStorage.setItem("tweet_sentiments", JSON.stringify(sentimentCount));
      localStorage.setItem("tweet_last_query", query);

      // Start 15 min timer
      setTimer(TIMER_SECONDS);
      localStorage.setItem("tweet_timer", TIMER_SECONDS);
      localStorage.setItem("tweet_timer_start", Math.floor(Date.now() / 1000));
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            localStorage.removeItem("tweet_timer");
            localStorage.removeItem("tweet_timer_start");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setError("Could not fetch tweets.");
    }
    setLoading(false);
  };

  const chartData = [
    { name: "Positive", value: sentiments.Positive },
    { name: "Negative", value: sentiments.Negative },
    { name: "Neutral", value: sentiments.Neutral },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-[#FF9933] text-center">Party Tweets Sentiment Analysis</h2>
      <div className="flex gap-2 mb-4 justify-center">
        <input
           className="w-full px-4 py-3 rounded-l-lg md:rounded-lg shadow focus:outline-none text-[#138808] font-semibold border-2 border-[#FF9933] focus:border-[#138808] bg-gradient-to-r from-[#fff7e6] via-white to-[#e6ffe6] transition text-lg"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter party name or hashtag"
          disabled={timer > 0}
        />
        <button
          className="bg-[#FF9933] text-white px-4 py-1 rounded"
          onClick={handleSearch}
          disabled={loading || !query || timer > 0}
        >
          {loading
            ? "Loading..."
            : timer > 0
            ? `Wait ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}`
            : "Search"}
        </button>
      </div>
      {timer > 0 && (
        <div className="text-center text-sm text-[#138808] mb-2">
          You can fetch new tweets after {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
        </div>
      )}
      {error && <div className="text-red-500 mb-2 text-center">{error}</div>}

      {/* Chart */}
      {(sentiments.Positive + sentiments.Negative + sentiments.Neutral > 0) && (
        <div className="w-full flex justify-center mb-6">
          <div className="w-full max-w-xs h-[250px] bg-white rounded-lg shadow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tweets List */}
      {tweets.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-[#138808] text-center">
            Fetched Tweets {lastQuery && `for "${lastQuery}"`}
          </h3>
          <ul className="space-y-2">
            {tweets.map((tweet, idx) => (
              <li key={idx} className="bg-gray-100 p-2 rounded flex justify-between items-center">
                <span>{tweet.text}</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-bold
                  ${tweet.sentiment === "Positive" ? "bg-green-100 text-green-700"
                    : tweet.sentiment === "Negative" ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"}`}>
                  {tweet.sentiment}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}