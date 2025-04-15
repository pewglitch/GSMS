import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const TopGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopGames = async () => {
      try {
        const response = await axios.get(`${API_URL}/top-games`);
        setGames(response.data);
      } catch (err) {
        setError('Failed to fetch top games');
      } finally {
        setLoading(false);
      }
    };
    fetchTopGames();
  }, []);

  if (loading) return <div>Loading top games...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: '2rem', background: '#181818', borderRadius: 12, boxShadow: '0 2px 16px #000a', color: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#FFD700', letterSpacing: 2 }}>Top Games</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
        <thead>
          <tr style={{ background: '#222' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700', fontSize: '1.1rem', fontWeight: 700, letterSpacing: 1 }}>#</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700', fontSize: '1.1rem', fontWeight: 700, letterSpacing: 1 }}>Game</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700', fontSize: '1.1rem', fontWeight: 700, letterSpacing: 1 }}>Total Purchases</th>
          </tr>
        </thead>
        <tbody>
          {games.length === 0 ? (
            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '1.5rem', color: '#bbb', background: '#222' }}>No purchases yet.</td></tr>
          ) : (
            games.map((game, idx) => (
              <tr key={game.Game_ID} style={{ background: idx % 2 === 0 ? '#232323' : '#181818' }}>
                <td style={{ padding: '0.75rem', color: '#FFD700', fontWeight: 600 }}>{idx + 1}</td>
                <td style={{ padding: '0.75rem', color: '#fff' }}>{game.Title}</td>
                <td style={{ padding: '0.75rem', color: '#fff' }}>{game.total_purchased}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TopGames;
