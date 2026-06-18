export interface PlatedEntry {
  id: number;
  title: string;
  description: string;
  imageUri: string | null;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  isHomemade: boolean;
  date: string;
  createdAt: string;
}

export interface NewEntryInput {
  title: string;
  description: string;
  imageUri: string | null;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  isHomemade: boolean;
  date: string;
}
