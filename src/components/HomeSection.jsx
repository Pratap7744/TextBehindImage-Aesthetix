import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import WorkSection from "./WorkSection";
import Footer from "./Footer";
import FeaturesSection from "./Features"
import Navbar from "./Navbar";
const HomeSection = ({ session }) => {
  const navigate = useNavigate();
  const [showSignInModal, setShowSignInModal] = useState(false);
  
  const signInWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { 
          redirectTo: window.location.origin + "/cards",
          // Make sure this is the exact Vercel URL
        },
      });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleGetStartedClick = () => {
    if (session) navigate("/cards");
    else setShowSignInModal(true);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100/30 text-gray-900">
     <Navbar/>

      {/* Main content sections */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section
  id="hero"
  className="min-h-screen flex items-center justify-center relative overflow-hidden"
>
  {/* Enhanced background gradients */}
  <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-slate-50 to-indigo-50"></div>
  
  {/* Animated gradient elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-100 rounded-full opacity-20 blur-3xl"></div>
    <div className="absolute top-40 -right-20 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
    <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-100 rounded-full opacity-20 blur-3xl"></div>
    <div className="absolute bottom-40 right-1/4 w-64 h-64 bg-amber-100 rounded-full opacity-20 blur-3xl"></div>
  </div>
  
  {/* Subtle grid pattern overlay */}
  <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
  
  {/* Content container */}
  <div className="container mx-auto px-6 py-20 pt-32 text-center relative z-10">
    <div className="max-w-5xl mx-auto">
      {/* Floating badge */}
      <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm">
        <span className="text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">
          Reimagine Your Photography
        </span>
      </div>
      
      {/* Main heading with enhanced typography */}
      <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-gray-900 leading-tight">
        Add
        <span className="relative mx-3">
          <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-600">
            aesthetic dimension
          </span>
          <span className="absolute -bottom-1 left-0 w-full h-3 bg-indigo-100 rounded-full -z-10 transform -rotate-1"></span>
        </span>
        to your photos with text
      </h1>
      
      {/* Enhanced description */}
      <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto mb-12">
        Our revolutionary editor places beautiful typography behind, around, and upon 
        your images to create stunning visual compositions that tell your story.
      </p>
      
      {/* Decorative divider */}
      <div className="flex items-center justify-center max-w-xs mx-auto mb-12">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
        <div className="w-2 h-2 rounded-full bg-indigo-300 mx-2"></div>
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
      </div>
      
      {/* Call to action with improved buttons */}
      <div className="flex flex-col sm:flex-row gap-5 justify-center">
        {/* Primary button with gradient */}
        <button onClick={handleGetStartedClick} className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold overflow-hidden shadow-lg hover:shadow-indigo-200/50 transition-all duration-300">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center justify-center gap-2">
            Get Started Free
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </button>
        
       
      </div>
      
      {/* Social proof */}
     
    </div>
  </div>
</section>
       
        {/* Work Section (Gallery) */}
        <WorkSection />

        <FeaturesSection/>


        <section id="howitworks" className="py-24 bg-gray-100 relative overflow-hidden">
  {/* Subtle background elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-40 -left-20 w-72 h-72 bg-indigo-50 rounded-full opacity-50 blur-3xl"></div>
    <div className="absolute bottom-20 right-10 w-80 h-80 bg-violet-50 rounded-full opacity-50 blur-3xl"></div>
  </div>
  
  <div className="container mx-auto px-6 relative z-10 max-w-7xl">
    {/* Section header */}
    <div className="text-center max-w-2xl mx-auto mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
      <p className="text-lg text-gray-600">Transform your photos with our simple three-step process that adds dimension and context through beautiful typography.</p>
    </div>
    
    {/* Process steps */}
    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
      {/* Step 1 */}
      <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl p-8 shadow-sm border border-indigo-50 relative">
        <div className="absolute -top-5 -left-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">1</div>
        </div>
        <div className="mb-6 flex items-center justify-center">
          <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Upload Your Photo</h3>
        <p className="text-gray-600">Import your favorite photos from your device or directly from your social media accounts in seconds.</p>
      </div>
      
      {/* Step 2 */}
      <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl p-8 shadow-sm border border-indigo-50 relative">
        <div className="absolute -top-5 -left-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">2</div>
        </div>
        <div className="mb-6 flex items-center justify-center">
          <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Add Text Elements</h3>
        <p className="text-gray-600">Choose from dozens of text styles and layer options to place typography behind, around, or over your image.</p>
      </div>
      
      {/* Step 3 */}
      <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl p-8 shadow-sm border border-indigo-50 relative">
        <div className="absolute -top-5 -left-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">3</div>
        </div>
        <div className="mb-6 flex items-center justify-center">
          <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900">Download & Share</h3>
        <p className="text-gray-600">Once you're satisfied with the look, download the final image and share it anywhere you like.</p>
      </div>
    </div>
    
    {/* Call to action */}
    <div className="mt-16 text-center">
      <button 
        onClick={handleGetStartedClick}
        className="px-8 py-4 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
      >
        Start Creating Now
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
      <p className="mt-4 text-sm text-gray-500">No credit card required. Free starter plan available.</p>
    </div>
  </div>
  
  {/* Decorative corner element */}
  <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-50 rounded-full opacity-70"></div>
</section>



<section id="perfect-for-creators" className="py-24 bg-gradient-to-br from-indigo-50 to-purple-100 relative overflow-hidden">
  {/* Background elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-100 rounded-full opacity-30 blur-3xl"></div>
  </div>

  <div className="container mx-auto px-6 relative z-10">
    {/* Section header */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Perfect for Every Creator</h2>
      <p className="text-lg text-gray-600">Our text layering tool helps creators of all types enhance their visual storytelling.</p>
    </div>

    {/* Creator types grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Photographers */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-indigo-50 hover:shadow-md transition-all duration-300 group">
        <div className="flex items-center mb-5">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4 group-hover:bg-indigo-500 transition-colors duration-300">
            <svg className="w-6 h-6 text-indigo-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Photographers</h3>
        </div>
        <p className="text-gray-600">Add context to your photography with layered typography that enhances your visual storytelling without distracting from your subject.</p>
        <div className="mt-5 flex items-center text-indigo-500 font-medium">
          <span>Popular for portfolios</span>
          
        </div>
      </div>


      {/* Marketers */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-indigo-50 hover:shadow-md transition-all duration-300 group">
        <div className="flex items-center mb-5">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4 group-hover:bg-indigo-500 transition-colors duration-300">
            <svg className="w-6 h-6 text-indigo-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Marketers</h3>
        </div>
        <p className="text-gray-600">Craft compelling visual ads with text that converts. Combine your brand message with striking imagery for maximum impact.</p>
        <div className="mt-5 flex items-center text-indigo-500 font-medium">
          <span>Great for campaigns</span>
         
        </div>
      </div>

     

      {/* Content Creators */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-indigo-50 hover:shadow-md transition-all duration-300 group">
        <div className="flex items-center mb-5">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4 group-hover:bg-indigo-500 transition-colors duration-300">
            <svg className="w-6 h-6 text-indigo-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Content Creators</h3>
        </div>
        <p className="text-gray-600">Create thumbnails, cover images, and visual content with text that attracts clicks and engagement across all platforms.</p>
        <div className="mt-5 flex items-center text-indigo-500 font-medium">
          <span>Perfect for YouTube</span>
          
        </div>
      </div>

     
    </div>

    {/* Call to action */}
    <div className="mt-16 text-center">
      <button 
        onClick={handleGetStartedClick}
        className="px-8 py-4 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
      >
        Find Your Creative Style
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  </div>
</section>



        {/* Footer */}
        <Footer />
      </main>

      {/* Sign in with Google Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg max-w-md w-full border border-indigo-200/50"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Welcome to TextBack</h3>
              <button
                onClick={() => setShowSignInModal(false)}
                className="text-gray-500 hover:text-indigo-400 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-700 text-sm mb-6 text-center">
              Sign in with your Google account to get started.
            </p>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(79, 70, 229, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              onClick={signInWithGoogle}
              className="w-full bg-gradient-to-r from-indigo-400 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                  fill="#fff"
                />
              </svg>
              Sign in with Google
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomeSection;