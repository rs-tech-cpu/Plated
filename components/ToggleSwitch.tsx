import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Palette } from '@/constants/theme';

interface Props {
  value: boolean;
  onChange: (v: boolean) => void;
}

export function ToggleSwitch({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onChange(false)}
        style={[styles.option, !value && styles.activeOption]}
      >
        <Text style={[styles.label, !value && styles.activeLabel]}>Eaten Out</Text>
      </Pressable>
      <Pressable
        onPress={() => onChange(true)}
        style={[styles.option, value && styles.activeOption]}
      >
        <Text style={[styles.label, value && styles.activeLabel]}>Homemade</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Palette.beige,
    borderRadius: 12,
    padding: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  activeOption: {
    backgroundColor: Palette.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Palette.warmGray,
  },
  activeLabel: {
    color: Palette.oliveDeep,
    fontWeight: '600',
  },
});
