import { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import FanApp from './FanApp';
import GameSetup from './GameSetup';

function App() {
  const isFan = window.location.search.includes('fan');
  const [game, setGame] = useState(null);

  if (isFan) return <FanApp />;
  if (!game) return <GameSetup onStart={setGame} />;
  return <AdminDashboard game={game} />;
}

export default App;