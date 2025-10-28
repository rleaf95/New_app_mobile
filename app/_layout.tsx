import { Stack } from 'expo-router';
import { ModeProvider } from '../contexts/ModeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { useFonts, OpenSans_400Regular, OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

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
