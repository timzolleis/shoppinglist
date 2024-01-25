import { supabase } from '~/utils/supabase/client.server';
import { User } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';

export async function uploadProfileImage(file: File) {
  const contentType = file.type;
  const fileName = `image_${createId()}`;
  const { error } = await supabase.storage
    .from('avatars')
    .upload(`${fileName}`, file, {
      contentType,
      upsert: true
    });
  if (error) {
    console.log(error);
    return undefined;
  }
  return fileName;
}

export async function getProfileImage(user: User) {
  const imageUrl = user.imageUrl;
  if (!imageUrl) {
    return undefined;
  }
  const { data, error } = await supabase.storage
    .from('avatars')
    .download(imageUrl);
  return data;
}


export async function createBucket() {
  const { data, error } = await supabase
    .storage
    .listBuckets();
  if (error) {
    console.log(error);
  }
}