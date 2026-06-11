import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { useFocusEffect, useRouter } from 'expo-router';
import { useEntries } from '@/hooks/useDatabase';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette, Fonts } from '@/constants/theme';

const DEFAULT_REGION: Region = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function MapScreen() {
  const { entries, refresh } = useEntries();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const pinned = entries.filter(e => e.latitude != null && e.longitude != null);

  const initialRegion: Region =
    pinned.length > 0
      ? {
          latitude: pinned[0].latitude!,
          longitude: pinned[0].longitude!,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }
      : DEFAULT_REGION;

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={initialRegion} showsUserLocation>
        {pinned.map(entry => (
          <Marker
            key={entry.id}
            coordinate={{ latitude: entry.latitude!, longitude: entry.longitude! }}
          >
            <View style={[styles.pin, entry.isHomemade ? styles.pinOlive : styles.pinTerra]}>
              <IconSymbol
                name="fork.knife"
                size={18}
                color={Palette.white}
                weight="semibold"
              />
            </View>
            <Callout onPress={() => router.push(`/entry/${entry.id}`)} tooltip>
              <View style={styles.callout}>
                {entry.imageUri && (
                  <Image source={{ uri: entry.imageUri }} style={styles.calloutImage} />
                )}
                <View style={styles.calloutBody}>
                  <Text style={styles.calloutTitle} numberOfLines={1}>{entry.title}</Text>
                  {entry.locationName && (
                    <View style={styles.calloutLocationRow}>
                      <IconSymbol name="mappin.and.ellipse" size={11} color={Palette.warmGray} />
                      <Text style={styles.calloutLocation} numberOfLines={1}>{entry.locationName}</Text>
                    </View>
                  )}
                  <Text style={styles.calloutTap}>Tap to view →</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <SafeAreaView style={styles.overlay} edges={['top']} pointerEvents="box-none">
        <View style={styles.header}>
          <Text style={styles.heading}>Map</Text>
          <Text style={styles.count}>{pinned.length} pinned</Text>
        </View>
      </SafeAreaView>

      {pinned.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No locations yet.</Text>
          <Text style={styles.emptySubtext}>Entries with location will appear here.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    margin: 16,
    backgroundColor: Palette.white,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: Palette.oliveDeep,
  },
  count: {
    fontSize: 13,
    color: Palette.warmGray,
    fontWeight: '500',
  },
  pin: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Palette.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pinOlive: { backgroundColor: Palette.oliveDeep },
  pinTerra: { backgroundColor: Palette.terracotta },
  callout: {
    backgroundColor: Palette.white,
    borderRadius: 14,
    overflow: 'hidden',
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  calloutImage: { width: '100%', height: 100 },
  calloutBody: { padding: 10 },
  calloutTitle: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: Palette.charcoal,
    marginBottom: 4,
  },
  calloutLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  calloutLocation: {
    fontSize: 11,
    color: Palette.warmGray,
    flex: 1,
  },
  calloutTap: {
    fontSize: 11,
    color: Palette.terracotta,
    fontWeight: '600',
  },
  empty: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: Palette.white,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyText: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: Palette.charcoal,
  },
  emptySubtext: {
    fontSize: 13,
    color: Palette.warmGray,
    marginTop: 4,
  },
});
