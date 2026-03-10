import { useState } from 'react';
import HomeScreen from './HomeScreen';
import GameScreen from './GameScreen';

export default function FanApp({ session }) {
  const [selectedGame, setSelectedGame] = useState(null);

  if (selectedGame) {
    return <GameScreen game={selectedGame} onBack={() => setSelectedGame(null)} session={session} />;
  }

  return <HomeScreen onSelectGame={setSelectedGame} session={session} />;
}