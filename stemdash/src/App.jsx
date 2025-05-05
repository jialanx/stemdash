import React, { useState } from "react";
import { UserContext } from './UserContext';
import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from "./pages/login.jsx";
import Navbar from "./components/navbar.jsx";
import Signup from "./pages/signup.jsx";
import Dashboard from "./pages/dashboard.jsx";
import { Hub } from "./pages/hub.jsx";

function App() {
  const [user, setUser] = useState(null); 

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path ="/hub" element= {<Hub />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
