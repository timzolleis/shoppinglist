import { supabase } from '~/utils/supabase/client.server';
import { User } from '@prisma/client';

export async function uploadProfileImage(user: User, file: File) {
  const contentType = file.type;
  const fileName = `user_${user.id}`;
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`${fileName}`, file, {
      contentType
    });
  if (error) {
    console.log(error);
  }
  return data;
}

export async function getProfileImage(user: User) {
  const fileName = `user_${user.id}`;
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
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