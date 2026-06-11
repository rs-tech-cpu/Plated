import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useEntry, useEntries } from '@/hooks/useDatabase';
import { ShareCard } from '@/components/ShareCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette, Fonts } from '@/constants/theme';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { entry, loading } = useEntry(Number(id));
  const { removeEntry } = useEntries();
  const shareRef = useRef<ViewShot>(null);

  async function handleShare() {
    try {
      if (!shareRef.current?.capture) return;
      const uri = await shareRef.current.capture();
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('Sharing not available on this device.');
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your Plated entry',
      });
    } catch {
      Alert.alert('Error', 'Could not share this entry.');
    }
  }

  function showOptions() {
    Alert.alert(entry?.title ?? 'Entry', undefined, [
      {
        text: 'Edit Entry',
        onPress: () => router.push(`/entry/edit/${id}`),
      },
      {
        text: 'Delete Entry',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Delete Entry', 'This memory will be permanently removed.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                await removeEntry(Number(id));
                router.back();
              },
            },
          ]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Palette.oliveDeep} />
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Entry not found.</Text>
      </View>
    );
  }

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <ScrollView bounces showsVerticalScrollIndicator={false}>
        {entry.imageUri ? (
          <View style={styles.heroWrap}>
            <Image source={{ uri: entry.imageUri }} style={styles.hero} resizeMode="cover" />
            <View style={styles.heroOverlay} />
          </View>
        ) : (
          <View style={[styles.heroWrap, styles.heroPlaceholder]}>
            <IconSymbol name="fork.knife" size={64} color={Palette.beigeDeep} />
          </View>
        )}

        <SafeAreaView edges={['top']} style={styles.navBar}>
          <Pressable onPress={() => router.back()} style={styles.navBtn}>
            <IconSymbol name="chevron.left" size={20} color={Palette.white} weight="semibold" />
          </Pressable>
          <Pressable onPress={showOptions} style={styles.navBtn}>
            <IconSymbol name="ellipsis.circle" size={22} color={Palette.white} weight="semibold" />
          </Pressable>
        </SafeAreaView>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={[styles.badge, entry.isHomemade ? styles.homemadeBadge : styles.eatenOutBadge]}>
              <Text style={styles.badgeText}>{entry.isHomemade ? 'Homemade' : 'Eaten Out'}</Text>
            </View>
          </View>

          <Text style={styles.title}>{entry.title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{formattedDate}</Text>
            {entry.locationName && (
              <View style={styles.metaLocation}>
                <IconSymbol name="mappin.and.ellipse" size={14} color={Palette.warmGray} />
                <Text style={styles.metaText}>{entry.locationName}</Text>
              </View>
            )}
          </View>

          {entry.description ? (
            <Text style={styles.description}>{entry.description}</Text>
          ) : null}

          <View style={styles.actions}>
            <Pressable style={styles.editBtn} onPress={() => router.push(`/entry/edit/${id}`)}>
              <IconSymbol name="pencil" size={17} color={Palette.oliveDeep} weight="semibold" />
              <Text style={styles.editBtnText}>Edit Entry</Text>
            </Pressable>
            <Pressable style={styles.shareBtn} onPress={handleShare}>
              <IconSymbol name="square.and.arrow.up" size={17} color={Palette.cream} weight="semibold" />
              <Text style={styles.shareBtnText}>Share</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.offscreen}>
        <ShareCard ref={shareRef} entry={entry} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.cream },
  notFound: { fontSize: 16, color: Palette.warmGray },
  heroWrap: { height: 380 },
  hero: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  heroPlaceholder: {
    backgroundColor: Palette.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  content: { padding: 24, paddingBottom: 48 },
  topRow: { flexDirection: 'row', marginBottom: 14 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  homemadeBadge: { backgroundColor: Palette.oliveDeep },
  eatenOutBadge: { backgroundColor: Palette.terracotta },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 30,
    fontWeight: '700',
    color: Palette.charcoal,
    lineHeight: 36,
    marginBottom: 12,
  },
  metaRow: { gap: 6, marginBottom: 20 },
  metaText: { fontSize: 14, color: Palette.warmGray, fontWeight: '500' },
  metaLocation: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  description: {
    fontSize: 16,
    color: Palette.charcoal,
    lineHeight: 26,
    marginBottom: 32,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: Palette.oliveDeep,
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.oliveDeep,
    letterSpacing: 0.2,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.oliveDeep,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: Palette.oliveDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  shareBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.cream,
    letterSpacing: 0.2,
  },
  offscreen: {
    position: 'absolute',
    left: -9999,
    top: -9999,
    opacity: 0,
  },
});
