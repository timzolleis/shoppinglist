import { createClient } from '@supabase/supabase-js';
import { env } from '~/utils/env/env.server';

// Create a single supabase client for interacting with your database
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {});