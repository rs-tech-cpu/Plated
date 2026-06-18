import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OfferCard } from '@/components/OfferCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette, Fonts } from '@/constants/theme';
import { MOCK_OFFERS, Offer } from '@/lib/offers';

export default function OffersScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={20} color={Palette.oliveDeep} weight="semibold" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Offers</Text>
          <Text style={styles.subtitle}>{MOCK_OFFERS.length} available near you</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.claimedBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.push('/offers/claimed' as Href)}
        >
          <IconSymbol name="checkmark.circle" size={15} color={Palette.oliveDeep} />
          <Text style={styles.claimedBtnText}>Claimed</Text>
        </Pressable>
      </View>

      <FlatList
        data={MOCK_OFFERS}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: Offer }) => (
          <OfferCard
            offer={item}
            onPress={() => router.push(`/offers/${item.id}` as Href)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: Palette.oliveDeep,
  },
  subtitle: {
    fontSize: 12,
    color: Palette.warmGray,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  claimedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Palette.beige,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  claimedBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.oliveDeep,
  },
});
