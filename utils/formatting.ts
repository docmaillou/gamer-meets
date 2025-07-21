import { format, formatDistance, formatRelative } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const getLocale = (language: string) => {
  return language === 'fr' ? fr : enUS;
};

export const formatDate = (date: Date, language = 'fr'): string => {
  return format(date, 'dd/MM/yyyy', { locale: getLocale(language) });
};

export const formatTime = (date: Date, language = 'fr'): string => {
  return format(date, 'HH:mm', { locale: getLocale(language) });
};

export const formatDateTime = (date: Date, language = 'fr'): string => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: getLocale(language) });
};

export const formatRelativeTime = (date: Date, language = 'fr'): string => {
  return formatDistance(date, new Date(), { 
    addSuffix: true, 
    locale: getLocale(language) 
  });
};

export const formatChatTime = (date: Date, language = 'fr'): string => {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return formatTime(date, language);
  } else {
    return formatDate(date, language);
  }
};

export const formatUserName = (phoneNumber: string): string => {
  // For privacy, we'll show only last 4 digits
  const lastFour = phoneNumber.slice(-4);
  return `Gamer ${lastFour}`;
};

export const formatGamesList = (games: string[], maxDisplay = 3): string => {
  if (games.length <= maxDisplay) {
    return games.join(', ');
  }
  
  const displayed = games.slice(0, maxDisplay);
  const remaining = games.length - maxDisplay;
  return `${displayed.join(', ')} +${remaining}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength - 3) + '...';
};