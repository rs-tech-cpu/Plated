import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Palette } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

function TabIcon({ name, label, focused }: { name: string; label: string; focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <IconSymbol
        name={name as any}
        size={22}
        color={focused ? Palette.oliveDeep : Palette.warmGrayLight}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function AddIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.addButton, focused && styles.addButtonFocused]}>
      <IconSymbol
        name="plus"
        size={22}
        color={Palette.white}
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
          tabBarIcon: ({ focused }) => (
            <TabIcon name="book.closed.fill" label="Journal" focused={focused} />
          ),
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
          tabBarIcon: ({ focused }) => (
            <TabIcon name="map.fill" label="Map" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Palette.ivory,
    borderTopColor: Palette.beige,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 84,
    paddingBottom: 20,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 6,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 64,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Palette.warmGrayLight,
    letterSpacing: 0.2,
  },
  tabLabelFocused: {
    color: Palette.oliveDeep,
    fontWeight: '700',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.oliveDeep,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.oliveDeep,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonFocused: {
    backgroundColor: Palette.oliveMid,
  },
});
