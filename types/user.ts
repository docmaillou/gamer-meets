export interface User {
  phoneNumber: string; // Primary key
  gamerType: 'casual' | 'competitive' | 'creator';
  games: string[];
  meetType: 'online' | 'in-person' | 'mixed';
  bio: string;
  avatarUrl?: string;
  language: 'fr' | 'en'; // User's preferred language
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  phoneNumber: string;
  gamerType: 'casual' | 'competitive' | 'creator';
  games: string[];
  meetType: 'online' | 'in-person' | 'mixed';
  bio: string;
  avatarUrl?: string;
  language: 'fr' | 'en';
}

export interface UpdateUserData {
  gamerType?: 'casual' | 'competitive' | 'creator';
  games?: string[];
  meetType?: 'online' | 'in-person' | 'mixed';
  bio?: string;
  avatarUrl?: string;
  language?: 'fr' | 'en';
}