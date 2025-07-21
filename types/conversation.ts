export interface Conversation {
  id: string;
  participants: string[]; // phoneNumbers
  lastMessage?: Message;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  readBy?: string[];
}

export interface CreateMessageData {
  text: string;
  senderId: string;
}

export interface CreateConversationData {
  participants: string[];
}