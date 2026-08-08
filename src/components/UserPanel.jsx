import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserPanel(){
  const navigate = useNavigate();
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  function handleLogout(){
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
    window.location.reload();
  }

  if (!user) return null;

  return (
    <div className="user-panel" style={{border:'1px solid #ddd', padding:8, borderRadius:6}}>
      <div><strong>Welcome,</strong> {user.name || user._id}</div>
      <div style={{fontSize:12, color:'#555'}}>Role: {user.role}</div>
      <div style={{marginTop:8}}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
