const hits = new Map<string, number[]>();

export function rateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 60_000
): { allowed: boolean } {
  const now = Date.now();
  const timestamps = hits.get(ip) ?? [];

  // Remove expired entries
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= limit) {
    hits.set(ip, valid);
    return { allowed: false };
  }

  valid.push(now);
  hits.set(ip, valid);
  return { allowed: true };
}

// Cleanup stale IPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  hits.forEach((timestamps, ip) => {
    const valid = timestamps.filter((t) => now - t < 300_000);
    if (valid.length === 0) {
      hits.delete(ip);
    } else {
      hits.set(ip, valid);
    }
  });
}, 300_000);
