import { Stack } from 'expo-router';
import { ModeProvider } from '../contexts/ModeContext';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <ModeProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(authenticated)" />
        </Stack>
      </AuthProvider>
    </ModeProvider>
  );
}
