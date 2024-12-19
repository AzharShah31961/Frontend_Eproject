import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home"; // Ensure Home component is correctly imported
import Adminread from "./Pages/Adminread";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import Roleread from "./Pages/Roleread";
import Staffread from "./Pages/Staffread";
import Guestread from "./Pages/Guestread";
import Roomtype from "./Pages/Roomtype";
import Roomread from "./Pages/Roomread";
import Floorread from "./Pages/Floorread";
import Foodread from "./Pages/Foodread";
import LaundryRead from "./Pages/Laundryread";
import Feedbackread from "./Pages/Feedbackread";
function App() {
  return (
    <BrowserRouter>
      <main className="main" id="top">
        <div className="container" data-layout="container">
          {/* Sidebar/ */}
          <Sidebar />
          <div className="content">
            {/* Navbar */}
            <Navbar />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Admin" element={<Adminread />} />
              <Route path="/Role" element={<Roleread />} />
              <Route path="/Staff" element={<Staffread />} />
              <Route path="/Guest" element={<Guestread />} />
              <Route path="/Roomtype" element={<Roomtype />} />
              <Route path="/Room" element={<Roomread />} />
              <Route path="/Floor" element={<Floorread />} />
              <Route path="/Food" element={<Foodread />} />
              <Route path="/Laundry" element={<LaundryRead />} />
              <Route path="/Feedback" element={<Feedbackread />} />
            </Routes>
          </div>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
