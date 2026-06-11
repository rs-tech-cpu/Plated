import { useRef } from 'react';
import { Alert } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export function useSharing() {
  const shareRef = useRef<ViewShot>(null);

  async function shareEntry() {
    try {
      if (!shareRef.current?.capture) {
        Alert.alert('Share', 'Could not capture entry card.');
        return;
      }
      const uri = await shareRef.current.capture();
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('Sharing not available', 'Your device does not support sharing.');
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your Plated entry',
      });
    } catch (e) {
      Alert.alert('Error', 'Could not share this entry.');
    }
  }

  return { shareRef, shareEntry };
}
