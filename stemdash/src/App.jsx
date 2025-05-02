import React from "react";
import './index.css'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from "./pages/login.jsx";

function App() {

  return (
    <>
      <Router>
        <Routes>
         <Route path="/" element={<Login />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
