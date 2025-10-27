import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from './AppText';

interface ModeCardProps {
  title: string;
  onPress: () => void;
}

export function ModeCard({ title, onPress }: ModeCardProps) {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <AppText variant="subtitle" style={styles.cardTitle}>
          {title}
        </AppText>
        <View style={styles.closeButton} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontWeight: '600',
    color: '#1A202C',
    justifyContent: 'center',
    marginVertical: 30,
  },
  closeButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
});
