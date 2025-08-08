import { google } from 'googleapis'
import { FormSubmission } from './types'

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })

export async function submitToGoogleSheets(data: FormSubmission): Promise<void> {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID
    if (!sheetId) {
      throw new Error('Google Sheet ID not configured')
    }

    const values = [
      [
        data.timestamp,
        data.purchaseLocation,
        data.npsScore,
        data.feedbackDetail,
        data.skinConcern,
        data.emailAddress,
        data.joinedLoyalty ? 'Yes' : 'No',
        data.beforeUrl || '',
        data.afterUrl || '',
      ],
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:I', // A:G + Before_URL (H) + After_URL (I)
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    })
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error)
    throw new Error('Failed to submit form data')
  }
} 

export async function fetchSubmissions(limit: number = 100): Promise<FormSubmission[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  if (!sheetId) {
    throw new Error('Google Sheet ID not configured')
  }

  const range = 'Sheet1!A:I'
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
    majorDimension: 'ROWS',
  })

  const rows = res.data.values || []
  // Assume the first row is header
  const dataRows = rows.slice(1).reverse().slice(0, limit) // latest first

  return dataRows.map((r) => ({
    timestamp: r[0] || '',
    purchaseLocation: r[1] || '',
    npsScore: Number(r[2] || 0),
    feedbackDetail: r[3] || '',
    skinConcern: r[4] || '',
    emailAddress: r[5] || '',
    joinedLoyalty: (r[6] || '').toLowerCase() === 'yes',
    beforeUrl: r[7] || null,
    afterUrl: r[8] || null,
  }))
}