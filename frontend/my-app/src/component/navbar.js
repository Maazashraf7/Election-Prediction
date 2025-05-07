import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar bg-primary text-primary-content px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-lg">
          Election Predictor
        </Link>
      </div>
      <div className="flex space-x-2">
        <Link to="/" className="btn btn-sm btn-ghost">Home</Link>
        <Link to="/result" className="btn btn-sm btn-ghost">Result</Link>
        <Link to="/about" className="btn btn-sm btn-ghost">About</Link>
        <Link to="/statewise" className="btn btn-sm btn-ghost">Statewise</Link>
      </div>
    </div>
  );
}
