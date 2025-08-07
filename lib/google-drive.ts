import { google } from 'googleapis'

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
    requestBody: {
      name: filename,
      parents: folderId ? [folderId] : undefined,
      mimeType,
    },
    media: {
      mimeType,
      body: BufferToStream(buffer),
    },
    fields: 'id, webViewLink, webContentLink',
  })

  const fileId = createRes.data.id
  if (!fileId) throw new Error('Failed to upload image to Drive')

  // Make file link-shareable (anyone with link can view)
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  })

  const { data } = await drive.files.get({ fileId, fields: 'webViewLink, webContentLink' })
  return data.webViewLink || data.webContentLink || `https://drive.google.com/file/d/${fileId}/view`
}

function BufferToStream(buffer: Buffer) {
  const readable = new (require('stream').Readable)()
  readable._read = () => {}
  readable.push(buffer)
  readable.push(null)
  return readable
}


