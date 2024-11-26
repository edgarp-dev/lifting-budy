import { createClient, SupabaseClient as SupabaseLibraryClient } from "jsr:@supabase/supabase-js@2";

export default class SupabaseClient {
    private static client: SupabaseLibraryClient;

    public static getClient(): SupabaseLibraryClient {
        if (!SupabaseClient.client) {
            const supabaseUrl = <string> Deno.env.get("SUPABASE_URL");
            const supabaseAnonKey = <string>Deno.env.get("SUPABASE_ANON_KEY");
            
            SupabaseClient.client = createClient(supabaseUrl, supabaseAnonKey);
        }

        return SupabaseClient.client;
    }
}
