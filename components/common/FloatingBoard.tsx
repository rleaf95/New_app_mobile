import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { responsive, moderateScale } from '../../utils/responsive';

interface FloatingBoardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function FloatingBoard({ children, style }: FloatingBoardProps) {
  return (
    <View style={[
      styles.container,
      Platform.OS === 'web' && webStyles.container,
      style
    ]}>
      {/* 影レイヤー */}
      <View style={styles.boardShadow}>
        <LinearGradient
          colors={[
            'rgba(126, 126, 126, 0.05)',
            'rgba(0, 0, 0, 0.02)',
            'rgba(0, 0, 0, 0)',
          ]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 0 }}
        />
      </View>
      
      {/* 外側のボード（透過性10%） */}
      <View style={styles.boardOuter}>
        {/* 半透明の色 */}
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0)',
            'rgba(255, 255, 255, 0.05)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        
        {/* 外側の枠線 */}
        <View style={styles.borderOuter} />
        
        {/* 内側のボード（透過性50%、10px内側） */}
        <View style={styles.boardInner}>
          {/* 背景のぼかし効果 */}
          <BlurView 
            intensity={Platform.OS === 'web' ? 30 : 25}
            tint="light"
            style={StyleSheet.absoluteFillObject}
          />
          
          {/* 半透明の色 */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.51)',
              'rgba(255, 255, 255, 0)',
            ]}
            locations={[0, 0.2]}
            start={{ x: 0, y: 0.1 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          
          {/* 上部のハイライト */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.75)',
              'rgba(255, 255, 255, 0)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.15 }}
            style={styles.glassHighlight}
          />
          
          {/* 内側の枠線 */}
          <View style={styles.borderInner} />
          
          {/* コンテンツ */}
          <View style={styles.content}>
            {children}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: responsive.value(20, 155),
    marginVertical: responsive.value(60, 180),
    position: 'relative',
  },
  boardShadow: {
    position: 'absolute',
    top: '105%',
    left: '10%',
    right: '10%',
    height: 60,
    borderRadius: 1000,
    overflow: 'hidden',
  },
  boardOuter: {
    flex: 1,
    borderRadius: moderateScale(24),
    padding: 13,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 10,
  },
  borderOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: moderateScale(24),
    borderWidth: 1.5,
    borderColor: 'rgba(200, 210, 220, 0.3)',
    pointerEvents: 'none',
    zIndex: 10,
  },
  boardInner: {
    flex: 1,
    borderRadius: moderateScale(24) - 10,
    padding: responsive.value(20, 40),
    overflow: 'hidden',
    position: 'relative',
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '10%',
    borderTopLeftRadius: moderateScale(24) - 10,
    borderTopRightRadius: moderateScale(24) - 10,
    zIndex: 5,
  },
  borderInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: moderateScale(24) - 10,
    borderWidth: 1.5,
    borderColor: 'rgba(200, 210, 220, 0.5)',
    pointerEvents: 'none',
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    zIndex: 20,
  },
});

const webStyles = {
  container: {
    maxWidth: 1200,
    alignSelf: 'center' as const,
    margin: '180px 155px' as any,
  },
};
