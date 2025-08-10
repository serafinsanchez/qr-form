export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { Storage } from '@google-cloud/storage'

function getExtensionFromFilename(filename?: string): string {
  if (!filename) return ''
  const idx = filename.lastIndexOf('.')
  if (idx === -1) return ''
  const ext = filename.slice(idx + 1).toLowerCase()
  return ext ? `.${ext}` : ''
}

function encodeGcsPath(path: string): string {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const filename: string | undefined = body?.filename
    const contentType: string | undefined = body?.contentType
    const kind: string | undefined = body?.kind

    if (!contentType) {
      return NextResponse.json({ message: 'contentType is required' }, { status: 400 })
    }

    const bucketName = process.env.GCS_BUCKET_NAME
    if (!bucketName) {
      return NextResponse.json({ message: 'GCS_BUCKET_NAME is not set' }, { status: 500 })
    }

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
      return NextResponse.json({ message: `GCS bucket not found: ${bucketName}` }, { status: 500 })
    }

    const uniqueId = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2, 10)
    const suffix = getExtensionFromFilename(filename)
    const base = kind && typeof kind === 'string' ? kind : 'image'
    const destination = `uploads/${base}_${Date.now()}_${uniqueId}${suffix}`

    const fileRef = bucket.file(destination)

    const [uploadUrl] = await fileRef.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      contentType,
    })

    let viewUrl: string
    const bucketIsPublic = process.env.GCS_PUBLIC_READ === 'true'
    if (bucketIsPublic) {
      viewUrl = `https://storage.googleapis.com/${bucketName}/${encodeGcsPath(destination)}`
    } else {
      const [signedReadUrl] = await fileRef.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      viewUrl = signedReadUrl
    }

    return NextResponse.json({ uploadUrl, viewUrl, objectPath: destination })
  } catch (error) {
    console.error('Signed URL error:', error)
    return NextResponse.json({ message: 'Failed to generate upload URL' }, { status: 500 })
  }
}