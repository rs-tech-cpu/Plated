import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEntries } from '@/hooks/useDatabase';
import { SwipeableEntryCard } from '@/components/SwipeableEntryCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette, Fonts } from '@/constants/theme';
import { PlatedEntry } from '@/lib/types';

export default function JournalScreen() {
  const router = useRouter();
  const { entries, loading, refresh, removeEntry } = useEntries();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  function renderEmpty() {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIconWrap}>
          <IconSymbol name="fork.knife" size={48} color={Palette.beigeDeep} />
        </View>
        <Text style={styles.emptyTitle}>Your journal is empty</Text>
        <Text style={styles.emptySubtitle}>
          Tap the add button below to plate your first memory.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.wordmark}>Plated</Text>
          <Text style={styles.subtitle}>
            {entries.length} {entries.length === 1 ? 'memory' : 'memories'}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.offersBtn, pressed && styles.offersBtnPressed]}
          onPress={() => router.push('/offers' as Href)}
        >
          <IconSymbol name="tag.fill" size={18} color={Palette.oliveDeep} />
        </Pressable>
      </View>

      <FlatList
        data={entries}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }: { item: PlatedEntry }) => (
            <SwipeableEntryCard entry={item} onDelete={removeEntry} />
          )}
        contentContainerStyle={[styles.list, entries.length === 0 && styles.listEmpty]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading ? renderEmpty() : null}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={Palette.oliveDeep} />
        }
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  offersBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offersBtnPressed: {
    opacity: 0.7,
  },
  wordmark: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 34,
    fontWeight: '700',
    color: Palette.oliveDeep,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Palette.warmGray,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  listEmpty: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Palette.beige,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: Palette.charcoal,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    color: Palette.warmGray,
    textAlign: 'center',
    lineHeight: 22,
  },
});
