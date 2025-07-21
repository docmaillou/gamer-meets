import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="gamer-type" />
      <Stack.Screen name="favorite-games" />
      <Stack.Screen name="meet-preference" />
      <Stack.Screen name="bio" />
      <Stack.Screen name="avatar" />
    </Stack>
  );
}