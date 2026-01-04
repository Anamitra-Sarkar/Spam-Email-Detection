import React, { useRef } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import SpamDetector from "./components/SpamDetector";
import Features from "./components/Features";
import AIVisualization from "./components/AIVisualization";
import Footer from "./components/Footer";
import Contact from "./components/Contact";

const LandingPage = () => {
  const detectorRef = useRef(null);
  const howItWorksRef = useRef(null);

  const scrollToDetector = () => {
    const detectorSection = document.getElementById('detector');
    if (detectorSection) {
      detectorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <HeroSection 
        onCheckEmailClick={scrollToDetector} 
        onHowItWorksClick={scrollToHowItWorks}
      />
      <HowItWorks />
      <SpamDetector />
      <Features onCheckEmailClick={scrollToDetector} />
      <AIVisualization />
      <Footer onHowItWorksClick={scrollToHowItWorks} />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
