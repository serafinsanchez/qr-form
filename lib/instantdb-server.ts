import { init, tx, id } from '@instantdb/admin'
import type { FormSubmission } from './types'

// Server-side InstantDB client with admin token
const db = init({
  appId: process.env.INSTANTDB_PUBLIC_APP_ID!,
  adminToken: process.env.INSTANTDB_ADMIN_TOKEN!,
})

// Upload image to InstantDB file storage
export async function uploadImageToInstantDB(params: {
  file: File | Blob
  filename: string
}): Promise<string> {
  const { file, filename } = params

  try {
    // Convert File/Blob to ArrayBuffer then to Buffer for admin SDK
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Upload file to InstantDB using admin SDK
    const uploadResponse = await db.storage.uploadFile(filename, buffer, {
      contentType: file.type || 'image/jpeg',
    })
    
    // Query the uploaded file to get its metadata including URL
    const filesQuery = await db.query({
      $files: {
        $: {
          where: { path: filename }
        }
      }
    })
    
    if (filesQuery.$files && filesQuery.$files.length > 0) {
      const uploadedFile = filesQuery.$files[0]
      console.log('Successfully uploaded image to InstantDB:', filename)
      return uploadedFile.url
    }
    
    // Fallback if query fails
    console.log('Upload succeeded but could not retrieve URL for:', filename)
    return `https://storage.instantdb.com/${process.env.INSTANTDB_PUBLIC_APP_ID}/${filename}`
  } catch (error) {
    console.error('Error uploading to InstantDB:', error)
    
    // For now, log the error but continue with form submission
    // Return a placeholder URL so form submission doesn't fail
    console.warn('Falling back to placeholder URL for image:', filename)
    return `https://placeholder.instantdb.com/${filename}`
  }
}

// Submit form data to InstantDB
export async function submitToInstantDB(data: FormSubmission): Promise<void> {
  try {
    // Create submission with all required fields
    await db.transact([
      tx.submissions[id()].update({
        timestamp: data.timestamp,
        purchaseLocation: data.purchaseLocation,
        npsScore: data.npsScore,
        feedbackDetail: data.feedbackDetail,
        skinConcern: data.skinConcern,
        emailAddress: data.emailAddress,
        joinedLoyalty: data.joinedLoyalty,
        beforeUrl: data.beforeUrl || null,
        afterUrl: data.afterUrl || null,
        createdAt: Date.now()
      })
    ])
    
    console.log('Successfully submitted to InstantDB:', data.emailAddress)
  } catch (error) {
    console.error('Error submitting to InstantDB:', error)
    throw new Error('Failed to submit form data to database')
  }
}

// Fetch submissions from InstantDB
export async function fetchSubmissions(limit: number = 100): Promise<FormSubmission[]> {
  try {
    // Query submissions from InstantDB with ordering
    const query = await db.query({
      submissions: {
        $: {
          order: { createdAt: 'desc' },
          limit: limit
        }
      }
    })
    
    if (!query.submissions) {
      return []
    }
    
    // Map the submissions to match our FormSubmission interface
    const submissions = query.submissions.map((submission: any) => ({
      timestamp: submission.timestamp || '',
      purchaseLocation: submission.purchaseLocation || '',
      npsScore: submission.npsScore || 0,
      feedbackDetail: submission.feedbackDetail || '',
      skinConcern: submission.skinConcern || '',
      emailAddress: submission.emailAddress || '',
      joinedLoyalty: submission.joinedLoyalty || false,
      beforeUrl: submission.beforeUrl || null,
      afterUrl: submission.afterUrl || null,
    }))
    
    console.log(`Fetched ${submissions.length} submissions from InstantDB`)
    return submissions
  } catch (error) {
    console.error('Error fetching submissions from InstantDB:', error)
    // Don't throw error, just return empty array so admin page still loads
    console.warn('Returning empty array due to fetch error')
    return []
  }
}

export default db
