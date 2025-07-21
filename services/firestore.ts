import {
  firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from './firebase';

import { COLLECTIONS } from '@/utils/constants';
import { SecurityUtils, FirebaseSecurityUtils } from '@/utils/security';
import SecureFirestore from './secureFirestore';
import type { User, CreateUserData, UpdateUserData } from '@/types/user';
import type { Meet, CreateMeetData, UpdateMeetData } from '@/types/meet';
import type { Conversation, Message, CreateMessageData, CreateConversationData } from '@/types/conversation';
import type { Group, CreateGroupData, UpdateGroupData } from '@/types/group';

// Utility functions
const convertTimestamp = (timestamp: unknown): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date();
};

const convertDocData = <T>(data: unknown): T => {
  if (typeof data !== 'object' || data === null) {
    return data as T;
  }
  
  const converted = { ...data } as Record<string, unknown>;
  
  // Convert Firestore timestamps to Date objects
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = (converted[key] as Timestamp).toDate();
    }
  });
  
  return converted as T;
};

// User operations
export const createUser = async (phoneNumber: string, userData: CreateUserData): Promise<void> => {
  const userRef = doc(firestore, COLLECTIONS.USERS, phoneNumber);
  const now = new Date();
  
  await setDoc(userRef, {
    ...userData,
    phoneNumber,
    createdAt: now,
    updatedAt: now,
  });
};

export const getUser = async (phoneNumber: string): Promise<User | null> => {
  const userRef = doc(firestore, COLLECTIONS.USERS, phoneNumber);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return convertDocData<User>(userSnap.data());
  }
  
  return null;
};

export const updateUser = async (phoneNumber: string, userData: UpdateUserData): Promise<void> => {
  const userRef = doc(firestore, COLLECTIONS.USERS, phoneNumber);
  
  await updateDoc(userRef, {
    ...userData,
    updatedAt: new Date(),
  });
};

export const deleteUser = async (phoneNumber: string): Promise<void> => {
  const userRef = doc(firestore, COLLECTIONS.USERS, phoneNumber);
  await deleteDoc(userRef);
};

// Meet operations
export const createMeet = async (meetData: CreateMeetData, createdBy: string): Promise<string> => {
  const meetsRef = collection(firestore, COLLECTIONS.MEETS);
  const now = new Date();
  
  const meetDoc = await addDoc(meetsRef, {
    ...meetData,
    createdBy,
    participants: [createdBy],
    createdAt: now,
    updatedAt: now,
  });
  
  return meetDoc.id;
};

export const getMeet = async (meetId: string): Promise<Meet | null> => {
  const meetRef = doc(firestore, COLLECTIONS.MEETS, meetId);
  const meetSnap = await getDoc(meetRef);
  
  if (meetSnap.exists()) {
    return convertDocData<Meet>({ id: meetSnap.id, ...meetSnap.data() });
  }
  
  return null;
};

export const updateMeet = async (meetId: string, meetData: UpdateMeetData): Promise<void> => {
  const meetRef = doc(firestore, COLLECTIONS.MEETS, meetId);
  
  await updateDoc(meetRef, {
    ...meetData,
    updatedAt: new Date(),
  });
};

export const deleteMeet = async (meetId: string): Promise<void> => {
  const meetRef = doc(firestore, COLLECTIONS.MEETS, meetId);
  await deleteDoc(meetRef);
};

export const joinMeet = async (meetId: string, phoneNumber: string): Promise<void> => {
  const meetRef = doc(firestore, COLLECTIONS.MEETS, meetId);
  const meetSnap = await getDoc(meetRef);
  
  if (meetSnap.exists()) {
    const meetData = meetSnap.data();
    const participants = meetData.participants || [];
    
    if (!participants.includes(phoneNumber)) {
      await updateDoc(meetRef, {
        participants: [...participants, phoneNumber],
        updatedAt: new Date(),
      });
    }
  }
};

export const leaveMeet = async (meetId: string, phoneNumber: string): Promise<void> => {
  const meetRef = doc(firestore, COLLECTIONS.MEETS, meetId);
  const meetSnap = await getDoc(meetRef);
  
  if (meetSnap.exists()) {
    const meetData = meetSnap.data();
    const participants = meetData.participants || [];
    
    await updateDoc(meetRef, {
      participants: participants.filter((p: string) => p !== phoneNumber),
      updatedAt: new Date(),
    });
  }
};

export const getUserMeets = (
  phoneNumber: string, 
  callback: (meets: Meet[]) => void
): () => void => {
  const meetsRef = collection(firestore, COLLECTIONS.MEETS);
  const q = query(
    meetsRef,
    where('participants', 'array-contains', phoneNumber),
    orderBy('time', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const meets = snapshot.docs.map(doc => 
      convertDocData<Meet>({ id: doc.id, ...doc.data() })
    );
    callback(meets);
  });
};

export const getUpcomingMeets = (callback: (meets: Meet[]) => void): () => void => {
  const meetsRef = collection(firestore, COLLECTIONS.MEETS);
  const q = query(
    meetsRef,
    where('time', '>', new Date()),
    orderBy('time', 'asc'),
    limit(50)
  );
  
  return onSnapshot(q, (snapshot) => {
    const meets = snapshot.docs.map(doc => 
      convertDocData<Meet>({ id: doc.id, ...doc.data() })
    );
    callback(meets);
  });
};

