import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useMode } from '../contexts/ModeContext';
import { SimpleBackground } from '../components/viewer/SimpleBackground';
import { FloatingBoard } from '../components/common/FloatingBoard';
import { ModeCard } from '../components/common/ModeCard';
import { AppText } from '../components/common/AppText';
import { AppMode } from '../types/mode';
import { responsive, moderateScale, isWeb } from '../utils/responsive';

const CUSTOM_GLB_URL = 'https://raw.githubusercontent.com/rleaf95/New_app_mobile/main/assets/models/Robot.glb';

let Background3D: any = null;
let FloatingGLB: any = null;

if (!isWeb()) {
  Background3D = require('../components/viewer/Background3D').Background3D;
  FloatingGLB = require('../components/viewer/FloatingGLB').FloatingGLB;
}

export default function ModeSelectionScreen() {
  const router = useRouter();
  const { setMode } = useMode();

  const handleModeSelect = async (mode: AppMode) => {
    if (isWeb() && mode === 'pos') {
      console.warn('POS mode is not available on web');
      return;
    }
    
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
      size: 450,
      position: 'bottom-right' as const,
    },
  });

  return (
    <View style={[styles.container, isWeb() && webStyles.container as any]}>
      <StatusBar style="dark" />
      
      <SimpleBackground />
      
      {!isWeb() && Background3D && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <Background3D />
        </View>
      )}
      
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
        
        {!isWeb() && (
          <TouchableOpacity 
            style={styles.posSetup}
            onPress={() => handleModeSelect('pos')}
          >
            <AppText style={styles.posText}>POS Terminal Setup</AppText>
          </TouchableOpacity>
        )}
      </FloatingBoard>

      {!isWeb() && FloatingGLB && (
        <FloatingGLB 
          modelUrl={CUSTOM_GLB_URL}
          size={glbConfig.size}
          position={glbConfig.position}
          modelYOffset={0.1}
          cameraPosition={[0, 0, 2.5]}
          cameraLookAt={[0, 0, 0]}
          ambientLightIntensity={1.5}
          directionalLightIntensity={1.2}
          frontLightIntensity={2.0}
          fillLightIntensity={0.8}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8C8D4',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  posSetup: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  posText: {
    color: '#4A5568',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

const webStyles = {
  container: {
    minHeight: '100vh',
  },
};
