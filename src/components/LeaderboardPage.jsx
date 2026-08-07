import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../api';
import MyRankPanel from './MyRankPanel';
import EventForm from './EventForm';
import AdminPanel from './AdminPanel';

export default function LeaderboardPage(){
  const [period, setPeriod] = useState('daily');
  function formatDateISO(d){
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function getWeekString(d){
    // ISO week date
    const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(),0,1));
    const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1)/7);
    return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2,'0')}`;
  }

  function getMonthString(d){
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    return `${yyyy}-${mm}`;
  }

  function getDefaultDateFor(periodName){
    const now = new Date();
    if (periodName === 'daily') return formatDateISO(now);
    if (periodName === 'weekly') return getWeekString(now);
    return getMonthString(now);
  }

  const [date, setDate] = useState(() => getDefaultDateFor('daily'));
  const [scope, setScope] = useState('global');
  const [managerId, setManagerId] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);

  const isAdminView = !userId && !managerId;

  async function load(){
    setLoading(true); setError(null);
    try{
      const data = await getLeaderboard({ period, date, scope, managerId, userId });
      // backend returns `leaderboard` array in responses; fallback to other shapes
      setRows(data.leaderboard || data.entries || data || []);
    }catch(e){
      setError(e.message || JSON.stringify(e));
      setRows([]);
    }finally{ setLoading(false); }
  }

  // ensure a date is present for periods that require it
  useEffect(()=>{
    if (!date) setDate(getDefaultDateFor(period));
  }, [period, date]);

  useEffect(()=>{ load(); }, []);

  return (
    <div className="leaderboard-page">
      <h2> Leaderboard </h2>
      {isAdminView && (
        <div className="admin-banner" style={{padding:'8px 12px',background:'#fff6f6',borderRadius:8,marginBottom:12,border:'1px solid #ffdede',color:'#7a1f1f'}}>
          Admin view: no `userId` or `managerId` provided — showing unfiltered leaderboard and admin actions.
        </div>
      )}
      <div className="controls">
        <label>Period: <select value={period} onChange={e=>setPeriod(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select></label>

        <label>Date: {period === 'daily' ? (
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        ) : period === 'weekly' ? (
          <input type="week" value={date} onChange={e=>setDate(e.target.value)} />
        ) : (
          <input type="month" value={date} onChange={e=>setDate(e.target.value)} />
        )}</label>

        <label>Scope: <select value={scope} onChange={e=>setScope(e.target.value)}>
          <option value="global">Global</option>
          <option value="team">Team</option>
        </select></label>

        <label>ManagerId: <input value={managerId} onChange={e=>setManagerId(e.target.value)} /></label>
        <label>UserId: <input value={userId} onChange={e=>setUserId(e.target.value)} /></label>

        <button onClick={load} disabled={loading}>Load</button>
      </div>

      {error && <div className="error">Error: {String(error)}</div>}

      <div className="results">
        {loading ? <div>Loading...</div> : (
          <table>
            <thead><tr><th>Rank</th><th>User</th><th>Score</th></tr></thead>
            <tbody>
              {rows && rows.length ? rows.map((r, i) => (
                <tr key={r.userId || i}>
                  <td>{r.rank ?? (i+1)}</td>
                  <td>{r.userName ?? r.userId ?? '—'}</td>
                  <td>{r.score ?? r.points ?? r.total ?? 0}</td>
                </tr>
              )) : <tr><td colSpan={3}>No results</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {isAdminView ? (
        <div style={{marginTop:20}}>
          <AdminPanel />
          <div style={{marginTop:12}}>
            <EventForm defaultUserId={userId} defaultManagerId={managerId} />
          </div>
        </div>
      ) : (
        <div className="side-panels">
          <MyRankPanel userId={userId} period={period} date={date} scope={scope} managerId={managerId} />
          <EventForm defaultUserId={userId} defaultManagerId={managerId} />
          <AdminPanel />
        </div>
      )}
    </div>
  );
}
