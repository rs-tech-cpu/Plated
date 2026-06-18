import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore } from './firebase';
import { Offer } from './offers';

export interface ClaimRecord {
  id: string;         // Firestore document ID — also stored locally
  offerId: number;
  offerTitle: string;
  restaurant: string;
  discount: string;
  scanned: boolean;
  createdAt: string;  // ISO string (local time of creation)
}

// Creates a claim document in Firestore and returns its ID.
export async function createFirestoreClaim(offer: Offer): Promise<string> {
  const ref = await addDoc(collection(firestore, 'claims'), {
    offerId: offer.id,
    offerTitle: offer.title,
    restaurant: offer.restaurant,
    discount: offer.discount,
    scanned: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Real-time listener — calls onScanned() the moment the restaurant website
// sets scanned: true on the document. Returns an unsubscribe function.
export function listenToClaim(claimId: string, onScanned: () => void): () => void {
  const claimRef = doc(firestore, 'claims', claimId);
  return onSnapshot(claimRef, (snap) => {
    if (snap.exists() && snap.data().scanned === true) {
      onScanned();
    }
  });
}
