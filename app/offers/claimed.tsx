import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRecentClaims } from '@/lib/database';
import { ClaimRecord } from '@/lib/claims';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette, Fonts } from '@/constants/theme';

export default function ClaimedOffersScreen() {
  const router = useRouter();
  const [claims, setClaims] = useState<ClaimRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getRecentClaims()
        .then(setClaims)
        .finally(() => setLoading(false));
    }, [])
  );

  function ClaimItem({ item }: { item: ClaimRecord }) {
    const date = new Date(item.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={[styles.statusDot, item.scanned ? styles.dotClaimed : styles.dotPending]} />
        </View>
        <View style={styles.cardBody}>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.offerTitle}</Text>
          <Text style={styles.cardRestaurant}>{item.restaurant}</Text>
          <Text style={styles.cardDate}>{date}</Text>
        </View>
        <View style={[styles.statusBadge, item.scanned ? styles.statusClaimed : styles.statusPending]}>
          <Text style={[styles.statusText, item.scanned ? styles.statusTextClaimed : styles.statusTextPending]}>
            {item.scanned ? 'Claimed' : 'Pending'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={20} color={Palette.oliveDeep} weight="semibold" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Claimed Offers</Text>
          <Text style={styles.subtitle}>Last 30 days</Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      {!loading && claims.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconWrap}>
            <IconSymbol name="tag" size={40} color={Palette.beigeDeep} />
          </View>
          <Text style={styles.emptyTitle}>No claims yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap "Claim Offer" on any deal and show the QR code to staff in-store.
          </Text>
        </View>
      ) : (
        <FlatList
          data={claims}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ClaimItem item={item} />}
        />
      )}
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    gap: 12,
    shadowColor: Palette.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotClaimed: {
    backgroundColor: '#2ECC71',
  },
  dotPending: {
    backgroundColor: Palette.warmGrayLight,
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Palette.terracotta + '18',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 2,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.terracotta,
    letterSpacing: 0.4,
  },
  cardTitle: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: Palette.charcoal,
  },
  cardRestaurant: {
    fontSize: 13,
    color: Palette.oliveDeep,
    fontWeight: '500',
  },
  cardDate: {
    fontSize: 11,
    color: Palette.warmGrayLight,
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusClaimed: {
    backgroundColor: '#2ECC7118',
  },
  statusPending: {
    backgroundColor: Palette.beige,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statusTextClaimed: {
    color: '#2ECC71',
  },
  statusTextPending: {
    color: Palette.warmGray,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.beige,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: Palette.charcoal,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Palette.warmGray,
    textAlign: 'center',
    lineHeight: 21,
  },
});
