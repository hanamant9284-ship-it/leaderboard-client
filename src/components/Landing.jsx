import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing(){
  return (
    <div className="landing-page">
      <h2>Welcome</h2>
      <p>Welcome to the Leaderboard client. Browse leaderboards or submit activity.</p>
      <div>
        <Link to="/leaderboard"><button>Go to Leaderboard</button></Link>
      </div>
    </div>
  );
}
