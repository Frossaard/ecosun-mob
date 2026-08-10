
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(app)',
};

/**
 * O app é forçado ao tema claro (DefaultTheme) para manter um layout claro e
 * consistente, eliminando qualquer fundo escuro ao redor dos inputs/cards.
 */
const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F7F8FA',
    card: '#FFFFFF',
    text: '#111827',
    border: '#E5E7EB',
    primary: '#rgb(6, 79, 104)',
  },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <ThemeProvider value={LightTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(app)" />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
