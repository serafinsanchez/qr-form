import { Storage } from '@google-cloud/storage'

// Upload a file buffer to GCS and return a public URL
export async function uploadImageToGCS(params: {
  file: File | Blob
  bucketName: string
  destination: string
}): Promise<string> {
  const { file, bucketName, destination } = params

  const exec = async () => {
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
      const encodedPath = destination
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/')
      return `https://storage.googleapis.com/${bucketName}/${encodedPath}`
    }

    const [signedUrl] = await fileRef.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    })
    return signedUrl
  }

  // Timeout after 12s
  return await Promise.race<string>([
    exec(),
    new Promise((_resolve, reject) => setTimeout(() => reject(new Error('GCS upload timeout')), 12000)) as Promise<string>,
  ])
}


