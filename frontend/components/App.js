import React from 'react'
import { NavLink, Routes, Route } from 'react-router-dom';
import Home from './Home'
import Form from './Form'

function App() {
  return (
    <div id="app">
      <nav>
        {/* <NavLink to="/" Class="active">Home</NavLink> */}
        <NavLink to="/" activeClassName="active">Home</NavLink>
        <NavLink to="/order" activeClassName="active">Order</NavLink>
      </nav>
      {/* Route and Routes here */}
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/order" element={<Form />} />
      </Routes>       
      
      </div>    
      )}
      

      export default App
