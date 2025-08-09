import { google } from 'googleapis'
import { Readable } from 'stream'

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.file'],
})

const drive = google.drive({ version: 'v3', auth })

export async function uploadImageToDrive(params: {
  file: File | Blob
  filename: string
  mimeType: string
  folderId?: string
}): Promise<string> {
  const { file, filename, mimeType, folderId } = params

  // Convert to readable stream for googleapis
  const buffer = Buffer.from(await file.arrayBuffer())

  const createRes = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name: filename,
      parents: folderId ? [folderId] : undefined,
      mimeType,
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: 'id',
  })

  const fileId = createRes.data.id
  if (!fileId) throw new Error('Failed to upload image to Drive')

  // Make file link-shareable (anyone with link can view)
  await drive.permissions.create({
    fileId,
    supportsAllDrives: true,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  })

  // Return an embed-friendly URL that renders inline in <img>
  // Example: https://drive.google.com/uc?export=view&id=<FILE_ID>
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

// Removed custom BufferToStream in favor of built-in Readable.from


