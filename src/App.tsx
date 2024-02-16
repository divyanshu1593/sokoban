import React from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { WelcomeScreen } from './components/welcome-screen.component';
import { Signin } from './components/signin.component';
import { Signup } from './components/signup.component';
import { Levels } from './components/levels.component';
import { selectPayload } from './state-slices/user.slice';
import { useAppSelector } from './hooks/redux-hooks';

function App() {
  const user = useAppSelector(selectPayload);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<WelcomeScreen />} />
        <Route path='/levels' element={<Levels />} />
        <Route path='/signin' element={!user ? <Signin /> : <Navigate replace to={'/'}/>} />
        <Route path='/signup' element={!user ? <Signup /> : <Navigate replace to={'/'}/>} />
        <Route path='*' element={<Navigate replace to={'/'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
