import React, { useState } from 'react';
import { putPointsConfig, postRollover } from '../api';

export default function AdminPanel(){
  const [pointsCfg, setPointsCfg] = useState('{}');
  const [rolloverPayload, setRolloverPayload] = useState('{}');
  const [msg, setMsg] = useState(null);

  async function saveCfg(e){
    e.preventDefault(); setMsg(null);
    try{
      const cfg = JSON.parse(pointsCfg);
      const res = await putPointsConfig(cfg);
      setMsg({ ok: true, text: 'Saved' });
    }catch(err){
      setMsg({ ok: false, text: err.message || String(err) });
    }
  }

  async function runRollover(e){
    e.preventDefault(); setMsg(null);
    try{
      const payload = JSON.parse(rolloverPayload);
      const res = await postRollover(payload);
      setMsg({ ok: true, text: 'Rollover started' });
    }catch(err){
      setMsg({ ok: false, text: err.message || String(err) });
    }
  }

  return (
    <div className="admin-panel">
      <h3>Admin</h3>
      <form onSubmit={saveCfg}>
        <div>Points Config (JSON)</div>
        <textarea rows={6} value={pointsCfg} onChange={e=>setPointsCfg(e.target.value)} />
        <div><button type="submit">Save Points Config</button></div>
      </form>

      <form onSubmit={runRollover}>
        <div>Rollover Payload (JSON)</div>
        <textarea rows={4} value={rolloverPayload} onChange={e=>setRolloverPayload(e.target.value)} />
        <div><button type="submit">Run Rollover</button></div>
      </form>

      {msg && <div className={msg.ok ? 'success' : 'error'}>{msg.text}</div>}
    </div>
  );
}
