import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Channel, Match, Highlight, NewsPost, SiteWidget, SiteAd, MatchStatus, SliderItem } from '../types';
import { handleFirestoreError, OperationType } from '../lib/error-handler';
import { showMatchLiveNotification } from '../lib/notifications';

interface DataContextType {
  channels: Channel[];
  matches: Match[];
  highlights: Highlight[];
  news: NewsPost[];
  widgets: SiteWidget[];
  ads: SiteAd[];
  sliders: SliderItem[];
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [widgets, setWidgets] = useState<SiteWidget[]>([]);
  const [ads, setAds] = useState<SiteAd[]>([]);
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const prevMatchStatuses = useRef<Record<string, MatchStatus>>({});

  useEffect(() => {
    const unsubChannels = onSnapshot(collection(db, 'channels'), (snap) => {
      setChannels(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Channel)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'channels'));

    const unsubMatches = onSnapshot(collection(db, 'matches'), (snap) => {
      const newMatches = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
      
      // Check for live status changes
      newMatches.forEach(match => {
        const prevStatus = prevMatchStatuses.current[match.id];
        if (prevStatus && prevStatus !== MatchStatus.LIVE && match.status === MatchStatus.LIVE) {
          showMatchLiveNotification(match);
        }
        prevMatchStatuses.current[match.id] = match.status;
      });

      setMatches(newMatches);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'matches'));

    const unsubHighlights = onSnapshot(collection(db, 'highlights'), (snap) => {
      setHighlights(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Highlight)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'highlights'));

    const unsubNews = onSnapshot(query(collection(db, 'news'), orderBy('publishDate', 'desc')), (snap) => {
      setNews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsPost)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'news'));

    const unsubWidgets = onSnapshot(collection(db, 'widgets'), (snap) => {
      setWidgets(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SiteWidget)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'widgets'));

    const unsubAds = onSnapshot(collection(db, 'ads'), (snap) => {
      setAds(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SiteAd)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'ads'));

    const unsubSliders = onSnapshot(query(collection(db, 'sliders'), orderBy('order', 'asc')), (snap) => {
      setSliders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SliderItem)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'sliders'));

    setLoading(false);

    return () => {
      unsubChannels();
      unsubMatches();
      unsubHighlights();
      unsubNews();
      unsubWidgets();
      unsubAds();
      unsubSliders();
    };
  }, []);

  return (
    <DataContext.Provider value={{ channels, matches, highlights, news, widgets, ads, sliders, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
