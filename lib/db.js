import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function insertResponse(data) {
  const { data: result, error } = await supabase
    .from('responses')
    .insert([data])
    .select('id')
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(error.message);
  }
  return result.id;
}

export async function getResponses() {
  const { data: rows, error } = await supabase
    .from('responses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch error:', error);
    throw new Error(error.message);
  }
  return rows || [];
}
