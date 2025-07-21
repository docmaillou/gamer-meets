name: "Gamer Meets WebApp - Complete Implementation"
description: |

## Purpose
Build a complete social gaming meetup app using React Native Expo with TypeScript, featuring phone authentication, real-time messaging, and gaming meetup coordination. The app follows a modular architecture optimized for team handoff.

## Core Principles
1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Follow all rules in CLAUDE.md

---

## Goal
Create a production-ready React Native Expo app where gamers can connect, organize meets, chat, and form groups. The app uses phone authentication exclusively and Firebase for backend services. The UI should be clean, modern, and have a persistent footer navigation. The app must support both French and English languages, with French as the default.

## Why
- **Business value**: Connects gamers based on interests and play styles
- **Integration**: Seamless Firebase integration for real-time features
- **Problems solved**: Difficulty finding like-minded gamers for online/in-person meetups

## What
A mobile-first application with:
- Phone number authentication (only login method)
- Light onboarding flow for profile setup
- Meet creation and joining system
- Real-time messaging (1-on-1 and group)
- User groups/communities
- Profile management
- Persistent footer navigation

### Success Criteria
- [ ] App runs on iOS, Android, and web platforms
- [ ] Phone authentication works smoothly
- [ ] Onboarding flow captures user preferences
- [ ] Users can create/join meets
- [ ] Real-time chat functionality works
- [ ] All screens accessible via footer navigation
- [ ] Clean, modern UI without emojis
- [ ] French and English languages supported (French default)
- [ ] Language switcher in settings works
- [ ] All tests pass and code meets quality standards

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://docs.expo.dev/router/advanced/tabs/
  why: Tab navigation implementation patterns
  
- url: https://docs.expo.dev/guides/using-firebase/
  why: Firebase integration with Expo
  
- url: https://rnfirebase.io/auth/phone-auth
  why: Phone authentication implementation
  
- url: https://firebase.google.com/docs/firestore/manage-data/add-data
  why: Firestore data structure and real-time updates
  
- url: https://reactnavigation.org/docs/typescript/
  why: TypeScript patterns for navigation
  
- url: https://react-hook-form.com/get-started
  why: Form validation for onboarding flow

- url: https://medium.com/@mmusaib/setting-up-firebase-authentication-in-react-native-expo-2024-25-235a1258b53d
  why: Modern Firebase Auth setup patterns

- url: https://reactnative.dev/
  why: Core React Native documentation
  
- url: https://react.i18next.com/latest/using-with-hooks
  why: i18n implementation with React hooks
  
- url: https://www.i18next.com/overview/getting-started
  why: i18next core concepts and configuration
  
- docfile: CLAUDE.md
  why: Project-specific rules and conventions
```

### Current Codebase tree
```bash
.
├── CLAUDE.md
├── INITIAL.md
├── LICENSE
├── PRPs/
│   ├── EXAMPLE_multi_agent_prp.md
│   └── templates/
│       └── prp_base.md
└── README.md
```

### Desired Codebase tree with files to be added
```bash
.
├── app/                          # Expo Router app directory
│   ├── _layout.tsx              # Root layout with auth check
│   ├── (auth)/                  # Auth stack (before login)
│   │   ├── _layout.tsx          # Auth layout
│   │   ├── index.tsx            # Phone login screen
│   │   └── verify.tsx           # OTP verification screen
│   ├── (onboarding)/            # Onboarding flow
│   │   ├── _layout.tsx          # Onboarding layout
│   │   ├── gamer-type.tsx       # Step 1: Choose gamer type
│   │   ├── favorite-games.tsx   # Step 2: Select games
│   │   ├── meet-preference.tsx  # Step 3: Meet preference
│   │   ├── bio.tsx              # Step 4: Bio
│   │   └── avatar.tsx           # Step 5: Avatar (optional)
│   └── (tabs)/                  # Main app tabs
│       ├── _layout.tsx          # Tab navigator
│       ├── index.tsx            # Meets screen (default)
│       ├── meeting/[id].tsx     # Meeting detail page
│       ├── conversations.tsx    # Conversations list
│       ├── groups.tsx           # Groups list
│       └── profile.tsx          # Profile & settings
├── components/                   # Reusable components
│   ├── ui/                      # UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Avatar.tsx
│   ├── forms/                   # Form components
│   │   ├── PhoneInput.tsx
│   │   ├── OTPInput.tsx
│   │   └── MultiSelect.tsx
│   ├── meet/                    # Meet-related components
│   │   ├── MeetCard.tsx
│   │   ├── MeetList.tsx
│   │   └── CreateMeetModal.tsx
│   └── chat/                    # Chat components
│       ├── MessageBubble.tsx
│       ├── MessageList.tsx
│       └── ChatInput.tsx
├── services/                    # External services
│   ├── firebase.ts             # Firebase initialization
│   ├── auth.ts                 # Auth service
│   ├── firestore.ts            # Firestore operations
│   ├── storage.ts              # Firebase Storage
│   └── i18n.ts                 # i18n configuration
├── hooks/                      # Custom hooks
│   ├── useAuth.ts              # Auth state hook
│   ├── useFirestoreDoc.ts      # Document subscription
│   ├── useFirestoreCollection.ts # Collection subscription
│   ├── useOnboarding.ts        # Onboarding state
│   └── useTranslation.ts       # i18n hook wrapper
├── types/                      # TypeScript types
│   ├── user.ts                 # User types
│   ├── meet.ts                 # Meet types
│   ├── conversation.ts         # Chat types
│   └── group.ts                # Group types
├── utils/                      # Utility functions
│   ├── validation.ts           # Form validation
│   ├── formatting.ts           # Date/text formatting
│   └── constants.ts            # App constants
├── context/                    # React contexts
│   ├── AuthContext.tsx         # Auth provider
│   ├── ThemeContext.tsx        # Theme provider
│   └── LanguageContext.tsx     # Language/i18n provider
├── translations/               # i18n translation files
│   ├── fr/                     # French translations
│   │   ├── common.json         # Common UI strings
│   │   ├── auth.json           # Authentication strings
│   │   ├── onboarding.json     # Onboarding strings
│   │   ├── meets.json          # Meets feature strings
│   │   ├── chat.json           # Chat strings
│   │   └── profile.json        # Profile strings
│   ├── en/                     # English translations
│   │   ├── common.json         # Common UI strings
│   │   ├── auth.json           # Authentication strings
│   │   ├── onboarding.json     # Onboarding strings
│   │   ├── meets.json          # Meets feature strings
│   │   ├── chat.json           # Chat strings
│   │   └── profile.json        # Profile strings
│   └── index.ts                # Translation resources export
├── __tests__/                  # Test files
│   ├── screens/                # Screen tests
│   ├── components/             # Component tests
│   └── services/               # Service tests
├── app.json                    # Expo config
├── package.json                # Dependencies
├── tsconfig.json              # TypeScript config
├── .env.example               # Environment variables
├── firebase.json              # Firebase config
└── eas.json                   # EAS Build config
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Firebase JS SDK for Expo Go compatibility
// CRITICAL: Phone auth requires reCAPTCHA setup for web
// CRITICAL: Expo Router file-based, (tabs) loads before (zShared)
// CRITICAL: TypeScript strict mode - no any types allowed
// CRITICAL: React Native doesn't support all CSS - use StyleSheet
// CRITICAL: AsyncStorage for persistence, not localStorage
// CRITICAL: Firebase Auth persistence handled automatically
// CRITICAL: Firestore real-time listeners need cleanup
// CRITICAL: No emojis anywhere in the app per requirements
// CRITICAL: i18n - French is default language, load before app renders
// CRITICAL: Date/time formatting must respect user's locale
// CRITICAL: All user-facing strings must be translatable
```

## Implementation Blueprint

### Data models and structure

```typescript
// types/user.ts
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

// types/meet.ts
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

// types/conversation.ts
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

// types/group.ts
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
```

### List of tasks to be completed

```yaml
Task 1: Initialize Expo project with TypeScript
CREATE package.json, tsconfig.json, app.json:
  - Use latest Expo SDK (53+)
  - Configure TypeScript strict mode
  - Setup path aliases for cleaner imports

Task 2: Setup i18n configuration
CREATE services/i18n.ts:
  - Initialize i18next with React Native
  - Configure French as default language
  - Setup language detection from AsyncStorage
  - Configure lazy loading for translations

CREATE translations/:
  - French and English translation files
  - Organized by feature/screen
  - Common UI strings separated

CREATE hooks/useTranslation.ts:
  - Wrapper around react-i18next hook
  - Type-safe translation keys

