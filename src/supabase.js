import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://wxidykvtsggfvevzuubp.supabase.co";
export const supabaseKey = "sb_publishable_TKgCuZ0QmADF3tDxYR9H4w_wgfIEqm2";

export const supabase = createClient(supabaseUrl, supabaseKey);