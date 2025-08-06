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
      ],
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:G', // Adjust range based on your sheet structure
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