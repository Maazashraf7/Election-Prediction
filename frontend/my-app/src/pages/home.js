import React, { useState } from "react";
import { Link } from "react-router-dom";
import pmImage from '../assets/modi_ji.jpg';
import election1 from '../assets/election1.jpg';
import election2 from '../assets/election2.jpg';
import election3 from '../assets/election3.jpg';
import image2 from '../assets/image2.jpg';
import RahulGandhi from '../assets/Rahul_Gandhi.jpg';
import evm from '../assets/evm.jpg';
// Unsplash images for 2014 election section

function Home() {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Election Info Section */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4" style={{ color: "#FF9933" }}>
            Welcome to the <span className="text-[#138808]">Indian Election Predictor</span>
          </h1>
          <p className="mb-4 text-gray-700">
            This platform provides insights and predictions for Indian elections using advanced data analytics and machine learning.
            Explore <span className="font-semibold text-[#FF9933]">party-wise performance</span>, <span className="font-semibold text-[#138808]">constituency trends</span>, and more. Our goal is to make election data accessible and understandable for everyone.
          </p>
          <img
            src={image2}
            alt="Prime Minister of India Narendra Modi"
            className="rounded-lg shadow-md w-full max-w-md mb-4 border-4 border-[#FF9933]"
          />
          <p className="text-gray-600">
            Dive into the world of Indian elections and discover patterns, predictions, and analytics that shape the largest democracy in the world.
          </p>
        </div>
        {/* Services Section */}
        <div className="flex-1 max-w-sm w-full bg-gradient-to-b from-[#FF9933] via-white to-[#138808] rounded-lg shadow-md p-6 border-2 border-[#138808]">
          <h2 className="text-xl font-semibold mb-4 text-center text-[#FF9933]">Our Services</h2>
          <div className="relative">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="w-full bg-[hsl(60,7%,92%)] text-black py-2 rounded hover:bg-[#FF9933] transition flex justify-between items-center font-semibold"
            >
              Data Viewer
              <svg
                className={`w-5 h-5 ml-2 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-[#FF9933] rounded shadow-lg z-10">
                <Link
                  to="/dataviewer"
                  className="block px-4 py-2 hover:bg-[#FF9933] hover:text-white text-[#138808] font-medium"
                  onClick={() => setServicesOpen(false)}
                >
                  Election Data
                </Link>
                <Link
                  to="/statewise"
                  className="block px-4 py-2 hover:bg-[#FF9933] hover:text-white text-[#138808] font-medium"
                  onClick={() => setServicesOpen(false)}
                >
                  Statewise
                </Link>
                {/* <Link
                  to="/constituencywise"
                  className="block px-4 py-2 hover:bg-[#FF9933] hover:text-white text-[#138808] font-medium"
                  onClick={() => setServicesOpen(false)}
                >
                  Constituency Wise
                </Link> */}
                <Link
                  to="/partywise"
                  className="block px-4 py-2 hover:bg-[#FF9933] hover:text-white text-[#138808] font-medium"
                  onClick={() => setServicesOpen(false)}
                >
                  Party Wise
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Indian Election Images and Description */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-[#FF9933] text-center">Glimpses of Indian Elections</h2>
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
          <div className="flex-1 flex flex-col items-center">
            <img src={election1} alt="Indian Election 1" className="rounded-lg shadow-md w-full max-w-xs mb-2" />
            <p className="text-gray-700 text-center">Voters standing in line to cast their votes, showcasing the spirit of democracy in India.</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <img src={election2} alt="Indian Election 2" className="rounded-lg shadow-md w-full max-w-xs mb-2" />
            <p className="text-gray-700 text-center">Election officials preparing EVMs and ensuring a smooth voting process across the country.</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <img src={election3} alt="Indian Election 3" className="rounded-lg shadow-md w-full max-w-xs mb-2" />
            <p className="text-gray-700 text-center">Celebrations and anticipation as results are announced, reflecting the vibrant political landscape.</p>
          </div>
        </div>
      </div>
      {/* 2014 General Election Highlight Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#138808]">2014 Indian General Election: A Historic Mandate</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex-1 flex flex-col items-center">
            <img src={pmImage} alt="Indian voters crowd" className="rounded-lg shadow-md w-full max-w-xs mb-3" />
            <img src={RahulGandhi} alt="Ballot box" className="rounded-lg shadow-md w-full max-w-xs mb-3" />
            <img src={evm} alt="Election celebration" className="rounded-lg shadow-md w-full max-w-xs mb-3" />
          </div>
          <div className="flex-1">
            <div className="bg-[#f9f9f9] rounded-lg shadow-md p-6 border-l-4 border-[#FF9933]">
              <p className="text-gray-800 mb-3">
                <span className="font-bold text-[#FF9933]">General elections were held in India in nine phases from 7 April to 12 May 2014</span> to elect members of the 16th Lok Sabha. With <span className="font-semibold text-[#138808]">834 million registered voters</span>, these elections were the largest in the world until the 2019 election. Approximately <span className="font-semibold text-[#138808]">23.1 million voters</span>, or 2.71% of the total eligible voters, were aged between 18 and 19 years. A total of <span className="font-semibold text-[#138808]">8,251 candidates</span> contested for the 543 elected seats in the Lok Sabha.
              </p>
              <p className="text-gray-800 mb-3">
                The average voter turnout across all nine phases was around <span className="font-semibold text-[#FF9933]">66.40%</span>, marking the highest turnout in Indian general election history up to that point. The election results were declared on 16 May, which was 15 days before the 15th Lok Sabha completed its term on 31 May 2014. The vote counting was conducted at <span className="font-semibold text-[#138808]">989 counting centers</span> across the country.
              </p>
              <p className="text-gray-800 mb-3">
                The <span className="font-bold text-[#FF9933]">Bharatiya Janata Party (BJP)</span> won <span className="font-semibold text-[#138808]">282 seats</span> with 31% of the total vote share. Its coalition, the National Democratic Alliance (NDA), secured a total of <span className="font-semibold text-[#138808]">336 seats</span>. Although this was a landslide victory, the BJP's 31% vote share was the lowest for any party winning a majority since independence. The NDA’s overall vote share stood at 38.5%. Despite the relatively low vote percentage, the coalition had the largest parliamentary majority since the 1984 elections, and it was the first time since then that a single party had enough seats to form a government without needing coalition support.
              </p>
              <p className="text-gray-800">
                In stark contrast, the <span className="font-bold text-[#138808]">Indian National Congress (INC)</span>, which had governed India for most of its post-independence period, experienced its worst-ever performance. The INC received only <span className="font-semibold text-[#FF9933]">19.3% of the votes</span> and won just <span className="font-semibold text-[#FF9933]">44 seats</span>. Its broader alliance, the United Progressive Alliance (UPA), won a total of only <span className="font-semibold text-[#FF9933]">59 seats</span>. Since a minimum of 55 seats is required to be recognized as the official opposition in the Lok Sabha, no party met the criteria, and there was no official opposition party.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;