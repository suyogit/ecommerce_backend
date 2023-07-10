import React from 'react'
import { useEffect } from "react";

import './App.css';
import Header from './component/layout/Header/Header';
import { BrowserRouter as Router } from 'react-router-dom';
import WebFont from 'webfontloader';
import Footer from './component/layout/Footer/Footer';
function App() {

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka']
      }
    });
  }, []);



  return ( 
    <Router>
      <Header />
      <Footer />
    </Router>);
}


export default App;
