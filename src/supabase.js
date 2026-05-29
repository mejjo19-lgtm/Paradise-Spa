import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://supabase.paradiseforce.com";
export const supabaseKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4MDAyNjY2MCwiZXhwIjo0OTM1NzAwMjYwLCJyb2xlIjoiYW5vbiJ9.MVa7ZGUVEFD2OYe4vko6tOwfzoTzEAboDlXckl2YQWU";

export const supabase = createClient(supabaseUrl, supabaseKey);