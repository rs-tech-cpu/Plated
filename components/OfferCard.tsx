import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Palette, Fonts } from '@/constants/theme';
import { Offer } from '@/lib/offers';

interface Props {
  offer: Offer;
  onPress: () => void;
}

export function OfferCard({ offer, onPress }: Props) {
  const validDate = new Date(offer.validUntil).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <Image
        source={{ uri: offer.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.body}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{offer.discount}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{offer.title}</Text>
        <Text style={styles.restaurant} numberOfLines={1}>{offer.restaurant}</Text>
        <Text style={styles.expiry}>Valid until {validDate}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Palette.white,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: Palette.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.85,
  },
  image: {
    width: 90,
    height: 100,
  },
  body: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    gap: 3,
  },
  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Palette.terracotta,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.white,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: Palette.charcoal,
    lineHeight: 20,
  },
  restaurant: {
    fontSize: 13,
    color: Palette.oliveDeep,
    fontWeight: '600',
    marginTop: 2,
  },
  expiry: {
    fontSize: 11,
    color: Palette.warmGrayLight,
    marginTop: 4,
  },
});
