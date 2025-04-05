import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
const Navbar = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      const sections = ["hero","showcase",  "features",  "howitworks"];
      const sectionElements = sections.map((id) => document.getElementById(id));
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && window.scrollY >= element.offsetTop - 200) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
       {/* Navigation */}
       <motion.header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrollPosition > 50
            ? "py-3 bg-white/80 backdrop-blur-sm shadow-md"
            : "py-6 bg-white/90"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-600" />
                <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
                  <span className="font-bold text-xl text-gray-900">𝘈
                  </span>
                </div>
              </div>
              <span className="font-extrabold text-2xl text-gray-900 tracking-tight">
              Aesthetix
              </span>
            </motion.div>
            <div className="hidden md:flex flex-1 justify-center">
            <nav>
              <ul className="flex space-x-1 p-1 rounded-full bg-gray-100/80 shadow-sm">
                {["Hero","ShowCase", "Features" ,"How It Works"].map((item, index) => (
                  <li key={index}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                      className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeSection === item.toLowerCase().replace(/\s+/g, "")
                          ? "text-white bg-gradient-to-r from-indigo-400 to-indigo-600"
                          : "text-gray-700 hover:text-white hover:bg-indigo-300"
                      }`}
                    >
                      <span className="relative z-10">{item}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            </div>
                <Link to={"/blogs"}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(79, 70, 229, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              
              className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white font-medium py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
              Explore Blogs
            </motion.button>
              </Link>
          </div>
        </div>
      </motion.header>
    </div>
  )
}

export default Navbar
