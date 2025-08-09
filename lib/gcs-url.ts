// Convert a storage URL to a viewable URL suitable for <img src>.
// Supports GCS public or signed URLs and normalizes Google Drive links.
export function getViewUrlForGcs(url: string): string {
  if (!url) return url
  try {
    const parsed = new URL(url)

    // If already a signed GCS URL, return as-is
    if (parsed.searchParams.get('X-Goog-Algorithm')) {
      return url
    }

    const host = parsed.hostname

    // Handle Google Drive variants and normalize to uc?export=view&id=FILE_ID
    if (
      host.endsWith('drive.google.com') ||
      host.endsWith('docs.google.com')
    ) {
      // If already uc?export=view&id=...
      const idFromParam = parsed.searchParams.get('id')
      if (idFromParam) {
        return `https://drive.google.com/uc?export=view&id=${idFromParam}`
      }
      // Match /file/d/{id}/...
      const match = parsed.pathname.match(/\/file\/d\/([^/]+)\//)
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`
      }
      // Fallback to original if we cannot extract id
      return url
    }

    // Public GCS object: storage.googleapis.com/<bucket>/<path> or <bucket>.storage.googleapis.com
    if (
      host === 'storage.googleapis.com' ||
      host.endsWith('.storage.googleapis.com')
    ) {
      return url
    }

    // Otherwise, return as-is
    return url
  } catch {
    return url
  }
}


