import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  loading: boolean;
  error: string | null;
}

export function useLocation(autoCapture = false) {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    locationName: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (autoCapture) captureLocation();
  }, [autoCapture]);

  async function captureLocation() {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState(s => ({ ...s, loading: false, error: 'Location permission not granted' }));
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = loc.coords;

      let locationName: string | null = null;
      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (place) {
          const parts = [place.name, place.city || place.district, place.country].filter(Boolean);
          locationName = parts.slice(0, 2).join(', ');
        }
      } catch {
        // reverse geocode is best-effort
      }

      setState({ latitude, longitude, locationName, loading: false, error: null });
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: 'Could not get location' }));
    }
  }

  function clear() {
    setState({ latitude: null, longitude: null, locationName: null, loading: false, error: null });
  }

  return { ...state, captureLocation, clear };
}
