import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup, login } from '../api';

export default function AuthPage(){
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [signupPayload, setSignupPayload] = useState({
    userId: '', name: '', role: 'AGENT', managerId: '', password: ''
  });
  const [loginPayload, setLoginPayload] = useState({ userId: '', password: '' });

  async function handleSignup(e){
    e.preventDefault();
    setLoading(true); setMessage(null);
    try{
      const res = await signup(signupPayload);
      setMessage({ type: 'success', text: JSON.stringify(res) });
    }catch(err){
      setMessage({ type: 'error', text: JSON.stringify(err) });
    }finally{ setLoading(false); }
  }

  const navigate = useNavigate();

  async function handleLogin(e){
    e.preventDefault();
    setLoading(true); setMessage(null);
    try{
      const res = await login(loginPayload);
      if (res.accessToken){
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('user', JSON.stringify(res.user || {}));
        setMessage({ type: 'success', text: 'Logged in: ' + (res.user?.name || res.user?._id || '') });
        navigate('/', { replace: true });
      } else {
        setMessage({ type: 'error', text: 'No accessToken in response' });
      }
    }catch(err){
      setMessage({ type: 'error', text: JSON.stringify(err) });
    }finally{ setLoading(false); }
  }

  return (
    <div className="auth-page">
      <h2>Authentication</h2>
      <div style={{marginBottom:12}}>
        <button onClick={() => setMode('login')} disabled={mode==='login'}>Login</button>
        <button onClick={() => setMode('signup')} disabled={mode==='signup'} style={{marginLeft:8}}>Signup</button>
      </div>

      {mode === 'signup' && (
        <form onSubmit={handleSignup}>
          <div>
            <label>User ID</label>
            <input value={signupPayload.userId} onChange={e=>setSignupPayload({...signupPayload, userId: e.target.value})} required />
          </div>
          <div>
            <label>Name</label>
            <input value={signupPayload.name} onChange={e=>setSignupPayload({...signupPayload, name: e.target.value})} required />
          </div>
          <div>
            <label>Role</label>
            <input value={signupPayload.role} onChange={e=>setSignupPayload({...signupPayload, role: e.target.value})} />
          </div>
          <div>
            <label>Manager ID</label>
            <input value={signupPayload.managerId} onChange={e=>setSignupPayload({...signupPayload, managerId: e.target.value})} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={signupPayload.password} onChange={e=>setSignupPayload({...signupPayload, password: e.target.value})} required />
          </div>
          <div style={{marginTop:8}}>
            <button type="submit" disabled={loading}>Create account</button>
          </div>
        </form>
      )}

      {mode === 'login' && (
        <form onSubmit={handleLogin}>
          <div>
            <label>User ID</label>
            <input value={loginPayload.userId} onChange={e=>setLoginPayload({...loginPayload, userId: e.target.value})} required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={loginPayload.password} onChange={e=>setLoginPayload({...loginPayload, password: e.target.value})} required />
          </div>
          <div style={{marginTop:8}}>
            <button type="submit" disabled={loading}>Login</button>
          </div>
        </form>
      )}

      {message && (
        <div style={{marginTop:12,color: message.type==='error' ? 'darkred' : 'green'}}>
          {message.text}
        </div>
      )}

      <div style={{marginTop:16}}>
        <strong>Stored token:</strong>
        <div style={{wordBreak:'break-all'}}>{localStorage.getItem('accessToken') || '(none)'}</div>
      </div>
    </div>
  );
}
