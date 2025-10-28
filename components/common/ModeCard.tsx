import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { AppText } from './AppText';
import { responsive } from '../../utils/responsive';
import { BlurView } from 'expo-blur';


interface ModeCardProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function ModeCard({ title, onPress, style }: ModeCardProps) {
  const isWebPlatform = Platform.OS === 'web';
  
  const cardStyle = isWebPlatform ? {
    height: 180,
    width: 270,
  } : responsive.valueByMode({
    'phone-portrait': {
      width: '100%' as any,
      minHeight: 120,
    },
    'tablet-landscape': {
      height: 180,
      width: 270,
    },
  });

  return (
    <View style={[cardStyle, style]}>
      {/* カードの影 */}
      <View style={styles.cardShadow}>
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.03)',
            'rgba(0, 0, 0, 0.03)',
            'rgba(0, 0, 0, 0)',
          ]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 0 }}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.cardContainer}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.borderContainer}>
          <BlurView 
            intensity={Platform.OS === 'web' ? 30 : 25}
            tint="light"
            style={StyleSheet.absoluteFillObject}
          />
          {/* カード本体（先に配置） */}
          <View style={styles.cardInner}>
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.56)',
                'rgba(255, 255, 255, 0)',
              ]}
              locations={[0, 0.5]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              {/* 上部のハイライト */}
              <LinearGradient
                colors={[
                  'rgba(255, 255, 255, 0.46)',
                  'rgba(255, 255, 255, 0)',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.2 }}
                style={styles.glassHighlight}
              />
              
              {/* テキスト */}
              <View style={styles.cardContent}>
                <AppText variant="subtitle" weight="semibold" style={styles.cardTitle}>
                  {title}
                </AppText>
              </View>
            </LinearGradient>
          </View>
          
          {/* SVGの枠線（最前面、塗りつぶしなし） */}
          <Svg 
            width="100%" 
            height="100%" 
            style={[StyleSheet.absoluteFillObject, { zIndex: 10 }]}
          >
            <Defs>
              <RadialGradient 
                id="borderGradient" 
                cx="60%" 
                cy="70%" 
                r="80%"
              >
                <Stop offset="0%" stopColor="#276973" stopOpacity="0.50" />
                <Stop offset="30%" stopColor="#4f93c1" stopOpacity="0.50" />
                <Stop offset="60%" stopColor="#8DB4BE" stopOpacity="0.50" />
                <Stop offset="100%" stopColor="#d8f3f9" stopOpacity="0.50" />
              </RadialGradient>
            </Defs>
            {/* 塗りつぶしではなく、枠線だけ */}
            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="none"
              stroke="url(#borderGradient)"
              strokeWidth="5"
              rx="20"
            />
          </Svg>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    position: 'absolute',
    top: '3%',
    left: '8%',
    right: '-3%',
    height: 185,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardContainer: {
    width: '100%',
    height: '100%',
  },
  borderContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  cardInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '20%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cardTitle: {
    color: '#2D3748',
    textAlign: 'center',
  },
});
