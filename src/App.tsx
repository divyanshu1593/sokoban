import React from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { WelcomeScreen } from './components/welcome-screen/welcome-screen.component';
import { Signin } from './components/welcome-screen/signin.component';
import { Signup } from './components/welcome-screen/signup.component';
import { Levels } from './components/levels-screen/levels.component';
import { makeSelectPayload } from './state-slices/user.slice';
import { useAppSelector } from './hooks/redux-hooks';
import { Leaderboard } from './components/leaderboard-screen/leader-board.component';

function App() {
  const user = useAppSelector(makeSelectPayload());
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<WelcomeScreen />} />
        <Route path='/levels' element={<Levels />} />
        <Route path='/signin' element={!user ? <Signin /> : <Navigate replace to={'/'}/>} />
        <Route path='/signup' element={!user ? <Signup /> : <Navigate replace to={'/'}/>} />
        <Route path='/leaderboard/:level' Component={Leaderboard}/>
        <Route path='*' element={<Navigate replace to={'/'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
