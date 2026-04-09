import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Splash from './pages/Splash.jsx'
import SignIn from './pages/SIgnIn.jsx'

const App = () => {


    
    return (
    <>
       
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/splash" element={<Splash />} />
            </Routes>
        
    </>
  )
}

export default App