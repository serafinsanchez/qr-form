export const runtime = 'nodejs'
export const maxDuration = 15
import { NextRequest, NextResponse } from 'next/server'
import { submitToGoogleSheets } from '@/lib/google-sheets'
import { formSchema } from '@/lib/validation'
import { FormSubmission } from '@/lib/types'
import { uploadImageToDrive } from '@/lib/google-drive'
import { uploadImageToGCS } from '@/lib/google-cloud-storage'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let payload: any
    let beforeUrl: string | null = null
    let afterUrl: string | null = null

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData()
      const purchaseLocation = String(form.get('purchaseLocation') || '')
      const npsScore = Number(form.get('npsScore') || 0)
      const feedbackDetail = String(form.get('feedbackDetail') || '')
      const skinConcern = String(form.get('skinConcern') || '')
      const emailAddress = String(form.get('emailAddress') || '')

      // Validate text fields
      const validatedData = formSchema.parse({
        purchaseLocation,
        npsScore,
        feedbackDetail,
        skinConcern,
        emailAddress,
      })

      // Optional image uploads to Drive/GCS
      const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
      const beforeFile = form.get('beforePhoto') as unknown as File | null
      const afterFile = form.get('afterPhoto') as unknown as File | null

      try {
        const useGCS = process.env.USE_GCS === 'true'
        const uploadBefore = async () => {
          if (beforeFile && typeof beforeFile === 'object' && (beforeFile as any).arrayBuffer) {
            if (useGCS) {
              const bucket = process.env.GCS_BUCKET_NAME
              if (!bucket) throw new Error('GCS_BUCKET_NAME is not set')
              beforeUrl = await uploadImageToGCS({
                file: beforeFile,
                bucketName: bucket,
                destination: `uploads/before_${Date.now()}.jpg`,
              })
            } else {
              beforeUrl = await uploadImageToDrive({
                file: beforeFile,
                filename: `before_${Date.now()}.jpg`,
                mimeType: (beforeFile as any).type || 'image/jpeg',
                folderId,
              })
            }
          }
        }
        const uploadAfter = async () => {
          if (afterFile && typeof afterFile === 'object' && (afterFile as any).arrayBuffer) {
            if (useGCS) {
              const bucket = process.env.GCS_BUCKET_NAME
              if (!bucket) throw new Error('GCS_BUCKET_NAME is not set')
              afterUrl = await uploadImageToGCS({
                file: afterFile,
                bucketName: bucket,
                destination: `uploads/after_${Date.now()}.jpg`,
              })
            } else {
              afterUrl = await uploadImageToDrive({
                file: afterFile,
                filename: `after_${Date.now()}.jpg`,
                mimeType: (afterFile as any).type || 'image/jpeg',
                folderId,
              })
            }
          }
        }

        // Run image uploads concurrently with an overall guard timeout
        await Promise.race([
          Promise.all([uploadBefore(), uploadAfter()]),
          new Promise((_r, reject) => setTimeout(() => reject(new Error('Image upload timeout')), 10000)),
        ])
      } catch (e) {
        console.warn('Image upload skipped or failed:', e)
      }

      payload = { ...validatedData }
    } else {
      const body = await request.json()
      // Validate form data
      const validatedData = formSchema.parse(body)
      payload = validatedData
    }
    
    // Create submission object
    const submission: FormSubmission = {
      timestamp: new Date().toISOString(),
      purchaseLocation: payload.purchaseLocation,
      npsScore: payload.npsScore,
      feedbackDetail: payload.feedbackDetail,
      skinConcern: payload.skinConcern,
      emailAddress: payload.emailAddress,
      joinedLoyalty: true, // Always true since they're submitting the form
      beforeUrl,
      afterUrl,
    }
    
    // Submit to Google Sheets
    await submitToGoogleSheets(submission)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your feedback!' 
    })
    
  } catch (error) {
    console.error('Form submission error:', error)
    
    if (error instanceof Error) {
      // Provide slightly clearer messages for common misconfigurations
      const msg = /Sheet ID not configured/i.test(error.message)
        ? 'Server is missing Google Sheet configuration.'
        : /invalid_grant|unauthorized|credentials/i.test(error.message)
        ? 'Server credentials are invalid or missing.'
        : error.message
      return NextResponse.json(
        { success: false, message: msg },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 