Task 3: Setup Firebase configuration
CREATE services/firebase.ts:
  - Initialize Firebase app with config
  - Export auth and firestore instances
  - Setup Firebase JS SDK for Expo Go

CREATE .env.example:
  - Firebase configuration keys
  - Never commit actual .env file

Task 4: Implement authentication service
CREATE services/auth.ts:
  - Phone number sign in with reCAPTCHA
  - OTP verification
  - Auth state persistence
  - Sign out functionality

CREATE hooks/useAuth.ts:
  - Auth state subscription
  - Current user data
  - Loading states

CREATE context/AuthContext.tsx:
  - Wrap app with auth provider
  - Handle auth state changes

Task 5: Create navigation structure
CREATE app/_layout.tsx:
  - Root layout with auth check
  - Initialize i18n before app renders
  - Redirect logic based on auth state
  - Global providers setup (Auth, Theme, Language)

CREATE app/(auth)/_layout.tsx:
  - Stack navigator for auth screens
  - No header display

CREATE app/(tabs)/_layout.tsx:
  - Bottom tab navigator
  - 5 tabs as specified
  - Custom tab bar styling

Task 6: Build authentication screens
CREATE app/(auth)/index.tsx:
  - Phone number input
  - Country code selector
  - Validation and formatting

CREATE app/(auth)/verify.tsx:
  - OTP input component
  - Auto-focus between inputs
  - Resend OTP functionality

Task 7: Implement onboarding flow
CREATE hooks/useOnboarding.ts:
  - Multi-step form state
  - Progress tracking
  - Data persistence

CREATE app/(onboarding)/ screens:
  - Each step as separate screen
  - Form validation with react-hook-form
  - Progress indicator component
  - Skip functionality for optional steps

Task 8: Create main app screens
CREATE app/(tabs)/index.tsx (Meets):
  - List upcoming/ongoing meets
  - Filter and search functionality
  - Create meet button/modal

CREATE app/(tabs)/meeting/[id].tsx:
  - Dynamic route for meet details
  - Join/leave functionality
  - Participant list display

CREATE app/(tabs)/conversations.tsx:
  - Conversation list with last message
  - Real-time updates
  - Navigation to chat screen

CREATE app/(tabs)/groups.tsx:
  - Group list display
  - Create group functionality
  - Member count display

CREATE app/(tabs)/profile.tsx:
  - User profile display
  - Edit functionality
  - Settings section with language switcher
  - Language preference (French/English)

Task 9: Build Firestore services
CREATE services/firestore.ts:
  - CRUD operations for each collection
  - Real-time subscription helpers
  - Batch operations for efficiency
  - Error handling and retries

Task 10: Implement real-time chat
CREATE components/chat/:
  - Message bubble with sender info
  - Auto-scroll to bottom
  - Typing indicators (optional)
  - Message status (sent/delivered/read)

Task 11: Create reusable UI components
CREATE components/ui/:
  - Consistent styling system
  - Theme-aware components
  - Accessibility support
  - Loading and error states

Task 12: Add comprehensive tests
CREATE __tests__/:
  - Screen navigation tests
  - Component render tests
  - Service method tests
  - Firebase mock setup

Task 13: Configure build and deployment
CREATE eas.json:
  - Development and production builds
  - Environment variable handling
  - Platform-specific configs
```

### Per task pseudocode

```typescript
// Task 2: i18n Configuration
// services/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorageBackend from 'i18next-async-storage-backend';
import * as Localization from 'expo-localization';

import fr from '../translations/fr';
import en from '../translations/en';

export const initI18n = async () => {
  // PATTERN: Get device locale but default to French
  const deviceLocale = Localization.locale;
  const defaultLanguage = deviceLocale.startsWith('en') ? 'en' : 'fr';
  
  await i18n
    .use(AsyncStorageBackend)
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3', // CRITICAL: For React Native
      resources: {
        fr: { translation: fr },
        en: { translation: en }
      },
      lng: 'fr', // CRITICAL: French as default
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false // React already escapes
      },
      react: {
        useSuspense: false // CRITICAL: For React Native
      }
    });
    
  // PATTERN: Load saved language preference
  const savedLang = await AsyncStorage.getItem('user_language');
  if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
    await i18n.changeLanguage(savedLang);
  }
};

