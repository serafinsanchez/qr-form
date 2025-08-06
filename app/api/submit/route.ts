import { NextRequest, NextResponse } from 'next/server'
import { submitToGoogleSheets } from '@/lib/google-sheets'
import { formSchema } from '@/lib/validation'
import { FormSubmission } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate form data
    const validatedData = formSchema.parse(body)
    
    // Create submission object
    const submission: FormSubmission = {
      timestamp: new Date().toISOString(),
      purchaseLocation: validatedData.purchaseLocation,
      npsScore: validatedData.npsScore,
      feedbackDetail: validatedData.feedbackDetail,
      skinConcern: validatedData.skinConcern,
      emailAddress: validatedData.emailAddress,
      joinedLoyalty: true, // Always true since they're submitting the form
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