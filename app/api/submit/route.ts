import { NextRequest, NextResponse } from 'next/server'
import { submitToInstantDB, uploadImageToInstantDB } from '@/lib/instantdb-server'
import { formSchema } from '@/lib/validation'
import { FormSubmission } from '@/lib/types'

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

      // Optional image uploads to InstantDB
      const beforeFile = form.get('beforePhoto') as unknown as File | null
      const afterFile = form.get('afterPhoto') as unknown as File | null

      try {
        if (beforeFile && typeof beforeFile === 'object' && (beforeFile as any).arrayBuffer) {
          beforeUrl = await uploadImageToInstantDB({
            file: beforeFile,
            filename: `before_${Date.now()}.jpg`,
          })
        }
        if (afterFile && typeof afterFile === 'object' && (afterFile as any).arrayBuffer) {
          afterUrl = await uploadImageToInstantDB({
            file: afterFile,
            filename: `after_${Date.now()}.jpg`,
          })
        }
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
    
    // Submit to InstantDB
    await submitToInstantDB(submission)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your feedback!' 
    })
    
  } catch (error) {
    console.error('Form submission error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}