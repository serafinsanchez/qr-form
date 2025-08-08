import { Storage } from '@google-cloud/storage'

// Upload a file buffer to GCS and return a public URL
export async function uploadImageToGCS(params: {
  file: File | Blob
  bucketName: string
  destination: string
}): Promise<string> {
  const { file, bucketName, destination } = params

  const storage = new Storage({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    projectId: process.env.GOOGLE_PROJECT_ID,
  })

  const bucket = storage.bucket(bucketName)
  const [exists] = await bucket.exists()
  if (!exists) {
    throw new Error(`GCS bucket not found: ${bucketName}`)
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileRef = bucket.file(destination)
  await fileRef.save(buffer, {
    resumable: false,
    contentType: (file as any).type || 'image/jpeg',
    metadata: {
      cacheControl: 'public, max-age=31536000, immutable',
    },
  })

  const bucketIsPublic = process.env.GCS_PUBLIC_READ === 'true'
  if (bucketIsPublic) {
    // With uniform bucket-level access enabled, make the bucket public via IAM:
    // grant roles/storage.objectViewer to allUsers at bucket level.
    // IMPORTANT: Do not encode slashes in the object path. Encode each segment instead.
    const encodedPath = destination
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/')
    return `https://storage.googleapis.com/${bucketName}/${encodedPath}`
  }

  // Private bucket: return a signed URL (V4), valid for 7 days
  const [signedUrl] = await fileRef.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
  })
  return signedUrl
}