// Conversation operations
export const createConversation = async (conversationData: CreateConversationData): Promise<string> => {
  const conversationsRef = collection(firestore, COLLECTIONS.CONVERSATIONS);
  const now = new Date();
  
  const conversationDoc = await addDoc(conversationsRef, {
    ...conversationData,
    updatedAt: now,
  });
  
  return conversationDoc.id;
};

export const getConversation = async (conversationId: string): Promise<Conversation | null> => {
  const conversationRef = doc(firestore, COLLECTIONS.CONVERSATIONS, conversationId);
  const conversationSnap = await getDoc(conversationRef);
  
  if (conversationSnap.exists()) {
    return convertDocData<Conversation>({ id: conversationSnap.id, ...conversationSnap.data() });
  }
  
  return null;
};

export const getUserConversations = (
  phoneNumber: string,
  callback: (conversations: Conversation[]) => void
): () => void => {
  const conversationsRef = collection(firestore, COLLECTIONS.CONVERSATIONS);
  const q = query(
    conversationsRef,
    where('participants', 'array-contains', phoneNumber),
    orderBy('updatedAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const conversations = snapshot.docs.map(doc => 
      convertDocData<Conversation>({ id: doc.id, ...doc.data() })
    );
    callback(conversations);
  });
};

// Message operations
export const sendMessage = async (
  conversationId: string,
  messageData: CreateMessageData
): Promise<string> => {
  const messagesRef = collection(firestore, COLLECTIONS.CONVERSATIONS, conversationId, COLLECTIONS.MESSAGES);
  const now = new Date();
  
  const messageDoc = await addDoc(messagesRef, {
    ...messageData,
    timestamp: now,
  });
  
  // Update conversation's last message and timestamp
  const conversationRef = doc(firestore, COLLECTIONS.CONVERSATIONS, conversationId);
  await updateDoc(conversationRef, {
    lastMessage: {
      id: messageDoc.id,
      ...messageData,
      timestamp: now,
    },
    updatedAt: now,
  });
  
  return messageDoc.id;
};

export const getConversationMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void
): () => void => {
  const messagesRef = collection(firestore, COLLECTIONS.CONVERSATIONS, conversationId, COLLECTIONS.MESSAGES);
  const q = query(
    messagesRef,
    orderBy('timestamp', 'asc'),
    limit(100)
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => 
      convertDocData<Message>({ id: doc.id, ...doc.data() })
    );
    callback(messages);
  });
};

// Group operations
export const createGroup = async (groupData: CreateGroupData, createdBy: string): Promise<string> => {
  const groupsRef = collection(firestore, COLLECTIONS.GROUPS);
  const now = new Date();
  
  const groupDoc = await addDoc(groupsRef, {
    ...groupData,
    members: [createdBy],
    admins: [createdBy],
    createdAt: now,
    updatedAt: now,
  });
  
  return groupDoc.id;
};

export const getGroup = async (groupId: string): Promise<Group | null> => {
  const groupRef = doc(firestore, COLLECTIONS.GROUPS, groupId);
  const groupSnap = await getDoc(groupRef);
  
  if (groupSnap.exists()) {
    return convertDocData<Group>({ id: groupSnap.id, ...groupSnap.data() });
  }
  
  return null;
};

export const updateGroup = async (groupId: string, groupData: UpdateGroupData): Promise<void> => {
  const groupRef = doc(firestore, COLLECTIONS.GROUPS, groupId);
  
  await updateDoc(groupRef, {
    ...groupData,
    updatedAt: new Date(),
  });
};

export const deleteGroup = async (groupId: string): Promise<void> => {
  const groupRef = doc(firestore, COLLECTIONS.GROUPS, groupId);
  await deleteDoc(groupRef);
};

export const joinGroup = async (groupId: string, phoneNumber: string): Promise<void> => {
  const groupRef = doc(firestore, COLLECTIONS.GROUPS, groupId);
  const groupSnap = await getDoc(groupRef);
  
  if (groupSnap.exists()) {
    const groupData = groupSnap.data();
    const members = groupData.members || [];
    
    if (!members.includes(phoneNumber)) {
      await updateDoc(groupRef, {
        members: [...members, phoneNumber],
        updatedAt: new Date(),
      });
    }
  }
};

export const leaveGroup = async (groupId: string, phoneNumber: string): Promise<void> => {
  const groupRef = doc(firestore, COLLECTIONS.GROUPS, groupId);
  const groupSnap = await getDoc(groupRef);
  
  if (groupSnap.exists()) {
    const groupData = groupSnap.data();
    const members = groupData.members || [];
    
    await updateDoc(groupRef, {
      members: members.filter((m: string) => m !== phoneNumber),
      updatedAt: new Date(),
    });
  }
};

export const getUserGroups = (
  phoneNumber: string,
  callback: (groups: Group[]) => void
): () => void => {
  const groupsRef = collection(firestore, COLLECTIONS.GROUPS);
  const q = query(
    groupsRef,
    where('members', 'array-contains', phoneNumber),
    orderBy('updatedAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const groups = snapshot.docs.map(doc => 
      convertDocData<Group>({ id: doc.id, ...doc.data() })
    );
    callback(groups);
  });
};