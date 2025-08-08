// Convert a GCS URL (public or signed) to a viewable URL. If it's already a signed URL, return as-is.
export function getViewUrlForGcs(url: string): string {
  try {
    const u = new URL(url)
    // Signed URL detection
    if (u.searchParams.get('X-Goog-Algorithm')) {
      return url
    }
    // Public object format: https://storage.googleapis.com/<bucket>/<path>
    // Just return it directly
    return url
  } catch {
    return url
  }
}


