// backend/utils/cache.js
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL

async function getCache(supabase, key) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('cache')
    .select('value, expires_at')
    .eq('key', key)
    .single();

  if (error || !data) return null;

  if (new Date(data.expires_at).getTime() > Date.now()) {
    return data.value;
  } else {
    // Expired - optionally delete
    await supabase.from('cache').delete().eq('key', key);
    return null;
  }
}

async function setCache(supabase, key, value) {
  const expiresAt = new Date(Date.now() + CACHE_TTL_MS).toISOString();
  const { error } = await supabase.from('cache').upsert({
    key,
    value,
    expires_at: expiresAt,
  });

  if (error) console.error('Cache set failed:', error.message);
}

module.exports = {
  getCache,
  setCache,
};
