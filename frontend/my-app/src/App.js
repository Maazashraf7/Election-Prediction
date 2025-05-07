import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/navbar";  // Assuming Navbar is in the component folder
import Footer from "./component/footer";  // Assuming Footer is in the component folder
import Home from "./pages/home";  // Home page in the pages folder
import Result from "./pages/result";  // Result page in the pages folder
import About from "./pages/about";  // About page in the pages folder
import './index.css';  // Make sure Tailwind's styles are applied
import Statewise from "./pages/statewise";  // Statewise page in the pages folder
function App() {
  return (
    <Router>
     <div className="flex flex-col min-h-screen bg-white text-white">

        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/statewise" element={<Statewise />} />
            <Route path="/result" element={<Result />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
