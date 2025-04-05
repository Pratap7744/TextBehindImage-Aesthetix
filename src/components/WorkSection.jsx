import React from "react"; 
import { motion } from "framer-motion"; 
import povimg from "../images/povimg.png"; 
import bear from "../images/bear.webp"; 
import ronaldo from "../images/ronaldo.png"; 
import kohli from "../images/kohli.png"; 
import thomas from "../images/thomas.webp"; 
import porsche from "../images/porsche.png"; 
import scarface from "../images/scarface2.png"; 
import thomas1 from "../images/thomas2.png"; 
import gt from "../images/gt.png"; 
import legacy from "../images/legacy1.png"; 
import vibe from "../images/vibe.png"; 
import explore from "../images/explore.png"; 
import ny from "../images/NY.jpeg"; 
import vision from "../images/vision.png"; 
import work from "../images/work.png";  
import snap from "../images/snap.png";
import wow from "../images/wow.png";
import peaky from "../images/peaky.png";
import chill from "../images/chill.png";
import heal from "../images/heal.png";
import connections from "../images/connections.png";
import football from "../images/football.png";
import aesthetic from "../images/aesthetic.png";

const ModernGallerySection = () => {  
  // First half - text behind images
  const behindImages = [
    { id: 1, src: porsche },
    { id: 2, src: scarface },
    { id: 3, src: povimg },
    { id: 5, src: vibe },
    { id: 6, src: gt },
    { id: 8, src: bear, title: "Bear" },
    { id: 12, src: explore, title: "Explore" },
    { id: 14, src: vision, title: "Vision" },
    { id: 13, src: ny, title: "New York" },
  ];

  // Second half - text on images
  const onImages = [
    { id: 15, src: snap, title: "snap" },
    { id: 16, src: wow, title: "wow" },
    { id: 17, src: heal, title: "heal" },
    { id: 18, src: chill, title: "chill" },
    { id: 19, src: connections, title: "connections" },
    { id: 20, src: football, title: "football" },
    { id: 21, src: aesthetic, title: "aesthetic" },
  ];

  return (
    <section
      id="showcase"
      className="py-24 bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full opacity-30 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
            Visual Storytelling
          </h2>
          <p className="text-lg md:text-xl text-indigo-600 max-w-2xl mx-auto">
            Discover how text and imagery work together to create compelling visual narratives
          </p>
        </motion.div>
        
        {/* Split container */}
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Half - Text Behind Images */}
          <div className="w-full lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-8 flex items-center"
            >
              <h3 className="text-2xl font-bold text-indigo-600">Text Behind Images</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-indigo-400/50 to-transparent ml-4"></div>
            </motion.div>
            
            <div className="relative">
              {/* Background Text */}
             
              
              {/* Image Grid */}
              <div className="columns-1 sm:columns-2 gap-6 relative z-10">
                {behindImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="break-inside-avoid mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/40 transition-all duration-300 relative group"
                  >
                    <img src={image.src} alt={`Gallery image ${image.id}`} className="w-full h-auto object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Half - Text On Images */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-8 flex items-center"
            >
              <h3 className="text-2xl font-bold text-indigo-600">Text On Images</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-indigo-400/50 to-transparent ml-4"></div>
            </motion.div>
            
            <div className="columns-1 sm:columns-2 gap-6">
              {onImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="break-inside-avoid mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/40 transition-all duration-300 relative group"
                >
                  <img src={image.src} alt={`Gallery image ${image.id}`} className="w-full h-auto object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/50 via-indigo-400/30 to-transparent opacity-20 group-hover:opacity-70 transition-all duration-300 flex flex-col justify-end p-5">
                    
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
       
      </div>
    </section>
  ); 
};  

export default ModernGallerySection;