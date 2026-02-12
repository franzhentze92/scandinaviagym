import { supabase } from '@/lib/supabase';

/**
 * Upload user avatar image to Supabase Storage
 * @param userId - User ID
 * @param file - Image file to upload
 * @returns Public URL of the uploaded image or null if error
 */
export const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La imagen debe ser menor a 5MB');
    }

    // Create file path: {userId}/{timestamp}.{ext}
    // Note: The bucket name is 'avatars', so the path should be just the folder and filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Replace if exists
      });

    if (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }

    // Get public URL (filePath is already {userId}/{filename})
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    console.error('Error in uploadAvatar:', error);
    throw error;
  }
};

/**
 * Delete user avatar from Supabase Storage
 * @param userId - User ID
 * @param filePath - Path to the file to delete
 */
export const deleteAvatar = async (userId: string, filePath: string): Promise<void> => {
  try {
    // Extract path from full URL if needed
    const path = filePath.includes('avatars/') 
      ? filePath.split('avatars/')[1] 
      : filePath;

    const { error } = await supabase.storage
      .from('avatars')
      .remove([`avatars/${userId}/${path}`]);

    if (error) {
      console.error('Error deleting avatar:', error);
      throw error;
    }
  } catch (error: any) {
    console.error('Error in deleteAvatar:', error);
    throw error;
  }
};

