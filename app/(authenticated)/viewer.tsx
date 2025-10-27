import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import { useMode } from '@/contexts/ModeContext';
// import { Button } from '@/components/common/Button';

export default function ViewerScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { mode, clearMode } = useMode();

  const handleLogout = async () => {
    await logout();
    await clearMode();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.title}>GLBビューア画面</Text>
        <Text style={styles.subtitle}>モード: {mode}</Text>
        <Text style={styles.text}>ここにGLBビューアが表示されます</Text>
        
        <View style={styles.buttonContainer}>
          {/* <Button title="ログアウト" onPress={handleLogout} variant="outline" /> */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 40,
  },
  text: {
    fontSize: 17,
    color: '#666',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
});
