
import { AuthGate, AuthProvider } from '@/lib/auth';
import { SettingsMenuProvider } from '@/lib/settings-menu';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(app)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsMenuProvider>
        <AuthGate />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="cadastro" />
          <Stack.Screen name="(app)" />
        </Stack>
        <StatusBar style="dark" />
      </SettingsMenuProvider>
    </AuthProvider>
  );
}