// context/LanguageContext.tsx
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ 
  children 
}) => {
  const { i18n } = useTranslation();
  
  const changeLanguage = async (lang: 'fr' | 'en') => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('user_language', lang);
    
    // CRITICAL: Update user profile in Firestore
    if (auth.currentUser) {
      await updateDoc(doc(firestore, 'users', auth.currentUser.uid), {
        language: lang
      });
    }
  };
  
  return (
    <LanguageContext.Provider value={{ changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// translations/fr/auth.json
{
  "phoneLogin": {
    "title": "Connexion",
    "subtitle": "Entrez votre numéro de téléphone",
    "phoneLabel": "Numéro de téléphone",
    "countryCode": "Code pays",
    "continue": "Continuer",
    "invalidPhone": "Numéro de téléphone invalide"
  },
  "verification": {
    "title": "Vérification",
    "subtitle": "Entrez le code reçu par SMS",
    "resend": "Renvoyer le code",
    "verify": "Vérifier",
    "invalidCode": "Code invalide"
  }
}

// translations/en/auth.json
{
  "phoneLogin": {
    "title": "Login",
    "subtitle": "Enter your phone number",
    "phoneLabel": "Phone number",
    "countryCode": "Country code",
    "continue": "Continue",
    "invalidPhone": "Invalid phone number"
  },
  "verification": {
    "title": "Verification",
    "subtitle": "Enter the code received by SMS",
    "resend": "Resend code",
    "verify": "Verify",
    "invalidCode": "Invalid code"
  }
}

// Task 4: Authentication Service
// services/auth.ts
import { auth } from './firebase';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  ConfirmationResult 
} from 'firebase/auth';

class AuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private confirmationResult: ConfirmationResult | null = null;

  async initializeRecaptcha(containerOrButton: string | HTMLElement) {
    // PATTERN: Setup invisible reCAPTCHA for better UX
    this.recaptchaVerifier = new RecaptchaVerifier(
      containerOrButton,
      {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      },
      auth
    );
  }

  async signInWithPhone(phoneNumber: string) {
    // CRITICAL: Format phone number with country code
    const formattedNumber = this.formatPhoneNumber(phoneNumber);
    
    // PATTERN: Store confirmation result for OTP verification
    this.confirmationResult = await signInWithPhoneNumber(
      auth,
      formattedNumber,
      this.recaptchaVerifier!
    );
    
    return this.confirmationResult;
  }

  async verifyOTP(otp: string) {
    // PATTERN: Use stored confirmation result
    if (!this.confirmationResult) {
      throw new Error('No confirmation result available');
    }
    
    const userCredential = await this.confirmationResult.confirm(otp);
    
    // CRITICAL: Create/update user document after successful auth
    await this.createUserDocument(userCredential.user);
    
    return userCredential;
  }
}

// Task 6: Multi-step Onboarding
// hooks/useOnboarding.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOnboarding = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<User>>({});

  const nextStep = async (stepData: any) => {
    // PATTERN: Merge step data
    const newData = { ...formData, ...stepData };
    setFormData(newData);
    
    // PATTERN: Persist to AsyncStorage for recovery
    await AsyncStorage.setItem(
      'onboarding_progress',
      JSON.stringify({ step: currentStep + 1, data: newData })
    );
    
    // PATTERN: Navigate to next step or complete
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      router.push(`/(onboarding)/${getStepRoute(currentStep + 1)}`);
    } else {
      await completeOnboarding(newData);
    }
  };

  const completeOnboarding = async (data: Partial<User>) => {
    // CRITICAL: Save to Firestore
    await createUserProfile(data);
    
    // PATTERN: Clear onboarding state
    await AsyncStorage.removeItem('onboarding_progress');
    
    // PATTERN: Navigate to main app
    router.replace('/(tabs)');
  };
};

// Task 9: Real-time Chat Implementation
// components/chat/MessageList.tsx
export const MessageList: React.FC<{ conversationId: string }> = ({ 
  conversationId 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    // PATTERN: Real-time Firestore subscription
    const messagesRef = collection(
      firestore, 
      `conversations/${conversationId}/messages`
    );
    
    const q = query(
      messagesRef, 
      orderBy('timestamp', 'asc'),
      limit(50) // CRITICAL: Limit for performance
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      
      setMessages(newMessages);
      
      // PATTERN: Auto-scroll to bottom
      scrollToBottom();
    });
    
    // CRITICAL: Cleanup subscription
    return () => unsubscribe();
  }, [conversationId]);
};
```

### Integration Points
```yaml
ENVIRONMENT:
  - add to: .env
  - vars: |
      # Firebase Configuration
      EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
      EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
      EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
      
