import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://toznyktjvrdbqsmajbvg.supabase.co";
const supabaseKey = "sb_publishable_8X_vPWMZM5EGwOLb1KMJlA_WPM-EJN-";

export const supabase = createClient(supabaseUrl, supabaseKey);
