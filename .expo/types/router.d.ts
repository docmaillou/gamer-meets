/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/` | `/(auth)/verify` | `/(onboarding)` | `/(onboarding)/avatar` | `/(onboarding)/bio` | `/(onboarding)/favorite-games` | `/(onboarding)/gamer-type` | `/(onboarding)/meet-preference` | `/(tabs)` | `/(tabs)/` | `/(tabs)/conversations` | `/(tabs)/groups` | `/(tabs)/profile` | `/(tabs)/settings` | `/_sitemap` | `/avatar` | `/bio` | `/conversations` | `/favorite-games` | `/gamer-type` | `/groups` | `/meet-preference` | `/meeting\[id]` | `/profile` | `/settings` | `/verify`;
      DynamicRoutes: `/(tabs)/meeting/${Router.SingleRoutePart<T>}` | `/meeting/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(tabs)/meeting/[id]` | `/meeting/[id]`;
    }
  }
}
