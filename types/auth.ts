//!ユーザー情報（Django実装時に拡張予定）
export interface User {
  id: string;
  username: string;
  mode: 'owner' | 'staff' | 'pos';
}

// 認証状態
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// ログイン情報
export interface LoginCredentials {
  username: string;
  password: string;
  mode: 'owner' | 'staff' | 'pos';
}
