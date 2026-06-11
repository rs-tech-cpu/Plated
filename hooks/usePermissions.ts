import { useState, useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';

export interface PermissionState {
  camera: boolean;
  mediaLibrary: boolean;
  location: boolean;
  allGranted: boolean;
  requesting: boolean;
}

export function usePermissions() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [state, setState] = useState<PermissionState>({
    camera: false,
    mediaLibrary: false,
    location: false,
    allGranted: false,
    requesting: true,
  });

  useEffect(() => {
    checkAndRequest();
  }, []);

  async function checkAndRequest() {
    setState(s => ({ ...s, requesting: true }));

    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const locationStatus = await Location.requestForegroundPermissionsAsync();
    await MediaLibrary.requestPermissionsAsync();

    const cameraGranted = cameraPermission?.granted ?? false;
    const mediaGranted = mediaStatus.granted;
    const locationGranted = locationStatus.granted;

    setState({
      camera: cameraGranted,
      mediaLibrary: mediaGranted,
      location: locationGranted,
      allGranted: cameraGranted && mediaGranted && locationGranted,
      requesting: false,
    });
  }

  async function requestCamera() {
    const result = await requestCameraPermission();
    if (!result.granted && !result.canAskAgain) {
      Alert.alert(
        'Camera Permission',
        'Plated needs camera access. Please enable it in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
    setState(s => ({ ...s, camera: result.granted }));
    return result.granted;
  }

  async function requestMediaLibrary() {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted && !result.canAskAgain) {
      Alert.alert(
        'Photo Library Permission',
        'Plated needs photo library access. Please enable it in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
    setState(s => ({ ...s, mediaLibrary: result.granted }));
    return result.granted;
  }

  return { ...state, requestCamera, requestMediaLibrary, refresh: checkAndRequest };
}
