// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LeaderboardPage from './components/LeaderboardPage';
import Landing from './components/Landing';

function App(){
  return (
    <BrowserRouter>
      <div className="app-root">
        <header>
          <h1>Leaderboard</h1>
          <nav>
            <Link to="/">Welcome</Link>
            {' '}|{' '}
            <Link to="/leaderboard">Leaderboard</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/rank" element={<LeaderboardPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
