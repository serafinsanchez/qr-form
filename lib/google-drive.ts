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

  const exec = async () => {
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

    await drive.permissions.create({
      fileId,
      supportsAllDrives: true,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    })

    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }

  // Timeout after 12s
  return await Promise.race<string>([
    exec(),
    new Promise((_resolve, reject) => setTimeout(() => reject(new Error('Drive upload timeout')), 12000)) as Promise<string>,
  ])
}

// Removed custom BufferToStream in favor of built-in Readable.from


