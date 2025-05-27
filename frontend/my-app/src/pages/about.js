import React from "react";
import election2 from '../assets/election2.jpg';
import election3 from '../assets/election3.jpg';
import presentation1 from '../assets/presentation2.jpeg'; 

export default function About() {
  return (
    <section className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md font-sans">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#FF9933] tracking-wide">
        About the Project & Team
      </h1>

      <p className="mb-4 text-gray-700 text-lg text-center">
        <span className="font-bold text-[#138808]">Election Insights</span> is a modern platform that leverages
        <span className="font-semibold text-[#FF9933]"> machine learning</span>, <span className="font-semibold text-[#138808]">real-time data</span>, and <span className="font-semibold text-[#1976d2]">social media sentiment analysis</span> to predict Indian election outcomes.
        Our mission is to empower voters, analysts, and enthusiasts with clear, reliable, and data-driven election forecasts.
      </p>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-center mb-6">
        <img
          src={election2}
          alt="Indian voters"
          className="rounded-lg shadow-md w-full max-w-xs border-4 border-[#FF9933] object-cover"
        />
        <img
          src={election3}
          alt="Ballot box"
          className="rounded-lg shadow-md w-full max-w-xs border-4 border-[#138808] object-cover"
        />
      </div>

      <p className="mb-4 text-gray-700 text-center">
        By combining <span className="font-semibold text-[#FF9933]">historical voting trends</span> with <span className="font-semibold text-[#138808]">live public opinions</span>, we transform complex data into intuitive visualizations and trustworthy predictions—helping you stay informed in India’s dynamic political landscape.
      </p>

      <div className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-bold mb-2 text-center text-[#FF9933]">Meet the Team</h2>
        <ul className="text-center text-lg text-[#138808] font-semibold space-y-1">
          <li>Syed Maaz Ashraf</li>
          <li>Aman Kumar</li>
          <li>Moein Uddin Ahmad</li>
          <li>Ujjwal Kumar</li>
        </ul>
        <p className="mt-2 text-center text-gray-700 italic">IIMT College of Engineering</p>
        {/* Presentation Image */}
        <div className="flex justify-center mt-4">
          <img
            src={presentation1}
            alt="Team Presentation"
            className="rounded-lg shadow-md w-full max-w-md border-4 border-[#1976d2] object-cover"
          />
        </div>
      </div>

      <p className="text-gray-800 text-center text-lg">
        <span className="font-semibold text-[#138808]">We believe in democratizing access to political knowledge</span> and creating a future where informed voters can make confident decisions for a stronger democracy.
      </p>
    </section>
  );
}