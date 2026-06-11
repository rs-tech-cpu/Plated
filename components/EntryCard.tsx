import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { PlatedEntry } from '@/lib/types';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette, Fonts } from '@/constants/theme';

interface Props {
  entry: PlatedEntry;
}

export function EntryCard({ entry }: Props) {
  const router = useRouter();

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Pressable
      onPress={() => router.push(`/entry/${entry.id}`)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
    >
      {entry.imageUri ? (
        <Image source={{ uri: entry.imageUri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <IconSymbol name="fork.knife" size={48} color={Palette.beigeDeep} />
        </View>
      )}

      <View style={styles.overlay}>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, entry.isHomemade ? styles.homemadeBadge : styles.eatenOutBadge]}>
            <Text style={styles.badgeText}>{entry.isHomemade ? 'Homemade' : 'Eaten Out'}</Text>
          </View>
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{entry.title}</Text>
          <View style={styles.meta}>
            <Text style={styles.date}>{formattedDate}</Text>
            {entry.locationName && (
              <>
                <Text style={styles.dot}> · </Text>
                <Text style={styles.location} numberOfLines={1}>{entry.locationName}</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Palette.white,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    height: 260,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: Palette.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  homemadeBadge: {
    backgroundColor: Palette.oliveDeep + 'E0',
  },
  eatenOutBadge: {
    backgroundColor: Palette.terracotta + 'E0',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  info: {
    backgroundColor: 'rgba(26,26,26,0.55)',
    borderRadius: 12,
    padding: 12,
  },
  title: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: Palette.white,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  date: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  dot: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  location: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
  },
});
