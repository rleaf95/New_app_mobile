import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from './AppText';
import { responsive, moderateScale } from '@/utils/responsive';

interface ModeCardProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function ModeCard({ title, onPress, style }: ModeCardProps) {
  const cardStyle = responsive.valueByMode({
    'phone-portrait': {
      flex: 0,
      minHeight: 120,
    },
    'tablet-landscape': {
      flex: 1,
      Height: 185,
      Width: 100,
    },
  });

  return (
    <TouchableOpacity 
      style={[styles.cardContainer, cardStyle, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* 影レイヤー */}
      {/* <View style={styles.cardShadow} /> */}
      
      {/* ガラスカード本体 */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.25)',
          'rgba(255, 255, 255, 0.15)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.card}
      >
        {/* ガラス反射効果（上部のハイライト） */}
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.4)',
            'rgba(255, 255, 255, 0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.3 }}
          style={styles.glassHighlight}
        />
        
        {/* 枠線 */}
        <View style={styles.cardBorder} />
        
        {/* コンテンツ */}
        <View style={styles.cardContent}>
          <AppText variant="body" weight="regular" style={styles.cardTitle}>
            {title}
          </AppText>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
  },
  cardShadow: {
    position: 'absolute',
    top: 8,
    left: 4,
    right: 4,
    bottom: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: moderateScale(20),
    // ぼかし効果（iOSのみ）
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    // Android用
    elevation: 8,
  },
  card: {
    borderRadius: moderateScale(20),
    padding: moderateScale(32),
    overflow: 'hidden',
    position: 'relative',
    // カード自体の影
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  cardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: moderateScale(100),
  },
  cardTitle: {
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
    fontSize: moderateScale(20),
  },
});