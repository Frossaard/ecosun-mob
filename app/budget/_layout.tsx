import { Stack } from 'expo-router';

export default function BudgetLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="config/index" />
      <Stack.Screen name="config/sobre-nos" />
      <Stack.Screen name="config/energia-renovavel" />
      <Stack.Screen name="config/minha-conta" />
    </Stack>
  );
}

