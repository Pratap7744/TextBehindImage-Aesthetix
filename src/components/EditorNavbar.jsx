import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { RiImageEditFill, RiImageEditLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";

const EditorNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef(null);
  const accountRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch and listen to auth session changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error("Error fetching session:", error);
      setSession(session);
    };
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Track scroll position for header styling and measure navbar height
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    
    // Measure navbar height after render and on window resize
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };
    
    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set CSS variable for navbar height
  useEffect(() => {
    if (navbarHeight > 0) {
      document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
    }
  }, [navbarHeight]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error);
    else {
      navigate("/");
      setIsMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.header
        ref={navbarRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrollPosition > 50
            ? "py-3 bg-white/90 backdrop-blur-sm shadow-md"
            : "py-6 bg-white/95"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-600" />
                <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
                <span className="font-bold text-xl text-gray-900">𝘈
                </span>
                </div>
              </div>
              <Link to={"/"}>
              <span className="font-extrabold text-2xl text-gray-900 tracking-tight">
              Aesthetix
              </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex">
              <ul className="flex space-x-1 p-1 rounded-full bg-gray-100/80 shadow-sm">
                {[
                  // { name: "Text-Behind-Image", path: "/textBehindImage", icon: RiImageEditLine },
                  // { name: "Text-On-Image", path: "/textOnImage", icon: RiImageEditFill },
                  // { name: "Text-Border-Image", path: "/textBorderImage", icon: RiImageEditFill },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                        isActive(item.path)
                          ? "text-white bg-gradient-to-r from-indigo-400 to-indigo-600"
                          : "text-gray-700 hover:text-white hover:bg-indigo-300"
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      <span className="relative z-10">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center space-x-2">
              {/* Account Dropdown - Desktop Only */}
              <div className="relative hidden md:block" ref={accountRef}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(79, 70, 229, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className={`flex items-center bg-gradient-to-r from-indigo-400 to-indigo-600 text-white font-medium py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ${
                    isAccountOpen ? "bg-indigo-700" : ""
                  }`}
                >
                  <CgProfile className="w-5 h-5 mr-2" />
                  <span>Account</span>
                  <ChevronDown
                    className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                      isAccountOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                {isAccountOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-indigo-100 z-50">
                    <div className="block px-4 py-2 text-sm text-gray-700 border-b border-indigo-100 truncate">
                      {session?.user?.email || "Loading..."}
                    </div>
                    <button
                      onClick={signOut}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Absolute Positioned Inside the Header */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 z-40 bg-white shadow-lg border-t border-gray-100">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/textBehindImage"
                className={`flex items-center px-3 py-3 rounded-lg text-base font-medium ${
                  isActive("/textBehindImage")
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <RiImageEditLine className="w-5 h-5 mr-3" />
                <span>TextBehindImage</span>
              </Link>
              <Link
                to="/textOnImage"
                className={`flex items-center px-3 py-3 rounded-lg text-base font-medium ${
                  isActive("/textOnImage")
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <RiImageEditFill className="w-5 h-5 mr-3" />
                <span>TextUponImage</span>
              </Link>
              <div className="pt-2 mt-2 border-t border-indigo-100">
                <div className="px-3 py-2 text-sm font-medium text-gray-600 flex items-center">
                  <CgProfile className="w-4 h-4 mr-2 text-indigo-500" />
                  <span className="truncate">{session?.user?.email || "Loading..."}</span>
                </div>
                <button
                  onClick={signOut}
                  className="w-full text-left px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.header>
      
      {/* Spacer div to push content below the navbar */}
      <div style={{ height: `${navbarHeight}px` }} />
    </>
  );
};

export default EditorNavbar;