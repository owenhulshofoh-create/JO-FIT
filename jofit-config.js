/* Public settings only. Supabase publishable / anon keys are public by design.
   Never put a service role key, OpenAI key or another secret in this file. */
window.JOFIT_CONFIG = Object.freeze({
  supabaseUrl: '',
  supabasePublishableKey: '',
  aiEnabled: false,
  foodSearchEnabled: false
});
