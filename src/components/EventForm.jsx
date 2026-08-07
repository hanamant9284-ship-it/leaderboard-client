import React, { useState } from 'react';
import { postEvent } from '../api';

export default function EventForm({ defaultUserId = '', defaultManagerId = '' }){
  const [userId, setUserId] = useState(defaultUserId);
  const [managerId, setManagerId] = useState(defaultManagerId);
  const [points, setPoints] = useState(0);
  const [scope, setScope] = useState('global');
  const [timestamp, setTimestamp] = useState('');
  const [status, setStatus] = useState(null);

  async function submit(e){
    e.preventDefault();
    setStatus(null);
    try{
      const payload = { userId, managerId, points: Number(points), scope, timestamp: timestamp || undefined };
      const res = await postEvent(payload);
      setStatus({ ok: true, message: 'Submitted' });
    }catch(err){
      setStatus({ ok: false, message: err.message || JSON.stringify(err) });
    }
  }

  return (
    <div className="event-form">
      <h3>Submit Event</h3>
      <form onSubmit={submit}>
        <label>UserId: <input value={userId} onChange={e=>setUserId(e.target.value)} /></label>
        <label>ManagerId: <input value={managerId} onChange={e=>setManagerId(e.target.value)} /></label>
        <label>Points: <input type="number" value={points} onChange={e=>setPoints(e.target.value)} /></label>
        <label>Scope: <select value={scope} onChange={e=>setScope(e.target.value)}>
          <option value="global">Global</option>
          <option value="team">Team</option>
        </select></label>
        <label>Timestamp: <input type="datetime-local" value={timestamp} onChange={e=>setTimestamp(e.target.value)} /></label>
        <div>
          <button type="submit">Send Event</button>
        </div>
      </form>
      {status && <div className={status.ok ? 'success' : 'error'}>{status.message}</div>}
    </div>
  );
}
