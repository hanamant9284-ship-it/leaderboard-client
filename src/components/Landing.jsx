import React from 'react';
import { Link } from 'react-router-dom';
import UserPanel from './UserPanel';

export default function Landing(){
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  return (
    <div className="landing-page">
      <h2>{user ? `Welcome back, ${user.name || user._id}` : 'Welcome'}</h2>
      <p>{user ? 'Jump back into your leaderboard activity.' : 'Welcome to the Leaderboard client. Browse leaderboards or submit activity.'}</p>
      <div>
        <Link to="/leaderboard"><button>Go to Leaderboard</button></Link>
        {' '}
        {!user && <Link to="/auth"><button style={{marginLeft:8}}>Login / Signup</button></Link>}
      </div>
      {user && (
        <div style={{marginTop:12}}>
          <UserPanel />
        </div>
      )}
    </div>
  );
}
