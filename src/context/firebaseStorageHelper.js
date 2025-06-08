// firebaseStorageHelper.js
import storage from '@react-native-firebase/storage';
import {Platform} from 'react-native';
import uuid from 'react-native-uuid'; // For generating unique filenames

/**
 * Upload a file to Firebase Storage
 * @param {string} localFilePath - Local file URI (e.g., from camera or file picker)
 * @param {string} storagePath - Firebase Storage path (e.g., 'images/home-slider/')
 * @param {Object} [metadata] - Optional file metadata
 * @returns {Promise<{downloadURL: string, ref: any, metadata: Object}>}
 */
export const uploadFile = async (localFilePath, storagePath, metadata = {}) => {
  try {
    // Generate unique filename
    const fileExtension = localFilePath.split('.').pop();
    const fileName = `${uuid.v4()}.${fileExtension}`;

    // Create reference with full path
    const fileRef = storage().ref(`${storagePath}${fileName}`);

    // Handle Android file URI format
    const processedUri =
      Platform.OS === 'android'
        ? localFilePath.replace('file://', '')
        : localFilePath;

    // Upload file
    const uploadTask = fileRef.putFile(processedUri, metadata);

    // Listen for state changes, errors, and completion
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null, // Omit progress handler for simplicity
        reject, // Error handler
        async () => {
          try {
            // Get download URL after successful upload
            const downloadURL = await fileRef.getDownloadURL();
            resolve({
              downloadURL,
              ref: fileRef,
              metadata: uploadTask.metadata,
            });
          } catch (error) {
            reject(error);
          }
        },
      );
    });
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param {string|any} fileRef - Either the full path (string) or reference object
 * @returns {Promise<void>}
 */
export const deleteFile = async fileRef => {
  try {
    const ref = typeof fileRef === 'string' ? storage().ref(fileRef) : fileRef;

    await ref.delete();
  } catch (error) {
    console.error('File deletion error:', error);
    throw error;
  }
};

/**
 * Delete multiple files
 * @param {Array<string|any>} fileRefs - Array of references or paths
 * @returns {Promise<void>}
 */
export const deleteFiles = async fileRefs => {
  try {
    await Promise.all(fileRefs.map(ref => deleteFile(ref)));
  } catch (error) {
    console.error('Multiple files deletion error:', error);
    throw error;
  }
};

/**
 * Get download URL for a file
 * @param {string|any} fileRef - Either the full path (string) or reference object
 * @returns {Promise<string>}
 */
export const getFileUrl = async fileRef => {
  try {
    const ref = typeof fileRef === 'string' ? storage().ref(fileRef) : fileRef;

    return await ref.getDownloadURL();
  } catch (error) {
    console.error('Get file URL error:', error);
    throw error;
  }
};
