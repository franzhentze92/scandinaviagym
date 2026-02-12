-- ============================================
-- SUPABASE STORAGE SETUP FOR AVATARS
-- ============================================

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;

-- Create policy to allow authenticated users to upload their own avatars
-- The path format is: {userId}/{filename} (bucket name is 'avatars')
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (name LIKE auth.uid()::text || '/%')
);

-- Create policy to allow authenticated users to update their own avatars
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (name LIKE auth.uid()::text || '/%')
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND (name LIKE auth.uid()::text || '/%')
);

-- Create policy to allow authenticated users to delete their own avatars
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (name LIKE auth.uid()::text || '/%')
);

-- Create policy to allow public read access to avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

