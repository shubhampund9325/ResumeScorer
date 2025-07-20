import React from 'react';
import './App.css';
import Home from './components/Home'; // Importing the Home component
import  './components/Home.css';
import './components/ResumeParsing.css' // Import global styles
// Import custom styles for the entire application
// Removed unused import: import { dimensionValueTypes } from 'framer-motion';
import ResumeParsing from './components/ResumeParsing'; // Correct import path for ResumeParsing

// Main App component
const App = () => {
  return ( // <--- Added the return statement here
    <div>
     <Home/>
    </div>
  );
};

export default App;