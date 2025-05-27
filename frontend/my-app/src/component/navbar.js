import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shadow-lg sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🗳️</span>
          <Link to="/" className="font-bold text-xl text-gray-900 tracking-wide hover:text-yellow-600 transition">
            Election Predictor
          </Link>
        </div>
        {/* Navigation Links */}
        <div className="flex space-x-2">
          <Link
            to="/"
            className="px-3 py-1 rounded hover:bg-yellow-300 hover:text-[#138808] text-gray-900 transition font-medium"
          >
            Home
          </Link>
          <Link
            to="/result"
            className="px-3 py-1 rounded hover:bg-yellow-300 hover:text-[#138808] text-gray-900 transition font-medium"
          >
            Result
          </Link>
          <Link
            to="/tweetsentiment"
            className="px-3 py-1 rounded hover:bg-yellow-300 hover:text-[#138808] text-gray-900 transition font-medium"
          >
            Tweet Sentiment
          </Link>
          <Link
            to="/about"
            className="px-3 py-1 rounded hover:bg-yellow-300 hover:text-[#138808] text-gray-900 transition font-medium"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}