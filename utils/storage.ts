import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppMode } from '../types/mode';

const KEYS = {
  MODE: '@app_mode',
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
} as const;

export const storage = {
  // モードの保存と取得
  async saveMode(mode: AppMode): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.MODE, mode);
    } catch (error) {
      console.error('Failed to save mode:', error);
      throw error;
    }
  },

  async getMode(): Promise<AppMode | null> {
    try {
      const mode = await AsyncStorage.getItem(KEYS.MODE);
      return mode as AppMode | null;
    } catch (error) {
      console.error('Failed to get mode:', error);
      return null;
    }
  },

  async clearMode(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.MODE);
    } catch (error) {
      console.error('Failed to clear mode:', error);
      throw error;
    }
  },

  // 認証トークンの保存と取得（Django実装時に使用）
  async saveAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Failed to save auth token:', error);
      throw error;
    }
  },

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  },

  async clearAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([KEYS.AUTH_TOKEN, KEYS.USER_DATA]);
    } catch (error) {
      console.error('Failed to clear auth:', error);
      throw error;
    }
  },

  // 全データクリア
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  },
};
