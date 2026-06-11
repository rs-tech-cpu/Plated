import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette, Fonts } from '@/constants/theme';

interface LocationResult {
  latitude: number;
  longitude: number;
  name: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (latitude: number, longitude: number, locationName: string) => void;
}

async function reverseGeocodeName(latitude: number, longitude: number, fallback: string): Promise<string> {
  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (place) {
      const parts = [place.name, place.city || place.district, place.country].filter(Boolean);
      return parts.slice(0, 2).join(', ');
    }
  } catch {}
  return fallback;
}

export function LocationPicker({ visible, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleQueryChange(text: string) {
    setQuery(text);
    setNoResults(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(() => runSearch(text), 600);
  }

  async function runSearch(text: string) {
    try {
      const geocoded = await Location.geocodeAsync(text);
      if (!geocoded.length) {
        setResults([]);
        setNoResults(true);
        return;
      }

      const items = await Promise.all(
        geocoded.slice(0, 6).map(async r => ({
          latitude: r.latitude,
          longitude: r.longitude,
          name: await reverseGeocodeName(r.latitude, r.longitude, text),
        }))
      );

      // deduplicate by name
      const seen = new Set<string>();
      const unique = items.filter(item => {
        if (seen.has(item.name)) return false;
        seen.add(item.name);
        return true;
      });

      setResults(unique);
      setNoResults(unique.length === 0);
    } catch {
      setResults([]);
      setNoResults(true);
    } finally {
      setSearching(false);
    }
  }

  async function handleCurrentLocation() {
    setLoadingCurrent(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = loc.coords;
      const name = await reverseGeocodeName(latitude, longitude, 'Current Location');
      onSelect(latitude, longitude, name);
      handleClose();
    } catch {
      // silently ignore
    } finally {
      setLoadingCurrent(false);
    }
  }

  function handleSelect(item: LocationResult) {
    onSelect(item.latitude, item.longitude, item.name);
    handleClose();
  }

  function handleClose() {
    setQuery('');
    setResults([]);
    setNoResults(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Choose Location</Text>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <IconSymbol name="xmark" size={16} color={Palette.warmGray} weight="semibold" />
            </Pressable>
          </View>

          {/* Search bar */}
          <View style={styles.searchBar}>
            <IconSymbol name="magnifyingglass" size={17} color={Palette.warmGrayLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search restaurant, city, or address…"
              placeholderTextColor={Palette.warmGrayLight}
              value={query}
              onChangeText={handleQueryChange}
              autoFocus
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {searching && <ActivityIndicator size="small" color={Palette.oliveDeep} />}
          </View>

          {/* Use Current Location */}
          <Pressable
            style={({ pressed }) => [styles.currentRow, pressed && styles.currentRowPressed]}
            onPress={handleCurrentLocation}
            disabled={loadingCurrent}
          >
            <View style={styles.currentIcon}>
              {loadingCurrent
                ? <ActivityIndicator size="small" color={Palette.oliveDeep} />
                : <IconSymbol name="location.fill" size={18} color={Palette.oliveDeep} />
              }
            </View>
            <View style={styles.currentBody}>
              <Text style={styles.currentLabel}>Use Current Location</Text>
              <Text style={styles.currentSub}>Detect where you are right now</Text>
            </View>
          </Pressable>

          <View style={styles.divider} />

          {/* No-results message */}
          {noResults && !searching && (
            <Text style={styles.noResults}>No results for "{query}"</Text>
          )}

          {/* Results list */}
          <FlatList
            data={results}
            keyExtractor={(_, i) => String(i)}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.resultsList}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.resultRow, pressed && styles.resultRowPressed]}
                onPress={() => handleSelect(item)}
              >
                <IconSymbol name="mappin.and.ellipse" size={16} color={Palette.terracotta} />
                <Text style={styles.resultText} numberOfLines={2}>{item.name}</Text>
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: Palette.oliveDeep,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: Palette.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Palette.beige,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Palette.charcoal,
    padding: 0,
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  currentRowPressed: {
    backgroundColor: Palette.beige,
  },
  currentIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.oliveDeep + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentBody: { flex: 1 },
  currentLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.oliveDeep,
    marginBottom: 2,
  },
  currentSub: {
    fontSize: 12,
    color: Palette.warmGray,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.beige,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  noResults: {
    fontSize: 14,
    color: Palette.warmGray,
    textAlign: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  resultsList: {
    paddingHorizontal: 16,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  resultRowPressed: {
    opacity: 0.6,
  },
  resultText: {
    flex: 1,
    fontSize: 15,
    color: Palette.charcoal,
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: Palette.beige,
  },
});
