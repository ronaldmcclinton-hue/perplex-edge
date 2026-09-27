export type GameDNAForecast = {
  id: string;
  sport: "NFL";
  away: string;
  home: string;
  kickoff: string;
  pick: string;
  opponent: string;
  winProbability: number;
  fairMargin: number;
  fairTotal: number;
  venueSide: "home" | "away";
  status: "upcoming" | "research";
};

export const weekThreeForecasts: GameDNAForecast[] = [
  { id: "cle-atl", sport: "NFL", away: "Cleveland Browns", home: "Atlanta Falcons", kickoff: "Sun 1:00 PM ET", pick: "Cleveland Browns", opponent: "Atlanta Falcons", winProbability: 55.11, fairMargin: 1, fairTotal: 48, venueSide: "away", status: "research" },
  { id: "pit-ne", sport: "NFL", away: "Pittsburgh Steelers", home: "New England Patriots", kickoff: "Sun 1:00 PM ET", pick: "Pittsburgh Steelers", opponent: "New England Patriots", winProbability: 53.85, fairMargin: 1, fairTotal: 41, venueSide: "away", status: "research" },
  { id: "hou-ten", sport: "NFL", away: "Houston Texans", home: "Tennessee Titans", kickoff: "Sun 1:00 PM ET", pick: "Houston Texans", opponent: "Tennessee Titans", winProbability: 57.81, fairMargin: 3, fairTotal: 46, venueSide: "away", status: "research" },
  { id: "kc-lac", sport: "NFL", away: "Kansas City Chiefs", home: "Los Angeles Chargers", kickoff: "Sun 1:00 PM ET", pick: "Kansas City Chiefs", opponent: "Los Angeles Chargers", winProbability: 59.22, fairMargin: 3, fairTotal: 46, venueSide: "away", status: "research" },
  { id: "mia-buf", sport: "NFL", away: "Miami Dolphins", home: "Buffalo Bills", kickoff: "Sun 1:00 PM ET", pick: "Buffalo Bills", opponent: "Miami Dolphins", winProbability: 80.96, fairMargin: 11, fairTotal: 48, venueSide: "home", status: "research" },
  { id: "ind-jax", sport: "NFL", away: "Indianapolis Colts", home: "Jacksonville Jaguars", kickoff: "Sun 1:00 PM ET", pick: "Jacksonville Jaguars", opponent: "Indianapolis Colts", winProbability: 52.12, fairMargin: 1, fairTotal: 41, venueSide: "home", status: "research" },
  { id: "gb-det", sport: "NFL", away: "Green Bay Packers", home: "Detroit Lions", kickoff: "Sun 1:00 PM ET", pick: "Detroit Lions", opponent: "Green Bay Packers", winProbability: 77.70, fairMargin: 9, fairTotal: 49, venueSide: "home", status: "research" },
  { id: "sea-ari", sport: "NFL", away: "Seattle Seahawks", home: "Arizona Cardinals", kickoff: "Sun 4:05 PM ET", pick: "Seattle Seahawks", opponent: "Arizona Cardinals", winProbability: 77.11, fairMargin: 8, fairTotal: 44, venueSide: "away", status: "research" },
  { id: "dal-nyg", sport: "NFL", away: "Dallas Cowboys", home: "New York Giants", kickoff: "Sun 4:25 PM ET", pick: "New York Giants", opponent: "Dallas Cowboys", winProbability: 72.33, fairMargin: 7, fairTotal: 44, venueSide: "home", status: "research" },
  { id: "sf-lar", sport: "NFL", away: "San Francisco 49ers", home: "Los Angeles Rams", kickoff: "Sun 4:25 PM ET", pick: "San Francisco 49ers", opponent: "Los Angeles Rams", winProbability: 80.00, fairMargin: 9, fairTotal: 43, venueSide: "away", status: "research" },
  { id: "min-chi", sport: "NFL", away: "Minnesota Vikings", home: "Chicago Bears", kickoff: "Sun 4:25 PM ET", pick: "Minnesota Vikings", opponent: "Chicago Bears", winProbability: 63.68, fairMargin: 4, fairTotal: 44, venueSide: "away", status: "research" },
  { id: "bal-cin", sport: "NFL", away: "Baltimore Ravens", home: "Cincinnati Bengals", kickoff: "Sun 4:25 PM ET", pick: "Baltimore Ravens", opponent: "Cincinnati Bengals", winProbability: 60.54, fairMargin: 3, fairTotal: 47, venueSide: "away", status: "research" },
  { id: "tb-no", sport: "NFL", away: "Tampa Bay Buccaneers", home: "New Orleans Saints", kickoff: "Sun 8:20 PM ET", pick: "New Orleans Saints", opponent: "Tampa Bay Buccaneers", winProbability: 64.60, fairMargin: 4, fairTotal: 47, venueSide: "home", status: "research" },
  { id: "lv-den", sport: "NFL", away: "Las Vegas Raiders", home: "Denver Broncos", kickoff: "Mon 7:15 PM ET", pick: "Denver Broncos", opponent: "Las Vegas Raiders", winProbability: 58.23, fairMargin: 3, fairTotal: 42, venueSide: "home", status: "research" },
  { id: "car-chi", sport: "NFL", away: "Carolina Panthers", home: "Chicago Bears", kickoff: "Mon 8:15 PM ET", pick: "Chicago Bears", opponent: "Carolina Panthers", winProbability: 52.99, fairMargin: 1, fairTotal: 46, venueSide: "home", status: "research" },
];

export const shortTeam = (name: string) => {
  const parts = name.split(" ");
  return parts[parts.length - 1];
};
