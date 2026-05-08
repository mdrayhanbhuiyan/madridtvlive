export interface FootballScore {
  id: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  time: string;
  league: string;
}

export interface CricketScore {
  id: string;
  teamA: string;
  teamB: string;
  status: string;
  scores: string;
  venue: string;
}

export const getFootballLiveScores = async (): Promise<FootballScore[]> => {
  return [
    { id: '1', home: 'Real Madrid', away: 'Barcelona', homeScore: 2, awayScore: 1, time: "75'", league: 'La Liga' },
    { id: '2', home: 'Man City', away: 'Arsenal', homeScore: 0, awayScore: 0, time: "12'", league: 'Premier League' },
    { id: '3', home: 'PSG', away: 'AC Milan', homeScore: 3, awayScore: 0, time: "FT", league: 'Champions League' },
  ];
};

export const getCricketLiveScores = async (): Promise<CricketScore[]> => {
  return [
    { id: 'c1', teamA: 'India', teamB: 'Australia', status: 'In Progress', scores: 'IND 245/4 (42.1) | AUS 120/2', venue: 'London' },
    { id: 'c2', teamA: 'England', teamB: 'South Africa', status: 'Upcoming', scores: 'Toss at 09:30 AM', venue: 'Manchester' },
  ];
};

export const getNBALiveScores = async () => {
  return [
    { id: 'n1', home: 'Lakers', away: 'Celtics', homeScore: 102, awayScore: 98, quarter: 'Q4', time: '2:15' },
    { id: 'n2', home: 'Warriors', away: 'Suns', homeScore: 110, awayScore: 115, quarter: 'FT', time: '0:00' },
  ];
};

export const getTennisLiveScores = async () => {
  return [
    { id: 't1', playerA: 'Alcaraz', playerB: 'Sinner', sets: '2-1', currentSetScore: '4-3', event: 'Davis Cup' },
  ];
};
