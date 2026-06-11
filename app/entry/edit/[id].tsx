import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEntry, useEntries } from '@/hooks/useDatabase';
import { PlatedButton } from '@/components/PlatedButton';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { LocationPicker } from '@/components/LocationPicker';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette, Fonts } from '@/constants/theme';

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export default function EditEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { entry, loading } = useEntry(Number(id));
  const { editEntry, removeEntry } = useEntries();

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isHomemade, setIsHomemade] = useState(false);
  const [date, setDate] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleDateChange(_event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selected) setDate(toDateString(selected));
  }

  // Seed form fields once the entry loads
  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setDescription(entry.description);
      setImageUri(entry.imageUri);
      setIsHomemade(entry.isHomemade);
      setDate(entry.date);
      setLatitude(entry.latitude);
      setLongitude(entry.longitude);
      setLocationName(entry.locationName);
    }
  }, [entry]);

  function handleLocationSelect(lat: number, lng: number, name: string) {
    setLatitude(lat);
    setLongitude(lng);
    setLocationName(name);
  }

  async function pickFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  async function openCamera() {
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert('Camera Permission', 'Please allow camera access in Settings.');
        return;
      }
    }
    setShowCamera(true);
  }

  async function takePicture() {
    if (!cameraRef) return;
    try {
      const photo = await cameraRef.takePictureAsync({ quality: 0.85 });
      if (photo) {
        setImageUri(photo.uri);
        setShowCamera(false);
      }
    } catch {
      Alert.alert('Error', 'Could not take picture.');
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please give your dish a name.');
      return;
    }
    setSaving(true);
    try {
      await editEntry(Number(id), {
        title: title.trim(),
        description: description.trim(),
        imageUri,
        latitude,
        longitude,
        locationName,
        isHomemade,
        date,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  }

  function clearLocation() {
    setLatitude(null);
    setLongitude(null);
    setLocationName(null);
  }

  function confirmDelete() {
    Alert.alert('Delete Entry', 'This memory will be permanently removed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeEntry(Number(id));
          router.replace('/(tabs)');
        },
      },
    ]);
  }

  if (showCamera) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <CameraView ref={ref => setCameraRef(ref)} style={StyleSheet.absoluteFill} facing="back" />
        <SafeAreaView style={styles.cameraOverlay} edges={['top', 'bottom']}>
          <Pressable onPress={() => setShowCamera(false)} style={styles.cameraClose}>
            <IconSymbol name="xmark" size={18} color={Palette.white} weight="semibold" />
          </Pressable>
          <Pressable onPress={takePicture} style={styles.shutterButton}>
            <View style={styles.shutterInner} />
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Palette.oliveDeep} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header row */}
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Text style={styles.heading}>Edit Entry</Text>
            <Pressable onPress={confirmDelete} style={styles.deleteIconBtn}>
              <IconSymbol name="trash" size={18} color={Palette.terracotta} />
            </Pressable>
          </View>

          {/* Photo */}
          <View style={styles.photoSection}>
            {imageUri ? (
              <Pressable onPress={pickFromLibrary}>
                <Image source={{ uri: imageUri }} style={styles.photo} resizeMode="cover" />
                <View style={styles.photoChangeOverlay}>
                  <Text style={styles.photoChangeText}>Change Photo</Text>
                </View>
              </Pressable>
            ) : (
              <View style={styles.photoButtons}>
                <Pressable style={styles.photoBtn} onPress={openCamera}>
                  <IconSymbol name="camera.fill" size={28} color={Palette.oliveDeep} />
                  <Text style={styles.photoBtnLabel}>Camera</Text>
                </Pressable>
                <Pressable style={styles.photoBtn} onPress={pickFromLibrary}>
                  <IconSymbol name="photo" size={28} color={Palette.oliveDeep} />
                  <Text style={styles.photoBtnLabel}>Library</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Type */}
          <View style={styles.field}>
            <Text style={styles.label}>Type</Text>
            <ToggleSwitch value={isHomemade} onChange={setIsHomemade} />
          </View>

          {/* Dish name */}
          <View style={styles.field}>
            <Text style={styles.label}>Dish Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mushroom Risotto"
              placeholderTextColor={Palette.warmGrayLight}
              value={title}
              onChangeText={setTitle}
              returnKeyType="next"
              maxLength={80}
            />
          </View>

          {/* Notes */}
          <View style={styles.field}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="How did it taste? What made it special?"
              placeholderTextColor={Palette.warmGrayLight}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          {/* Date */}
          <View style={styles.field}>
            <Text style={styles.label}>Date</Text>
            <Pressable
              style={[styles.dateRow, showDatePicker && styles.dateRowOpen]}
              onPress={() => setShowDatePicker(p => !p)}
            >
              <Text style={styles.dateText}>
                {date ? parseLocalDate(date).toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                }) : '—'}
              </Text>
              <IconSymbol
                name="chevron.right"
                size={14}
                color={Palette.warmGrayLight}
                style={{ transform: [{ rotate: showDatePicker ? '90deg' : '0deg' }] }}
              />
            </Pressable>
            {showDatePicker && date ? (
              <DateTimePicker
                value={parseLocalDate(date)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={handleDateChange}
                style={styles.datePicker}
              />
            ) : null}
          </View>

          {/* Location */}
          <View style={styles.field}>
            <Text style={styles.label}>Location</Text>
            <Pressable style={styles.locationRow} onPress={() => setShowLocationPicker(true)}>
              <IconSymbol
                name="mappin.and.ellipse"
                size={16}
                color={locationName ? Palette.terracotta : Palette.warmGrayLight}
              />
              {locationName ? (
                <>
                  <Text style={styles.locationText} numberOfLines={1}>{locationName}</Text>
                  <Pressable onPress={clearLocation} hitSlop={8} style={styles.locationClearBtn}>
                    <IconSymbol name="xmark" size={12} color={Palette.warmGray} weight="semibold" />
                  </Pressable>
                </>
              ) : (
                <Text style={styles.locationPlaceholder}>Add a location</Text>
              )}
            </Pressable>
          </View>

          <PlatedButton label="Save Changes" onPress={handleSave} loading={saving} style={styles.saveBtn} />
        </ScrollView>
      </KeyboardAvoidingView>

      <LocationPicker
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelect={handleLocationSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.cream },
  scroll: { padding: 20, paddingBottom: 48 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cancelBtn: { padding: 4 },
  cancelText: { fontSize: 16, color: Palette.warmGray, fontWeight: '500' },
  heading: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: Palette.oliveDeep,
  },
  deleteIconBtn: { padding: 4 },
  photoSection: { marginBottom: 24 },
  photo: { width: '100%', height: 220, borderRadius: 16 },
  photoChangeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
  },
  photoChangeText: { color: Palette.white, fontSize: 13, fontWeight: '600' },
  photoButtons: { flexDirection: 'row', gap: 12, height: 120 },
  photoBtn: {
    flex: 1,
    backgroundColor: Palette.beige,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoBtnLabel: { fontSize: 13, fontWeight: '600', color: Palette.oliveDeep },
  field: { marginBottom: 20 },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.warmGray,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    backgroundColor: Palette.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Palette.charcoal,
    borderWidth: 1,
    borderColor: Palette.beige,
  },
  textarea: { minHeight: 100, paddingTop: 14 },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Palette.beige,
  },
  dateRowOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: Palette.cream,
  },
  dateText: { fontSize: 16, color: Palette.charcoal },
  datePicker: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Palette.beige,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Palette.beige,
    gap: 8,
  },
  locationText: { fontSize: 15, color: Palette.charcoal, flex: 1 },
  locationPlaceholder: { fontSize: 15, color: Palette.warmGrayLight, flex: 1 },
  locationClearBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Palette.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: { marginTop: 8 },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  cameraClose: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.white,
  },
});
