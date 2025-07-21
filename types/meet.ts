export interface Meet {
  id: string;
  title: string;
  description: string;
  game: string;
  time: Date;
  type: 'online' | 'in-person';
  createdBy: string; // phoneNumber
  participants: string[]; // phoneNumbers
  maxParticipants?: number;
  location?: string; // For in-person meets
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMeetData {
  title: string;
  description: string;
  game: string;
  time: Date;
  type: 'online' | 'in-person';
  maxParticipants?: number;
  location?: string;
}

export interface UpdateMeetData {
  title?: string;
  description?: string;
  game?: string;
  time?: Date;
  type?: 'online' | 'in-person';
  maxParticipants?: number;
  location?: string;
}