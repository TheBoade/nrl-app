import { useState } from 'react';
import HomeScreen from './HomeScreen';
import GameScreen from './GameScreen';
import StandingsScreen from './StandingsScreen';
import StatsScreen from './StatsScreen';

export default function FanApp({ session }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [showStandings, setShowStandings] = useState(false);
  const [showStats, setShowStats] = useState(false);

  if (selectedGame) {
    return <GameScreen game={selectedGame} onBack={() => setSelectedGame(null)} session={session} />;
  }

  if (showStandings) {
    return <StandingsScreen onBack={() => setShowStandings(false)} />;
  }

  if (showStats) {
    return <StatsScreen onBack={() => setShowStats(false)} />;
  }

  return (
    <HomeScreen
      onSelectGame={setSelectedGame}
      session={session}
      onShowStandings={() => setShowStandings(true)}
      onShowStats={() => setShowStats(true)}
    />
  );
}