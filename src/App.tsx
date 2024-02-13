import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WelcomeScreen } from './components/welcome-screen.component';
import { Signin } from './components/signin.component';
import { Signup } from './components/signup.component';
import { Levels } from './components/levels.component';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<WelcomeScreen />} />
        <Route path='/levels' element={<Levels />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
