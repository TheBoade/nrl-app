export const NRL_TEAMS = {
  "Broncos":    { c1: "#760135", c2: "#FBB715", c3: "#760135" },
  "Raiders":    { c1: "#69B231", c2: "#FFFFFF", c3: "#003087" },
  "Bulldogs":   { c1: "#003F87", c2: "#FFFFFF", c3: "#003F87" },
  "Sharks":     { c1: "#00A0CE", c2: "#FFFFFF", c3: "#000000" },
  "Titans":     { c1: "#009FDF", c2: "#FFD100", c3: "#009FDF" },
  "Sea Eagles": { c1: "#6B207D", c2: "#C8102E", c3: "#6B207D" },
  "Storm":      { c1: "#460078", c2: "#FFD100", c3: "#460078" },
  "Knights":    { c1: "#003B73", c2: "#C8102E", c3: "#003B73" },
  "Cowboys":    { c1: "#003366", c2: "#FFD100", c3: "#003366" },
  "Eels":       { c1: "#003087", c2: "#FFD100", c3: "#003087" },
  "Panthers":   { c1: "#2D1147", c2: "#FFFFFF", c3: "#2D1147" },
  "Rabbitohs":  { c1: "#006940", c2: "#FF0000", c3: "#006940" },
  "Dragons":    { c1: "#8B0000", c2: "#FFFFFF", c3: "#8B0000" },
  "Roosters":   { c1: "#C8102E", c2: "#FFFFFF", c3: "#003087" },
  "Warriors":   { c1: "#808285", c2: "#000000", c3: "#808285" },
  "Tigers":     { c1: "#FF7F00", c2: "#000000", c3: "#FF7F00" },
  "Dolphins":   { c1: "#E8002D", c2: "#FFFFFF", c3: "#E8002D" },
};

export const ROUNDS = [
  {
    round: 1,
    games: [
      // Sun 1 Mar — Las Vegas (AEDT) — Tigers had the bye
      { id: "r1_g1", home: "Knights",    away: "Cowboys",   status: "full_time", home_score: 28, away_score: 18, time: "Sun 1 Mar",  venue: "Allegiant Stadium, Las Vegas" },
      { id: "r1_g2", home: "Bulldogs",   away: "Dragons",   status: "full_time", home_score: 15, away_score: 14, time: "Sun 1 Mar",  venue: "Allegiant Stadium, Las Vegas" },
      // Thu 5 Mar
      { id: "r1_g3", home: "Storm",      away: "Eels",      status: "full_time", home_score: 52, away_score: 4,  time: "Thu 5 Mar",  venue: "AAMI Park, Melbourne" },
      // Fri 6 Mar
      { id: "r1_g4", home: "Warriors",   away: "Roosters",  status: "full_time", home_score: 42, away_score: 18, time: "Fri 6 Mar",  venue: "Go Media Stadium, Auckland" },
      { id: "r1_g5", home: "Broncos",    away: "Panthers",  status: "full_time", home_score: 0,  away_score: 26, time: "Fri 6 Mar",  venue: "Suncorp Stadium, Brisbane" },
      // Sat 7 Mar
      { id: "r1_g6", home: "Sharks",     away: "Titans",    status: "full_time", home_score: 50, away_score: 10, time: "Sat 7 Mar",  venue: "Ocean Protect Stadium, Sydney" },
      { id: "r1_g7", home: "Sea Eagles", away: "Raiders",   status: "full_time", home_score: 28, away_score: 29, time: "Sat 7 Mar",  venue: "4 Pines Park, Sydney" },
      // Sun 8 Mar
      { id: "r1_g8", home: "Dolphins",   away: "Rabbitohs", status: "full_time", home_score: 30, away_score: 40, time: "Sun 8 Mar",  venue: "Suncorp Stadium, Brisbane" },
    ],
  },
  {
    round: 2,
    games: [
      // Thu 12 Mar — Bulldogs have the bye
      { id: "r2_g1", home: "Broncos",    away: "Eels",      status: "upcoming", time: "Thu 8:00pm", venue: "Suncorp Stadium, Brisbane" },
      // Fri 13 Mar
      { id: "r2_g2", home: "Warriors",   away: "Raiders",   status: "upcoming", time: "Fri 6:00pm", venue: "Go Media Stadium, Auckland" },
      { id: "r2_g3", home: "Roosters",   away: "Rabbitohs", status: "upcoming", time: "Fri 8:00pm", venue: "Allianz Stadium, Sydney" },
      // Sat 14 Mar
      { id: "r2_g4", home: "Tigers",     away: "Cowboys",   status: "upcoming", time: "Sat 3:00pm", venue: "Leichhardt Oval, Sydney" },
      { id: "r2_g5", home: "Dragons",    away: "Storm",     status: "upcoming", time: "Sat 5:30pm", venue: "WIN Stadium, Wollongong" },
      { id: "r2_g6", home: "Panthers",   away: "Sharks",    status: "upcoming", time: "Sat 7:30pm", venue: "Carrington Park, Bathurst" },
      // Sun 15 Mar
      { id: "r2_g7", home: "Sea Eagles", away: "Knights",   status: "upcoming", time: "Sun 4:05pm", venue: "4 Pines Park, Sydney" },
      { id: "r2_g8", home: "Dolphins",   away: "Titans",    status: "upcoming", time: "Sun 6:15pm", venue: "Suncorp Stadium, Brisbane" },
    ],
  },
];