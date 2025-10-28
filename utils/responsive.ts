import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const isTablet = () => {
  if (Platform.OS === 'web') {
    return SCREEN_WIDTH >= 768;
  }
  const shortDimension = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);
  return shortDimension >= 600;
};

export const isLandscape = () => {
  return SCREEN_WIDTH > SCREEN_HEIGHT;
};

export const getDeviceMode = () => {
  const tablet = isTablet();
  const landscape = isLandscape();
  
  // Web用の判定を追加
  if (Platform.OS === 'web') {
    if (SCREEN_WIDTH >= 1024) return 'tablet-landscape';
    if (SCREEN_WIDTH >= 768) return 'tablet-portrait';
    return 'phone-portrait';
  }
  
  if (tablet && landscape) return 'tablet-landscape';
  if (tablet && !landscape) return 'tablet-portrait';
  if (!tablet && !landscape) return 'phone-portrait';
  return 'phone-landscape';
};

const BASE_WIDTH = 393;

export const scale = (size: number) => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

const BASE_HEIGHT = 852;

export const verticalScale = (size: number) => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

export const moderateScale = (size: number, factor: number = 0.5) => {
  return size + (scale(size) - size) * factor;
};

export const getScreenInfo = () => {
  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    isTablet: isTablet(),
    isLandscape: isLandscape(),
    deviceMode: getDeviceMode(),
  };
};

export const responsive = {
  value: <T,>(phonePortrait: T, tabletLandscape: T): T => {
    const mode = getDeviceMode();
    if (mode === 'tablet-landscape') return tabletLandscape;
    return phonePortrait;
  },
  
  valueByMode: <T,>(values: {
    'phone-portrait': T;
    'tablet-landscape': T;
    'phone-landscape'?: T;
    'tablet-portrait'?: T;
  }): T => {
    const mode = getDeviceMode();
    return values[mode] || values['phone-portrait'];
  },
};

export const isWeb = () => Platform.OS === 'web';
