import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomeSection from "./components/HomeSection";
import EditorSection from "./components/EditorSection";
import { supabase } from "./supabaseClient";
import TextOnImageEditor from "./components/TextUponImage";
import DesignBlog from "./components/Blog";
import CardGrid from "./components/cards";
import PrivacyPolicy from "./components/PrivacyPolicy";
const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="w-full text-gray-800 bg-gray-50">

        <Routes>
          <Route path="/" element={<HomeSection session={session} />} />
          <Route 
            path="/textBehindImage" 
            element={
              session ? (
                <EditorSection session={session} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
                <Route path="/Cards" element={<CardGrid />} />
        <Route path="/textOnImage" element={<TextOnImageEditor />} />
        {/* <Route path="/textBorderImage" element={<TextBorderSubject />} /> */}
        <Route path="/blogs" element={<DesignBlog/>}/>
        <Route path="/privacypolicy" element={<PrivacyPolicy/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;