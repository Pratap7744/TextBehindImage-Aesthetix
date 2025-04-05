import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import EditorNavbar from "./EditorNavbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Ensure this path is correct
import tbi from "../images/vision.png";
import toi from "../images/football.png";

const CardGrid = ({ session }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      console.log("Session from props:", session);
    } else {
      const handleRedirectResult = async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) console.error("Error getting session:", error);
          else console.log("Session data:", data);
        } catch (error) {
          console.error("Unexpected error:", error);
        }
      };
      handleRedirectResult();
    }
  }, [session]);

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
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <EditorNavbar />
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer h-full max-h-6/7"
              onClick={() => handleCardClick(card.path)}
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
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