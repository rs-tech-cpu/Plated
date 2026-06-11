import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette, Fonts } from '@/constants/theme';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.heading}>Map</Text>
        <Text style={styles.sub}>Map view is available in the iOS and Android apps.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.cream },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  heading: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: Palette.oliveDeep,
    marginBottom: 10,
  },
  sub: {
    fontSize: 15,
    color: Palette.warmGray,
    textAlign: 'center',
    lineHeight: 22,
  },
});
