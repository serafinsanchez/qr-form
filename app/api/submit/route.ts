export const runtime = 'nodejs'
export const maxDuration = 15
import { NextRequest, NextResponse } from 'next/server'
import { submitToGoogleSheets } from '@/lib/google-sheets'
import { formSchema } from '@/lib/validation'
import { FormSubmission } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, message: 'Multipart uploads are no longer supported. Please update the client.' },
        { status: 413 }
      )
    }

    const body = await request.json()

    const validatedData = formSchema.parse({
      purchaseLocation: String(body.purchaseLocation || ''),
      npsScore: Number(body.npsScore || 0),
      feedbackDetail: String(body.feedbackDetail || ''),
      skinConcern: String(body.skinConcern || ''),
      emailAddress: String(body.emailAddress || ''),
    })

    const beforeUrl: string | null = body.beforeUrl || null
    const afterUrl: string | null = body.afterUrl || null

    const submission: FormSubmission = {
      timestamp: new Date().toISOString(),
      purchaseLocation: validatedData.purchaseLocation,
      npsScore: validatedData.npsScore,
      feedbackDetail: validatedData.feedbackDetail,
      skinConcern: validatedData.skinConcern,
      emailAddress: validatedData.emailAddress,
      joinedLoyalty: true,
      beforeUrl,
      afterUrl,
    }

    await submitToGoogleSheets(submission)

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your feedback!' 
    })
    
  } catch (error) {
    console.error('Form submission error:', error)
    
    if (error instanceof Error) {
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