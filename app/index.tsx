import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useMode } from '@/contexts/ModeContext';
import { SimpleBackground } from '@/components/viewer/SimpleBackground';
import { Background3D } from '@/components/viewer/Background3D';
import { FloatingBoard } from '@/components/common/FloatingBoard';
import { FloatingGLB } from '@/components/viewer/FloatingGLB';
import { ModeCard } from '@/components/common/ModeCard';
import { AppText } from '@/components/common/AppText';
import { AppMode } from '@/types/mode';
import { responsive, moderateScale } from '@/utils/responsive';

const CUSTOM_GLB_URL = 'https://raw.githubusercontent.com/rleaf95/New_app_mobile/main/assets/models/Robot.glb';

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

  const glbConfig = responsive.valueByMode({
    'phone-portrait': {
      size: 180,
      position: 'bottom-right' as const,
    },
    'tablet-landscape': {
      size: 300,
      position: 'bottom-right' as const,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* 1. 最背面：シンプルなグラデーション背景 */}
      <SimpleBackground />
      
      {/* 2. その上：透明な3Dオブジェクト（浮遊する図形） */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Background3D />
      </View>
      
      {/* 3. さらに上：浮遊するメインボード */}
      <FloatingBoard>
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
      </FloatingBoard>

      {/* 4. 最前面：浮遊するGLBキャラクター */}
      <FloatingGLB 
        modelUrl={CUSTOM_GLB_URL}
        size={glbConfig.size}
        position={glbConfig.position}
        modelYOffset={0.1}
        cameraPosition={[0, 0.1, 2.5]}
        cameraLookAt={[0, 0.3, 0]}
        ambientLightIntensity={1.5}
        directionalLightIntensity={1.2}
        frontLightIntensity={2.0}
        fillLightIntensity={0.8}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8C8D4', // フォールバック色
  },
  cardsContainer: {
    flexDirection: responsive.value('column', 'row'),
    justifyContent: 'space-between',
    gap: responsive.value(20, 40),
    marginBottom: responsive.value(30, 40),
  },
  posSetup: {
    alignItems: 'center',
    paddingVertical: moderateScale(12),
  },
  posText: {
    color: '#4A5568',
    fontSize: moderateScale(16),
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
