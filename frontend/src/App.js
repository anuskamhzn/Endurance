import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom'; // Removed unused imports
import { Toaster } from "react-hot-toast";

import ClaimPage from './Pages/ClaimPage';
// import ClaimsList from './Pages/ClaimsList'; // Optional: Create this for a full claims overview

const App = () => {
  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route path="/" element={<ClaimPage />} />
      </Routes>
    </div>
  );
};

export default App;