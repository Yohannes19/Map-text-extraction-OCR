import React from 'react'
import Navbarapp from './components/Nav'
import FileUpload from './components/MapUpload/FileUpload'
import Footer from './components/Footer';
import './App.css'


 function App() {
  return (
    <div className='App'>
      <header id='header'>
      <Navbarapp/>
      </header>
      <main id='main'>
      <FileUpload/>
      
      </main>
      <footer id='footer'>
      <Footer/>
      </footer>
    
      
      
    </div>
  )
}
export default App;
