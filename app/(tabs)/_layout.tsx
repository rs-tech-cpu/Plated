import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Palette } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

function JournalIcon({ focused }: { focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <IconSymbol
        name="book.closed.fill"
        size={22}
        color={focused ? Palette.oliveDeep : Palette.warmGrayLight}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>Journal</Text>
    </View>
  );
}

function MapIcon({ focused }: { focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <IconSymbol
        name="map.fill"
        size={22}
        color={focused ? Palette.oliveDeep : Palette.warmGrayLight}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>Map</Text>
    </View>
  );
}

function AddIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.addButton, focused && styles.addButtonFocused]}>
      <IconSymbol
        name="plus"
        size={24}
        color={focused ? Palette.white : Palette.oliveDeep}
        weight="semibold"
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Palette.oliveDeep,
        tabBarInactiveTintColor: Palette.warmGrayLight,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Journal',
          tabBarIcon: ({ focused }) => <JournalIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ focused }) => <AddIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ focused }) => <MapIcon focused={focused} />,
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Palette.white,
    borderTopColor: Palette.beige,
    borderTopWidth: 1,
    height: 88,
    paddingBottom: 24,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  iconWrap: {
    alignItems: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Palette.warmGrayLight,
    letterSpacing: 0.3,
  },
  tabLabelFocused: {
    color: Palette.oliveDeep,
    fontWeight: '700',
  },
  addButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Palette.beige,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonFocused: {
    backgroundColor: Palette.oliveDeep,
  },
});