CONFIG:
  - Firebase: Enable phone authentication in console
  - Firestore: Create indexes for compound queries
  - Storage: Setup CORS for avatar uploads
  
DEPENDENCIES:
  - Core dependencies in package.json:
    - expo@~53.0.0
    - react-native@0.76.6
    - expo-router@~4.0.0
    - firebase@^11.2.0
    - react-hook-form@^7.54.2
    - @react-native-async-storage/async-storage
    - expo-image-picker (for avatars)
    - i18next@^23.16.8
    - react-i18next@^13.5.0
    - i18next-async-storage-backend@^4.0.1
    - expo-localization@~15.0.0
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# TypeScript and linting checks
npx tsc --noEmit              # Type checking
npx eslint . --fix             # ESLint with auto-fix

# Expected: No errors. If errors, fix them.
```

### Level 2: Unit Tests
```javascript
// __tests__/services/auth.test.ts
describe('AuthService', () => {
  it('should format phone numbers correctly', () => {
    const service = new AuthService();
    expect(service.formatPhoneNumber('1234567890')).toBe('+11234567890');
  });

  it('should handle sign in errors', async () => {
    const service = new AuthService();
    await expect(
      service.signInWithPhone('invalid')
    ).rejects.toThrow();
  });
});

// __tests__/screens/Onboarding.test.tsx
describe('Onboarding Flow', () => {
  it('should navigate through all steps', async () => {
    const { getByText, getByPlaceholder } = render(<OnboardingFlow />);
    
    // Step 1: Gamer Type
    fireEvent.press(getByText('Casual'));
    fireEvent.press(getByText('Next'));
    
    // Verify navigation
    await waitFor(() => {
      expect(getByText('Select your favorite games')).toBeTruthy();
    });
  });
});
```

```bash
# Run tests
npm test -- --coverage

# Expected: All tests pass with >80% coverage
```

### Level 3: Integration Test
```bash
# Start Expo development server
npx expo start

# Test on different platforms:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator  
# - Press 'w' for web browser

# Manual test checklist:
# 1. Phone auth flow works
# 2. Onboarding saves data
# 3. Navigation between tabs works
# 4. Real-time chat updates
# 5. Meet creation/joining works
```

## Final Validation Checklist
- [ ] All TypeScript errors resolved: `npx tsc --noEmit`
- [ ] Linting passes: `npx eslint .`
- [ ] All tests pass: `npm test`
- [ ] App runs on iOS simulator
- [ ] App runs on Android emulator
- [ ] App runs in web browser
- [ ] Phone authentication works (with test number)
- [ ] Firestore security rules configured
- [ ] No console errors or warnings
- [ ] Performance is smooth (60 FPS)
- [ ] Accessibility features work
- [ ] No emojis appear anywhere in the app
- [ ] French language displays by default
- [ ] Language switcher works correctly
- [ ] All UI strings are properly translated
- [ ] Date/time formatting respects locale

---

## Anti-Patterns to Avoid
- ❌ Don't use localStorage - use AsyncStorage
- ❌ Don't hardcode Firebase config - use environment variables
- ❌ Don't forget to clean up Firestore listeners
- ❌ Don't use synchronous operations in async contexts
- ❌ Don't create large components - keep them modular
- ❌ Don't skip TypeScript types - be explicit
- ❌ Don't use default exports - use named exports
- ❌ Don't add emojis to the UI - requirement states none
- ❌ Don't forget to handle offline states
- ❌ Don't expose sensitive data in client code
- ❌ Don't hardcode strings - use translation keys
- ❌ Don't forget to translate error messages
- ❌ Don't use English as default - French is required
- ❌ Don't mix languages in the UI

## Confidence Score: 9/10

High confidence due to:
- Clear requirements and specifications
- Well-documented React Native and Firebase APIs
- Established patterns for navigation and forms
- Comprehensive validation gates

Minor uncertainty on:
- Exact Firebase phone auth implementation for all regions
- Performance optimization for large chat histories
- Complete translation coverage for all edge cases

The implementation follows modern React Native best practices with Expo Router, TypeScript, Firebase integration, and i18n support proven in production applications.