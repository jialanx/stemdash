import React from "react";
import './index.css'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from "./pages/login.jsx";
import Navbar from "./components/navbar.jsx";
import Signup from "./pages/signup.jsx";

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
         <Route path="/" element={<Login />}/>
         <Route path="/signup" element={<Signup />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
