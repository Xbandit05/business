import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from './firebase.ts';
import { handleFirestoreError, OperationType } from './firestoreErrors.ts';
import { UserProfile, UserPortfolio, ProduceListing, Order, NegotiationThread } from '../types/index.ts';

// ==========================================
// USER PROFILE OPERATIONS
// ==========================================
export async function saveUserProfileToFirestore(profile: UserProfile): Promise<void> {
  const path = `users/${profile.id}`;
  try {
    const docRef = doc(db, 'users', profile.id);
    await setDoc(docRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function getUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

// ==========================================
// PORTFOLIOS OPERATIONS
// ==========================================
export async function savePortfolioToFirestore(portfolio: UserPortfolio): Promise<void> {
  const path = `portfolios/${portfolio.id}`;
  try {
    const docRef = doc(db, 'portfolios', portfolio.id);
    await setDoc(docRef, portfolio, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function getUserPortfoliosFromFirestore(userId: string): Promise<UserPortfolio[]> {
  const path = 'portfolios';
  try {
    const q = query(collection(db, 'portfolios'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as UserPortfolio);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

// ==========================================
// PRODUCE LISTINGS OPERATIONS
// ==========================================
export async function saveListingToFirestore(listing: ProduceListing): Promise<void> {
  const path = `produce_listings/${listing.id}`;
  try {
    const docRef = doc(db, 'produce_listings', listing.id);
    await setDoc(docRef, listing, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function getListingsFromFirestore(): Promise<ProduceListing[]> {
  const path = 'produce_listings';
  try {
    const snap = await getDocs(collection(db, 'produce_listings'));
    return snap.docs.map((d) => d.data() as ProduceListing);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

// ==========================================
// ORDERS OPERATIONS
// ==========================================
export async function saveOrderToFirestore(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    const docRef = doc(db, 'orders', order.id);
    await setDoc(docRef, order, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function getUserOrdersFromFirestore(userId: string): Promise<Order[]> {
  const path = 'orders';
  try {
    const q = query(collection(db, 'orders'), where('buyerId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Order);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

// ==========================================
// NEGOTIATIONS OPERATIONS
// ==========================================
export async function saveNegotiationThreadToFirestore(thread: NegotiationThread): Promise<void> {
  const path = `negotiations/${thread.id}`;
  try {
    const docRef = doc(db, 'negotiations', thread.id);
    await setDoc(docRef, thread, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
