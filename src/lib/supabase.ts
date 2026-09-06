import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hgwabvgqxcefmisgahku.supabase.co';

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_Ozdn-G0e7AY93lnW-kLWxw_xAR47zLR';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Helper to upload user avatar or progress photos to Supabase Storage
 */
export async function uploadProgressPhoto(
  file: File,
  userId: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `progress-photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('fitpulse-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage
      .from('fitpulse-media')
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Upload failed' };
  }
}
