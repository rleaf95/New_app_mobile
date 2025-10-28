import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { responsive, moderateScale } from '../../utils/responsive';

interface FloatingBoardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function FloatingBoard({ children, style }: FloatingBoardProps) {

  const cardStyle = responsive.valueByMode({
    'phone-portrait': {
      minHeight: 120,
    },
    'tablet-landscape': {
      Height: 460,
      Width: 885,
    },
  });
  return (
    <View style={[styles.container, cardStyle, style]}>
      {/* 影レイヤー（ボードの下） */}
      {/* <View style={styles.boardShadow} /> */}
      
      {/* ボード本体 */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.35)',
          'rgba(255, 255, 255, 0.25)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.board}
      >
        {/* ガラス反射効果 */}
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.3)',
            'rgba(255, 255, 255, 0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.2 }}
          style={styles.glassHighlight}
        />
        
        {/* 枠線 */}
        <View style={styles.boardBorder} />
        
        {/* コンテンツ */}
        <View style={styles.content}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: responsive.value(20, 80),
    marginVertical: responsive.value(60, 100),
    position: 'relative',
  },
  boardShadow: {
    position: 'absolute',
    top: 12,
    left: 8,
    right: 8,
    bottom: -12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: moderateScale(24),
    // ぼかし効果
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  board: {
    flex: 1,
    borderRadius: moderateScale(24),
    padding: responsive.value(20, 40),
    overflow: 'hidden',
    position: 'relative',
    // ボード自体の影
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '20%',
  },
  boardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: moderateScale(24),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});