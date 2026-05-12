export enum Sport {
  FOOTBALL = 'Football',
  CRICKET = 'Cricket',
  NBA = 'NBA',
  TENNIS = 'Tennis',
  UFC = 'UFC',
  F1 = 'F1',
  BASKETBALL = 'Basketball',
  GENERAL = 'General'
}

export enum StreamType {
  IFRAME = 'iframe',
  YOUTUBE = 'youtube',
  M3U8 = 'm3u8'
}

export enum MatchStatus {
  UPCOMING = 'Upcoming',
  LIVE = 'Live',
  FINISHED = 'Finished'
}

export interface Channel {
  id: string;
  name: string;
  sport: Sport;
  country: string;
  logo: string;
  type: StreamType;
  source: string;
  status: 'Active' | 'Offline';
  createdAt: number;
}

export interface Match {
  id: string;
  title?: string;
  teamA: string;
  teamB: string;
  teamALogo?: string;
  teamBLogo?: string;
  sport: Sport;
  tournament: string;
  date: number;
  status: MatchStatus;
  channelId?: string;
  scoreA?: string | number;
  scoreB?: string | number;
  isFeatured?: boolean;
  aiPrediction?: {
    teamAProb: number;
    teamBProb: number;
    drawProb: number;
    reason: string;
  };
  votesA?: number;
  votesB?: number;
  votesDraw?: number;
}

export interface CommentaryItem {
  id: string;
  minute: string;
  text: string;
  type: 'goal' | 'card' | 'info' | 'substitution';
  timestamp: number;
}

export interface SliderItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
}

export interface Highlight {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  category: Sport | string;
  duration?: string;
  createdAt: number;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  status: 'Draft' | 'Scheduled' | 'Published' | 'Archived';
  sportType?: string;
  country?: string;
  tone?: string;
  publishDate: number;
  createdAt: number;
  allowComments?: boolean;
  isFeatured?: boolean;
}

export interface AdConfig {
  id: string;
  name: string;
  topBanner: string;
  insideArticle1: string;
  insideArticle2: string;
  sidebar: string;
  footer: string;
}

export interface SiteWidget {
  id: string;
  name: string;
  type: string;
  htmlCode: string;
  placement: 'HomeSidebar' | 'LiveScore' | 'MatchDetails' | 'Footer';
}

export interface SiteAd {
  id: string;
  name: string;
  placement: 'Header' | 'Sidebar' | 'Player' | 'Footer';
  code: string;
}
