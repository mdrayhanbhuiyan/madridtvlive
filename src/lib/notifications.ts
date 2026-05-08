import { Match, MatchStatus } from '../types';

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showMatchLiveNotification = (match: Match) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Match is LIVE! 🔴', {
      body: `${match.teamA} vs ${match.teamB} has just started!`,
      icon: '/favicon.ico', // Adjust icon if available
      tag: `match-live-${match.id}`,
    });

    notification.onclick = (e) => {
      e.preventDefault();
      window.focus();
      window.location.href = `/match/${match.id}`;
    };
  }
};
