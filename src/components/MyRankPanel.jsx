import React, { useEffect, useState } from 'react';
import { getMyRank } from '../api';

export default function MyRankPanel({ userId, period, date, scope, managerId }){
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{
    if (!userId) return setRank(null);
    let mounted = true;
    setLoading(true); setError(null);
    getMyRank({ userId, period, date, scope, managerId }).then(data=>{
      if (!mounted) return;
      setRank(data);
    }).catch(e=>{
      if (!mounted) return;
      setError(e.message || JSON.stringify(e));
      setRank(null);
    }).finally(()=>{ if (mounted) setLoading(false); });
    return ()=>{ mounted = false; };
  }, [userId, period, date, scope, managerId]);

  return (
    <div className="my-rank-panel">
      <h3>My Rank</h3>
      {!userId ? <div>Provide `userId` above to load your rank.</div> : (
        loading ? <div>Loading...</div> : error ? <div className="error">{String(error)}</div> : (
          <div>
            <div>Rank: {rank?.rank ?? '—'}</div>
            <div>Score: {rank?.score ?? rank?.points ?? '—'}</div>
          </div>
        )
      )}
    </div>
  );
}
