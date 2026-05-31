import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import NewsTicker from './components/layout/NewsTicker';
import Home from './pages/Home';
import LiveTV from './pages/LiveTV';
import ChannelPage from './pages/ChannelPage';
import LiveScore from './pages/LiveScore';
import Schedule from './pages/Schedule';
import Highlights from './pages/Highlights';
import News from './pages/News';
import SingleNews from './pages/SingleNews';
import Contact from './pages/Contact';
import About from './pages/About';
import Policy from './pages/Policy';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider as DataProviderOriginal } from './context/DataContext';

import LeaguePage from './pages/LeaguePage';
import { Sport } from './types';

import SearchResults from './pages/SearchResults';
import MatchDetails from './pages/MatchDetails';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <DataProviderOriginal>
            <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-neon-lime selection:text-black">
              <NewsTicker />
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/match/:id" element={<MatchDetails />} />
                  <Route path="/live-tv" element={<LiveTV />} />
                  <Route path="/channel/:id" element={<ChannelPage />} />
                  <Route path="/live-score" element={<LiveScore />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/football" element={<LeaguePage sport={Sport.FOOTBALL} />} />
                  <Route path="/football/worldcup-2026" element={<LeaguePage sport={Sport.FOOTBALL} tournament="Worldcup 2026" />} />
                  <Route path="/cricket" element={<LeaguePage sport={Sport.CRICKET} />} />
                  <Route path="/nba" element={<LeaguePage sport={Sport.NBA} />} />
                  <Route path="/tennis" element={<LeaguePage sport={Sport.TENNIS} />} />
                  <Route path="/highlights" element={<Highlights />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:slug" element={<SingleNews />} />
                  <Route path="/news/category/:category" element={<News />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/privacy-policy" element={<Policy type="privacy" />} />
                  <Route path="/dmca" element={<Policy type="dmca" />} />
                  <Route path="/disclaimer" element={<Policy type="disclaimer" />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </DataProviderOriginal>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
