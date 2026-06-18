import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClaimModal } from '@/components/ClaimModal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette, Fonts } from '@/constants/theme';
import { MOCK_OFFERS } from '@/lib/offers';

export default function OfferDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [claimVisible, setClaimVisible] = useState(false);

  const offer = MOCK_OFFERS.find(o => String(o.id) === id);

  if (!offer) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Offer not found.</Text>
      </View>
    );
  }

  const validDate = new Date(offer.validUntil).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <ScrollView bounces showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: offer.imageUrl }}
            style={styles.hero}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.heroOverlay} />
        </View>

        {/* Nav buttons over image */}
        <SafeAreaView edges={['top']} style={styles.navBar}>
          <Pressable onPress={() => router.back()} style={styles.navBtn}>
            <IconSymbol name="chevron.left" size={20} color={Palette.white} weight="semibold" />
          </Pressable>
        </SafeAreaView>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.discountBadge}>
            <IconSymbol name="tag.fill" size={12} color={Palette.white} />
            <Text style={styles.discountText}>{offer.discount}</Text>
          </View>

          <Text style={styles.title}>{offer.title}</Text>

          <View style={styles.metaRow}>
            <IconSymbol name="fork.knife" size={14} color={Palette.warmGray} />
            <Text style={styles.metaText}>{offer.restaurant}</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{offer.category}</Text>
          </View>

          <Text style={styles.description}>{offer.description}</Text>

          <View style={styles.validityCard}>
            <IconSymbol name="calendar" size={16} color={Palette.oliveDeep} />
            <View>
              <Text style={styles.validityLabel}>Valid until</Text>
              <Text style={styles.validityDate}>{validDate}</Text>
            </View>
          </View>

          <View style={styles.howItWorks}>
            <Text style={styles.howTitle}>How to claim</Text>
            <View style={styles.step}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
              <Text style={styles.stepText}>Visit {offer.restaurant} in person</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
              <Text style={styles.stepText}>Tap the Claim button below before ordering</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
              <Text style={styles.stepText}>Tap the NFC tag or scan the QR code at the counter</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>4</Text></View>
              <Text style={styles.stepText}>Show the confirmation screen to staff</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky claim button */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.claimBtn, pressed && styles.claimBtnPressed]}
          onPress={() => setClaimVisible(true)}
        >
          <IconSymbol name="wave.3.right" size={18} color={Palette.white} />
          <Text style={styles.claimBtnText}>Claim Offer</Text>
        </Pressable>
      </View>

      <ClaimModal
        visible={claimVisible}
        offer={offer}
        onClose={() => setClaimVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.cream },
  notFound: { fontSize: 16, color: Palette.warmGray },
  heroWrap: { height: 320 },
  hero: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  navBtn: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  content: {
    padding: 24,
    paddingBottom: 120,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Palette.terracotta,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 14,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.white,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 30,
    fontWeight: '700',
    color: Palette.charcoal,
    lineHeight: 36,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  metaText: {
    fontSize: 14,
    color: Palette.warmGray,
    fontWeight: '500',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Palette.warmGrayLight,
  },
  description: {
    fontSize: 16,
    color: Palette.charcoal,
    lineHeight: 26,
    marginBottom: 24,
  },
  validityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.oliveDeep + '10',
    borderRadius: 14,
    padding: 16,
    marginBottom: 32,
  },
  validityLabel: {
    fontSize: 11,
    color: Palette.warmGray,
    fontWeight: '500',
    marginBottom: 2,
  },
  validityDate: {
    fontSize: 14,
    color: Palette.oliveDeep,
    fontWeight: '700',
  },
  howItWorks: {
    gap: 14,
  },
  howTitle: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: Palette.charcoal,
    marginBottom: 4,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.oliveDeep,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.white,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: Palette.warmGray,
    lineHeight: 22,
    paddingTop: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: Palette.cream,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.beige,
  },
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Palette.oliveDeep,
    borderRadius: 18,
    paddingVertical: 18,
    shadowColor: Palette.oliveDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  claimBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  claimBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: 0.2,
  },
});
