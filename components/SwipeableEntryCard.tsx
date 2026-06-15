import React, { useRef, useCallback } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { EntryCard } from './EntryCard';
import { IconSymbol } from './ui/icon-symbol';
import { Palette } from '@/constants/theme';
import { PlatedEntry } from '@/lib/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 40; // 20px padding each side in the feed
const CARD_HEIGHT = 260;
const CARD_MARGIN = 16;
const SWIPE_THRESHOLD = CARD_WIDTH * 0.42;

interface Props {
  entry: PlatedEntry;
  onDelete: (id: number) => void;
}

export function SwipeableEntryCard({ entry, onDelete }: Props) {
  const swipeableRef = useRef<Swipeable>(null);
  const heightAnim = useRef(new Animated.Value(CARD_HEIGHT + CARD_MARGIN)).current;
  const [showOverlay, setShowOverlay] = React.useState(false);

  const handleDelete = useCallback(() => {
    setShowOverlay(true);
    setTimeout(() => {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 320,
        useNativeDriver: false,
      }).start(() => onDelete(entry.id));
    }, 80);
  }, [entry.id, heightAnim, onDelete]);

  const renderRightActions = useCallback(
    (_progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
      // translateX goes from CARD_WIDTH (hidden) → 0 (fully visible) as drag goes 0 → -CARD_WIDTH
      const translateX = dragX.interpolate({
        inputRange: [-CARD_WIDTH, 0],
        outputRange: [0, CARD_WIDTH],
        extrapolate: 'clamp',
      });

      return (
        <View style={styles.deleteBarContainer}>
          <Animated.View style={[styles.deleteBar, { transform: [{ translateX }] }]}>
            <IconSymbol name="trash.fill" size={26} color={Palette.white} />
          </Animated.View>
        </View>
      );
    },
    []
  );

  return (
    <Animated.View style={[styles.container, { height: heightAnim }]}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        onSwipeableOpen={handleDelete}
        rightThreshold={SWIPE_THRESHOLD}
        friction={1.8}
        overshootRight={false}
      >
        <EntryCard entry={entry} />
      </Swipeable>
      {showOverlay && (
        <View style={styles.overlay}>
          <IconSymbol name="trash.fill" size={28} color={Palette.white} />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  deleteBarContainer: {
    width: CARD_WIDTH,
    marginBottom: CARD_MARGIN,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  deleteBar: {
    flex: 1,
    backgroundColor: '#E03C3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: CARD_MARGIN,
    backgroundColor: '#E03C3C',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
