export type AppMode = 'owner' | 'staff' | 'pos';

export interface ModeSelection {
  mode: AppMode;
  selectedAt: string;
}

export const MODE_INFO: Record<AppMode, { title: string;}> = {
  owner: {
    title: 'Owner',
  },
  staff: {
    title: 'Staff',
  },
  pos: {
    title: 'POS',
  }
};
