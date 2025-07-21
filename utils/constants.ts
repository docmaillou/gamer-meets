// App Constants
export const APP_NAME = 'Gamer Meets';
export const APP_VERSION = '1.0.0';

// Gamer Types
export const GAMER_TYPES = ['casual', 'competitive', 'creator'] as const;

// Meet Types
export const MEET_TYPES = ['online', 'in-person', 'mixed'] as const;

// Languages
export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
export const DEFAULT_LANGUAGE = 'fr';

// Popular Games List
export const POPULAR_GAMES = [
  'League of Legends',
  'Valorant',
  'CS2',
  'Overwatch 2',
  'Apex Legends',
  'Fortnite',
  'Call of Duty',
  'FIFA',
  'Rocket League',
  'Among Us',
  'Minecraft',
  'World of Warcraft',
  'Dota 2',
  'Rainbow Six Siege',
  'Genshin Impact',
  'Dead by Daylight',
  'Fall Guys',
  'Cyberpunk 2077',
  'The Witcher 3',
  'Grand Theft Auto V'
];

// UI Constants
export const TAB_BAR_HEIGHT = 80;
export const HEADER_HEIGHT = 60;

// Firebase Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  MEETS: 'meets',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  GROUPS: 'groups'
} as const;

// Phone number validation
export const PHONE_REGEX = /^\+[1-9]\d{1,14}$/;