import { storage, ref, uploadBytes, getDownloadURL, deleteObject } from './firebase';

export interface UploadResult {
  url: string;
  path: string;
}

export const uploadAvatar = async (
  phoneNumber: string,
  imageUri: string
): Promise<UploadResult> => {
  try {
    // Create a reference to the avatar file
    const avatarRef = ref(storage, `avatars/${phoneNumber}/avatar.jpg`);
    
    // Convert image URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Upload the file
    const snapshot = await uploadBytes(avatarRef, blob);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      path: snapshot.ref.fullPath,
    };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw new Error('Failed to upload avatar');
  }
};

export const uploadGroupAvatar = async (
  groupId: string,
  imageUri: string
): Promise<UploadResult> => {
  try {
    // Create a reference to the group avatar file
    const avatarRef = ref(storage, `groups/${groupId}/avatar.jpg`);
    
    // Convert image URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Upload the file
    const snapshot = await uploadBytes(avatarRef, blob);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      path: snapshot.ref.fullPath,
    };
  } catch (error) {
    console.error('Error uploading group avatar:', error);
    throw new Error('Failed to upload group avatar');
  }
};

export const deleteAvatar = async (path: string): Promise<void> => {
  try {
    const avatarRef = ref(storage, path);
    await deleteObject(avatarRef);
  } catch (error) {
    console.error('Error deleting avatar:', error);
    throw new Error('Failed to delete avatar');
  }
};

export const deleteUserAvatar = async (phoneNumber: string): Promise<void> => {
  try {
    const avatarRef = ref(storage, `avatars/${phoneNumber}/avatar.jpg`);
    await deleteObject(avatarRef);
  } catch (error) {
    console.error('Error deleting user avatar:', error);
    // Don't throw error if file doesn't exist
    if (error instanceof Error && !error.message.includes('object-not-found')) {
      throw new Error('Failed to delete user avatar');
    }
  }
};

export const deleteGroupAvatar = async (groupId: string): Promise<void> => {
  try {
    const avatarRef = ref(storage, `groups/${groupId}/avatar.jpg`);
    await deleteObject(avatarRef);
  } catch (error) {
    console.error('Error deleting group avatar:', error);
    // Don't throw error if file doesn't exist
    if (error instanceof Error && !error.message.includes('object-not-found')) {
      throw new Error('Failed to delete group avatar');
    }
  }
};