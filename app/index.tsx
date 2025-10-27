import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useMode } from '../contexts/ModeContext';
// import { Background3D } from '../components/viewer/Background3D';  // 一時的にコメントアウト
import { ModeCard } from '../components/common/ModeCard';
import { AppText } from '../components/common/AppText';
import { AppMode } from '../types/mode';

export default function ModeSelectionScreen() {
  const router = useRouter();
  const { setMode } = useMode();

  const handleModeSelect = async (mode: AppMode) => {
    try {
      await setMode(mode);
      router.push('/login');
    } catch (error) {
      console.error('Failed to select mode:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* 3D背景を一時的にコメントアウト */}
      {/* <View style={StyleSheet.absoluteFillObject}>
        <Background3D />
      </View> */}
      
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.91)',
          'rgba(212, 222, 230, 0.27)',
          'rgba(97, 118, 138, 0)',
        ]}
        locations={[0.05, 0.30, 1.0]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      />
      
      <View style={styles.content}>
        <View style={styles.cardsContainer}>
          <ModeCard 
            title="Sign in as Staff"
            onPress={() => handleModeSelect('staff')}
          />
          <ModeCard 
            title="Sign in as Owner"
            onPress={() => handleModeSelect('owner')}
          />
        </View>
        <TouchableOpacity 
          style={styles.posSetup}
          onPress={() => handleModeSelect('pos')}
        >
          <AppText style={styles.posText}>POS Terminal Setup</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A5568',
  },
  content: {
    flex: 1,
    marginHorizontal: 40,  // margin: 200 は大きすぎるので調整
    marginVertical: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 20,  // 内側の余白を追加
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,  // 60から調整
    marginHorizontal: 20,  // 100から調整
    gap: 20,
  },
  posSetup: {
    alignItems: 'center',
    marginTop: 20,
  },
  posText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
