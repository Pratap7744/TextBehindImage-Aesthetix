import React from "react";
import { motion } from "framer-motion";

const FeaturesSection = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      title: "High Quality Downloads",
      description: "All images maintain premium quality when downloaded, preserving every visual detail for print or digital use.",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: "Text Gradients",
      description: "Apply stunning color gradients to your text for eye-catching visual impact that enhances your message.",
      gradient: "from-pink-500 to-indigo-500"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      title: "Custom Positioning",
      description: "Place text exactly where you want it on your images with precise positioning controls.",
      gradient: "from-blue-500 to-teal-500"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: "Text Rotation",
      description: "Rotate text to any angle to create dynamic and visually interesting compositions.",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Opacity Control",
      description: "Fine-tune the transparency of your text overlays to perfectly balance readability with visual appeal.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      title: "Text Shadows",
      description: "Add depth and dimension with customizable text shadows that make your words pop against any background.",
      gradient: "from-rose-500 to-red-500"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      title: "Font Variety",
      description: "Access a vast library of font families to find the perfect typography for every project.",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      ),
      title: "Multiple Font Styles",
      description: "Combine different font weights, styles, and families for creative typography combinations.",
      gradient: "from-yellow-500 to-amber-500"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full opacity-30 blur-3xl"></div>
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
            Powerful Features
          </h2>
          <p className="text-lg md:text-xl text-indigo-600 max-w-2xl mx-auto">
            Everything you need to create stunning visual stories with perfect text integration
          </p>
        </motion.div>

        {/* Demo Box with Text Effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl overflow-hidden relative"
        >
          <div className="p-12 md:p-16 min-h-60 flex flex-col items-center justify-center">
            {/* Text with rotation */}
            <div 
              className="absolute top-12 left-12 font-serif text-3xl md:text-4xl font-bold transform -rotate-12"
              style={{
                background: "linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(199, 210, 254, 0.9))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
              }}
            >
              Rotate Text
            </div>
            
            {/* Text with gradient */}
            <div 
              className="text-center font-bold text-5xl md:text-6xl mb-6"
              style={{
                background: "linear-gradient(to right, #f9fafb, #e0e7ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Beautiful Gradients
            </div>
            
            {/* Text with shadow */}
            <div className="text-white text-2xl md:text-3xl mb-8 text-center"
              style={{
                textShadow: "3px 3px 6px rgba(0,0,0,0.5)"
              }}
            >
              Add depth with shadows
            </div>
            
            {/* Text with opacity */}
            <div className="absolute bottom-12 right-12 font-mono text-xl md:text-2xl text-white opacity-50 transform rotate-6">
              Control opacity
            </div>
            
            {/* Text with custom font */}
            <div className="absolute top-1/2 right-16 font-serif text-xl italic text-white transform translate-y-8 rotate-90">
              Custom positioning
            </div>
          </div>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300"
            >
              <div className={`h-2 bg-gradient-to-r ${feature.gradient}`}></div>
              <div className="p-6">
                <div className="mb-4 bg-indigo-50 w-16 h-16 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-600 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Font Showcase */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 bg-white rounded-xl p-8 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Font Family Showcase</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="font-sans text-xl mb-2">Sans-serif Typography</p>
              <p className="text-gray-600">Clean, modern text for user interfaces</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="font-serif text-xl mb-2">Serif Typography</p>
              <p className="text-gray-600">Elegant, traditional text for formal content</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-mono text-xl mb-2">Monospace Typography</p>
              <p className="text-gray-600">Fixed-width text for code and technical content</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <p style={{ fontFamily: "'Brush Script MT', cursive" }} className="text-xl mb-2">Script Typography</p>
              <p className="text-gray-600">Flowing text for creative and artistic designs</p>
            </div>
          </div>
        </motion.div>
        
       
      </div>
    </section>
  );
};

export default FeaturesSection;