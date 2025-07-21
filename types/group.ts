export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[]; // phoneNumbers
  admins: string[]; // phoneNumbers
  tags?: string[];
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGroupData {
  name: string;
  description: string;
  tags?: string[];
  avatarUrl?: string;
}

export interface UpdateGroupData {
  name?: string;
  description?: string;
  tags?: string[];
  avatarUrl?: string;
}