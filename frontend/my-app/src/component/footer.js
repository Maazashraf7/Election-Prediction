export default function Footer() {
  return (
    <footer className="mt-12">
      {/* Saffron Bar */}
      <div style={{ background: "#FF9933" }} className="h-2 w-full rounded-t-lg"></div>
      {/* White Bar with Content */}
      <div className="bg-white text-center text-gray-800 py-6 shadow-lg">
        <p className="text-lg font-semibold mb-1">
          &copy; 2025 Election Prediction System
        </p>
        <p className="mb-1">
          <span className="font-medium">Developed by</span>{" "}
          <span className="text-blue-700 font-semibold">Syed Maaz Ashraf</span>,{" "}
          <span className="text-blue-700 font-semibold">Aman Kumar</span>,{" "}
          <span className="text-blue-700 font-semibold">Moein Uddin Ahmad</span>,{" "}
          <span className="text-blue-700 font-semibold">Ujjwal Kumar</span>
        </p>
        <p>
          <span className="font-bold tracking-wide text-green-700">IIMT College of Engineering</span>
        </p>
      </div>
      {/* Green Bar */}
      <div style={{ background: "#138808" }} className="h-2 w-full rounded-b-lg"></div>
    </footer>
  );
}