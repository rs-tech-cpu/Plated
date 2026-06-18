import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { createFirestoreClaim, listenToClaim } from '@/lib/claims';
import { saveClaimLocally, markClaimScanned } from '@/lib/database';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette, Fonts } from '@/constants/theme';
import { Offer } from '@/lib/offers';

type ClaimState = 'generating' | 'qr' | 'success' | 'error';

interface Props {
  visible: boolean;
  offer: Offer | null;
  onClose: () => void;
}

export function ClaimModal({ visible, offer, onClose }: Props) {
  const [state, setState] = useState<ClaimState>('generating');
  const [claimId, setClaimId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const pulseAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (visible && offer) {
      generate(offer);
    }
    return () => {
      unsubscribeRef.current?.();
    };
  }, [visible, offer?.id]);

  useEffect(() => {
    if (!visible) {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
      setState('generating');
      setClaimId(null);
      setErrorMsg('');
    }
  }, [visible]);

  useEffect(() => {
    if (state === 'qr') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.92, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
    }
  }, [state]);

  async function generate(o: Offer) {
    setState('generating');
    try {
      const id = await createFirestoreClaim(o);
      const createdAt = new Date().toISOString();
      await saveClaimLocally({
        id,
        offerId: o.id,
        offerTitle: o.title,
        restaurant: o.restaurant,
        discount: o.discount,
        scanned: false,
        createdAt,
      });
      setClaimId(id);
      setState('qr');

      // Listen for the restaurant website to mark it scanned
      unsubscribeRef.current = listenToClaim(id, async () => {
        await markClaimScanned(id);
        setState('success');
        unsubscribeRef.current?.();
        unsubscribeRef.current = null;
      });
    } catch (e) {
      setErrorMsg('Could not connect to Firebase. Check your internet connection and Firebase config.');
      setState('error');
    }
  }

  function handleClose() {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Claim Offer</Text>
          <Pressable onPress={handleClose} style={styles.closeBtn}>
            <IconSymbol name="xmark" size={15} color={Palette.warmGray} weight="semibold" />
          </Pressable>
        </View>

        {/* Generating */}
        {state === 'generating' && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Palette.oliveDeep} />
            <Text style={styles.loadingText}>Generating your QR code…</Text>
          </View>
        )}

        {/* QR code */}
        {state === 'qr' && claimId && (
          <View style={styles.qrContent}>
            <View style={styles.offerChip}>
              <IconSymbol name="tag.fill" size={13} color={Palette.terracotta} />
              <Text style={styles.offerChipText}>{offer?.discount}</Text>
            </View>
            <Text style={styles.qrTitle}>{offer?.title}</Text>
            <Text style={styles.qrRestaurant}>{offer?.restaurant}</Text>

            <Animated.View style={[styles.qrCard, { transform: [{ scale: pulseAnim }] }]}>
              <QRCode
                value={claimId}
                size={200}
                backgroundColor={Palette.white}
                color={Palette.charcoal}
              />
            </Animated.View>

            <View style={styles.waitingRow}>
              <ActivityIndicator size="small" color={Palette.oliveDeep} />
              <Text style={styles.waitingText}>Waiting for staff to scan…</Text>
            </View>

            <Text style={styles.instruction}>
              Show this QR code to the staff at {offer?.restaurant}. Once they scan it on their
              device, your offer will be confirmed automatically.
            </Text>
          </View>
        )}

        {/* Success */}
        {state === 'success' && (
          <View style={styles.centered}>
            <View style={styles.successIcon}>
              <IconSymbol name="checkmark.circle.fill" size={72} color="#2ECC71" />
            </View>
            <Text style={styles.resultTitle}>Offer Claimed!</Text>
            <Text style={styles.resultSub}>
              Your {offer?.discount?.toLowerCase()} at {offer?.restaurant} has been confirmed. Enjoy!
            </Text>
            <Pressable style={styles.doneBtn} onPress={handleClose}>
              <Text style={styles.doneBtnText}>Done</Text>
            </Pressable>
          </View>
        )}

        {/* Error */}
        {state === 'error' && (
          <View style={styles.centered}>
            <View style={styles.errorIcon}>
              <IconSymbol name="xmark.circle.fill" size={72} color="#E03C3C" />
            </View>
            <Text style={styles.resultTitle}>Something went wrong</Text>
            <Text style={styles.resultSub}>{errorMsg}</Text>
            <Pressable style={styles.retryBtn} onPress={() => offer && generate(offer)}>
              <Text style={styles.retryBtnText}>Try Again</Text>
            </Pressable>
          </View>
        )}
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
  headerSpacer: { width: 36 },
  headerTitle: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: Palette.oliveDeep,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: Palette.warmGray,
    marginTop: 12,
  },
  // QR state
  qrContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 10,
  },
  offerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.terracotta + '18',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  offerChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.terracotta,
    letterSpacing: 0.5,
  },
  qrTitle: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: Palette.charcoal,
    textAlign: 'center',
    lineHeight: 28,
  },
  qrRestaurant: {
    fontSize: 14,
    color: Palette.oliveDeep,
    fontWeight: '600',
    marginBottom: 8,
  },
  qrCard: {
    backgroundColor: Palette.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: Palette.charcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    marginVertical: 8,
  },
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  waitingText: {
    fontSize: 13,
    color: Palette.oliveDeep,
    fontWeight: '500',
  },
  instruction: {
    fontSize: 13,
    color: Palette.warmGray,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  // Success / error
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2ECC7118',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E03C3C18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 26,
    fontWeight: '700',
    color: Palette.charcoal,
    textAlign: 'center',
  },
  resultSub: {
    fontSize: 15,
    color: Palette.warmGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  doneBtn: {
    marginTop: 8,
    backgroundColor: Palette.oliveDeep,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 60,
    shadowColor: Palette.oliveDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: 0.2,
  },
  retryBtn: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderWidth: 1.5,
    borderColor: Palette.oliveDeep,
  },
  retryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.oliveDeep,
    letterSpacing: 0.2,
  },
});
