import React from 'react'
import {Routes, Route, useNavigate, } from 'react-router-dom';
import Home from './Home'
import Form from './Form'

function App() {
  const navigate = useNavigate();
  return (
    <div id="app">
      <nav>
        {/* <NavLink to="/" Class="active">Home</NavLink> */}
        <a onClick={() => navigate("/" )}>Home</a>
        <a onClick={() => navigate("/order")}>Order</a>
      </nav>
      {/* Route and Routes here */}
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/order" element={<Form />} />
      </Routes>       
      
      </div>    
      )}
      

      export default App
