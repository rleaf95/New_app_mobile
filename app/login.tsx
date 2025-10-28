import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMode } from '@/contexts/ModeContext';
import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/common/Button';
import { MODE_INFO } from '@/types/mode';
import { isWeb } from '@/utils/responsive';

export default function LoginScreen() {
  const router = useRouter();
  const { mode, clearMode } = useMode();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isWeb() && mode === 'pos') {
      Alert.alert('エラー', 'POSモードはWebでは利用できません');
      clearMode();
      router.replace('/');
    }
  }, [mode]);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('エラー', 'ユーザー名とパスワードを入力してください');
      return;
    }

    if (!mode) {
      Alert.alert('エラー', 'モードが選択されていません');
      return;
    }

    if (isWeb() && mode === 'pos') {
      Alert.alert('エラー', 'POSモードはWebでは利用できません');
      return;
    }

    setLoading(true);
    try {
      await login({ username, password, mode });
      router.replace('/(authenticated)/viewer');
    } catch (error) {
      Alert.alert('ログイン失敗', 'ユーザー名またはパスワードが正しくありません');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async () => {
    await clearMode();
    router.back();
  };

  if (!mode || (isWeb() && mode === 'pos')) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>← 戻る</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>{MODE_INFO[mode].title}</Text>
          <Text style={styles.subtitle}>ログイン</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>ユーザー名</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="ユーザー名を入力"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>パスワード</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="パスワードを入力"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* <Button
            title="ログイン"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          /> */}
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
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 17,
    color: '#007AFF',
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: '#666',
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 17,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
});
