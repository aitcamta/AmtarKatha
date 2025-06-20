// firebaseStorageHelper.js
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  updateMetadata,
} from '@react-native-firebase/storage';
import {Platform} from 'react-native';
import uuid from 'react-native-uuid';
import mime from 'react-native-mime-types';

// Get the storage instance
const storage = getStorage();

/**
 * Upload a file to Firebase Storage
 * @param {string} localUri - Local file URI
 * @param {string} storagePath - Storage path (e.g., 'profile-images/')
 * @param {Object} [metadata] - Optional file metadata
 * @param {function} [progressCallback] - Upload progress callback
 * @returns {Promise<{downloadURL: string, ref: any, metadata: Object}>}
 */
export const uploadFile = async (
  localUri,
  storagePath,
  metadata = {},
  progressCallback,
) => {
  try {
    // Generate unique filename
    const fileExtension = localUri.split('.').pop() || 'bin';
    const fileName = `${uuid.v4()}.${fileExtension}`;
    const storageRef = ref(storage, storagePath);

    // Process Android URIs
    const processedUri =
      Platform.OS === 'android' ? localUri.replace('file://', '') : localUri;

    // Determine MIME type
    const mimeType = mime.lookup(processedUri) || 'application/octet-stream';

    // Set metadata
    const fullMetadata = {
      ...metadata,
      contentType: mimeType,
    };

    // Convert file to blob
    const response = await fetch(processedUri);
    const blob = await response.blob();

    // Upload with progress tracking
    const uploadTask = uploadBytes(storageRef, blob, fullMetadata);

    if (progressCallback) {
      uploadTask.on('state_changed', snapshot => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressCallback(Math.round(percent));
      });
    }

    await uploadTask;
    const downloadURL = await getDownloadURL(storageRef);

    return {
      downloadURL,
      ref: storageRef,
      metadata: fullMetadata,
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

/**
 * Update file metadata
 * @param {string|any} fileRef - File reference or path
 * @param {Object} newMetadata - New metadata
 * @returns {Promise<Object>} Updated metadata
 */
export const updateFileMetadata = async (fileRef, newMetadata) => {
  try {
    const reference =
      typeof fileRef === 'string' ? ref(storage, fileRef) : fileRef;

    const updatedMetadata = {
      ...(await reference.getMetadata()),
      ...newMetadata,
      contentType:
        newMetadata.contentType || (await reference.getMetadata()).contentType,
    };

    await updateMetadata(reference, updatedMetadata);
    return updatedMetadata;
  } catch (error) {
    console.error('Metadata update error:', error);
    throw error;
  }
};

/**
 * Delete a file
 * @param {string|any} fileRef - File reference or path
 * @returns {Promise<void>}
 */
export const deleteFile = async fileRef => {
  try {
    const reference =
      typeof fileRef === 'string' ? ref(storage, fileRef) : fileRef;

    await deleteObject(reference);
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
 * Get file download URL
 * @param {string|any} fileRef - File reference or path
 * @returns {Promise<string>}
 */
export const getFileUrl = async fileRef => {
  try {
    const reference =
      typeof fileRef === 'string' ? ref(storage, fileRef) : fileRef;

    return await getDownloadURL(reference);
  } catch (error) {
    console.error('Get file URL error:', error);
    throw error;
  }
};

/**
 * Extract storage path from download URL
 * @param {string} downloadURL - Full download URL
 * @returns {string} Storage path
 */
export const getPathFromUrl = downloadURL => {
  try {
    const basePath = decodeURIComponent(downloadURL.split('/o/')[1]);
    return basePath.split('?')[0];
  } catch (error) {
    console.error('Error parsing URL:', error);
    throw new Error('Invalid download URL');
  }
};
