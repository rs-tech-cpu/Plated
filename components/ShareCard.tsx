import React, { forwardRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { PlatedEntry } from '@/lib/types';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette, Fonts } from '@/constants/theme';

interface Props {
  entry: PlatedEntry;
}

export const ShareCard = forwardRef<ViewShot, Props>(({ entry }, ref) => {
  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <ViewShot ref={ref} options={{ format: 'png', quality: 1.0 }}>
      <View style={styles.card}>
        {entry.imageUri && (
          <Image source={{ uri: entry.imageUri }} style={styles.image} resizeMode="cover" />
        )}
        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.wordmark}>Plated</Text>
            <View style={[styles.badge, entry.isHomemade ? styles.homemadeBadge : styles.eatenOutBadge]}>
              <Text style={styles.badgeText}>{entry.isHomemade ? 'Homemade' : 'Eaten Out'}</Text>
            </View>
          </View>
          <Text style={styles.title}>{entry.title}</Text>
          {entry.description ? (
            <Text style={styles.description} numberOfLines={3}>{entry.description}</Text>
          ) : null}
          <View style={styles.footer}>
            <Text style={styles.date}>{formattedDate}</Text>
            {entry.locationName && (
              <View style={styles.locationRow}>
                <IconSymbol name="mappin.and.ellipse" size={12} color={Palette.warmGray} />
                <Text style={styles.location}>{entry.locationName}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ViewShot>
  );
});

ShareCard.displayName = 'ShareCard';

const styles = StyleSheet.create({
  card: {
    width: 360,
    backgroundColor: Palette.cream,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  image: {
    width: '100%',
    height: 240,
  },
  body: {
    padding: 20,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  wordmark: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: Palette.oliveDeep,
    letterSpacing: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  homemadeBadge: { backgroundColor: Palette.oliveDeep },
  eatenOutBadge: { backgroundColor: Palette.terracotta },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: Palette.charcoal,
    lineHeight: 28,
  },
  description: {
    fontSize: 14,
    color: Palette.warmGray,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Palette.beige,
  },
  date: {
    fontSize: 12,
    color: Palette.warmGrayLight,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    color: Palette.warmGray,
    fontWeight: '500',
  },
});
