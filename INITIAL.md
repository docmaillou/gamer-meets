Feature: Onboarding Flow
Triggered on first login if no profile document exists

Light and fast user setup, with the following steps:

Choose gamer type: Casual / Competitive / Creator

Select favorite games (multi-select + freeform)

Choose meet type: Online / In-Person / Mixed

Write a short bio

Optional avatar upload

Data saved under:

json
Copier
Modifier
users/{phoneNumber}: {
  gamerType,
  games,
  meetType,
  bio,
  avatarUrl,
  createdAt
}
Feature: Meets
List of upcoming or ongoing meets

Meet creation: Title, Game, Description, Time, Type

Firestore structure:

json
Copier
Modifier
meets/{meetId}: {
  title,
  description,
  game,
  time,
  createdBy,
  participants[]
}
Feature: Meeting Page
View detailed info about a specific meet

Join/leave button

Participant list

Chat preview (optional future feature)

Feature: Conversations
Private 1-on-1 or group chat support

Realtime messaging via Firestore messages subcollections

Firestore structure:

json
Copier
Modifier
conversations/{id}: {
  participants[],
  lastMessage,
  updatedAt
}

conversations/{id}/messages/{messageId}: {
  senderId,
  text,
  timestamp
}
Feature: Groups
User-created groups with member list and description

Group details page with optional discussion

Firestore structure:

json
Copier
Modifier
groups/{groupId}: {
  name,
  description,
  members[]
}
Feature: Profile & Settings
User profile view and edit

Access to onboarding data

Settings include:

Update bio, games, meet preferences

Notification preferences (future)

Delete account (admin-managed)

Navigation Structure (Always Visible Footer)
Footer tab navigation (React Navigation) includes:

MeetsScreen

MeetingPageScreen

ConversationsScreen

GroupsScreen

ProfileScreen

Firebase Setup (Admin Side)
Firebase Console access gives full admin visibility

Collections:

users

meets

conversations + nested messages

groups

Easy to configure onboarding steps via onboardingSteps.ts schema

Admin can update schema, games list, group tags from dashboard (future feature)