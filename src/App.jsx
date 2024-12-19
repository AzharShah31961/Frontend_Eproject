import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
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
import Login from "./Pages/Login";

function App() {
  return (
    <BrowserRouter>
      <AppWithSidebarNavbar />
    </BrowserRouter>
  );
}

function AppWithSidebarNavbar() {
  const location = useLocation();

  return (
    <main className="main" id="top">
      <div className="container" data-layout="container">
        {/* Conditionally render Sidebar and Navbar */}
        {location.pathname !== "/login" && (
          <>
            <Sidebar />
          </>
        )}
        <div className="content">
        {location.pathname !== "/login" && (
          <>
            <Navbar />
          </>
        )}
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
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </main>
  );
}

export default App;