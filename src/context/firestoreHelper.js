// firestoreHelper.js
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
} from '@react-native-firebase/firestore';

const db = getFirestore();

/**
 * Get single document with merged ID
 * @param {string} collectionName
 * @param {string} documentId
 * @returns {Promise<{ id: string, ...data } | null>}
 */
export const getDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? {id: docSnap.id, ...docSnap.data()} : null;
  } catch (error) {
    console.error('Firestore getDocument error:', error);
    throw error;
  }
};

/**
 * Get entire collection with merged IDs
 * @param {string} collectionName
 * @param {Array} conditions - Optional query conditions [['field', 'operator', value]]
 * @returns {Promise<Array<{ id: string, ...data }>>}
 */
export const getCollection = async (collectionName, conditions = []) => {
  try {
    let ref = collection(db, collectionName);

    // Apply query conditions if provided
    if (conditions.length > 0) {
      const queryConditions = conditions.map(cond => where(...cond));
      ref = query(ref, ...queryConditions);
    }

    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Firestore getCollection error:', error);
    throw error;
  }
};

/**
 * Create or overwrite document
 * @param {string} collectionName
 * @param {string} documentId
 * @param {Object} data
 */
export const setDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, data);
  } catch (error) {
    console.error('Firestore setDocument error:', error);
    throw error;
  }
};

/**
 * Update existing document
 * @param {string} collectionName
 * @param {string} documentId
 * @param {Object} updates
 */
export const updateDocument = async (collectionName, documentId, updates) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Firestore updateDocument error:', error);
    throw error;
  }
};

/**
 * Delete document
 * @param {string} collectionName
 * @param {string} documentId
 */
export const deleteDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Firestore deleteDocument error:', error);
    throw error;
  }
};

export const batchWrite = async operations => {
  const batch = writeBatch(db);
  operations.forEach(({type, collection, id, data}) => {
    const docRef = doc(db, collection, id);
    if (type === 'delete') batch.delete(docRef);
    if (type === 'update') batch.update(docRef, data);
    if (type === 'set') batch.set(docRef, data);
  });
  await batch.commit();
};
