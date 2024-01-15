import React from 'react'
import Navbarapp from './components/Nav/Nav'
import FileUpload from './components/MapUpload/FileUpload'
import Footer from './components/Footer/Footer';
import { AppProvider } from './AppContext';
import './App.css'
 // Import the ComparisonSection component
import ComparisonSection from './components/MapUpload/ComaprsionSection';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SupportComponent from './components/util/support';

 function App() {
  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Comparison', path: '/comparison' },
    { name: 'Support', path: '/support' },
    { name: 'PaddleOCR', path: 'https://github.com/PaddlePaddle/PaddleOCR/' },
  ];
  return (
    
    <Router>
    <div className='App'>
      <header id='header'>
      
        <Navbarapp links={navLinks} />
       
      </header>
      <main id='main'>
      <Routes>
            <Route path="/" element={<FileUpload />} />
            <Route path="/comparison" element={<ComparisonSection/>} />
            <Route path="/support" element={<SupportComponent/>} />
            
          </Routes>
       
      </main>
      <footer class='footer'>
      <Footer/>
      </footer>
    
      
      
    </div>
    </Router>
    
  )
}
export default App;
