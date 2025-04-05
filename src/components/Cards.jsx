import React from 'react';
import { ArrowRight } from 'lucide-react';
import EditorNavbar from './EditorNavbar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import tbi from "../images/vision.png"
import toi from "../images/football.png"
const CardGrid = () => {
  // Get the navigate function from react-router
  const navigate = useNavigate();

  // Sample card data - replace with your actual data
  const cards = [
    {
      id: 1,
      title: "Text Behind Image",
      image: tbi,
      path: "/textBehindImage",
    },
    {
      id: 2,
      title: "Text On Image",
      image: toi,
      path: "/textOnImage",
    }
  ];

  // Updated function to handle card click with actual navigation
  const handleCardClick = (path) => {
    navigate(path); // This will perform the actual navigation
  };

  return (
    <>
      <EditorNavbar/>
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer h-full max-h-6/7"
              onClick={() => handleCardClick(card.path)}
            >
              {/* Full image covering entire card */}
              <img 
                src={card.image} 
                alt={card.title} 
                className="w-full h-full object-cover"
              />
              
              {/* Gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              {/* Content positioned at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                
                <button 
                  className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(card.path);
                  }}
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CardGrid;