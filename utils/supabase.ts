import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string | undefined = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey: string | undefined =
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
