'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema, type FormSchema } from '@/lib/validation'
import { PURCHASE_LOCATIONS, SKIN_CONCERNS } from '@/lib/types'
import NPSScale from '@/components/NPSScale'
import FormQuestion from '@/components/FormQuestion'
import ConfirmationScreen from '@/components/ConfirmationScreen'
import ImageDropZone from '@/components/ImageDropZone'

type FormStep = 'purchase-location' | 'nps' | 'feedback' | 'photos' | 'skin-concern' | 'email' | 'confirmation'

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState<FormStep>('purchase-location')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [npsScore, setNpsScore] = useState<number | null>(null)
  const [beforePhoto, setBeforePhoto] = useState<File | null>(null)
  const [afterPhoto, setAfterPhoto] = useState<File | null>(null)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchaseLocation: '',
      npsScore: 0,
      feedbackDetail: '',
      skinConcern: '',
      emailAddress: '',
    },
  })

  const watchedValues = watch()

  const getFeedbackQuestion = (score: number) => {
    if (score <= 6) {
      return "We're truly sorry to hear that. We value your feedback above all and would love to learn more so we can make it right."
    } else if (score <= 8) {
      return "We're so pleased you're enjoying it! What's one thing you think we could improve?"
    } else {
      return "We are thrilled! What specific results or aspects of the serum did you love the most?"
    }
  }

  const handleNext = () => {
    const steps: FormStep[] = ['purchase-location', 'nps', 'feedback', 'photos', 'skin-concern', 'email', 'confirmation']
    const currentIndex = steps.indexOf(currentStep)
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const steps: FormStep[] = ['purchase-location', 'nps', 'feedback', 'photos', 'skin-concern', 'email', 'confirmation']
    const currentIndex = steps.indexOf(currentStep)
    
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  async function uploadViaSignedUrl(file: File, kind: 'before' | 'after'): Promise<string> {
    const res = await fetch('/api/upload-url', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/octet-stream', kind }),
    })
    if (!res.ok) {
      try {
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          const data = await res.json()
          throw new Error(data?.message || 'Failed to get upload URL')
        } else {
          const text = await res.text()
          throw new Error(text || 'Failed to get upload URL')
        }
      } catch (e: any) {
        throw new Error(e?.message || 'Failed to get upload URL')
      }
    }
    const { uploadUrl, viewUrl } = await res.json()

    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'content-type': file.type || 'application/octet-stream' },
      body: file,
    })
    if (!putRes.ok) throw new Error('Upload failed')

    return viewUrl
  }

  const onSubmit = async (data: FormSchema) => {
    setIsSubmitting(true)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)
    try {
      let beforeUrl: string | undefined
      let afterUrl: string | undefined

      if (beforePhoto) {
        beforeUrl = await uploadViaSignedUrl(beforePhoto, 'before')
      }
      if (afterPhoto) {
        afterUrl = await uploadViaSignedUrl(afterPhoto, 'after')
      }

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          purchaseLocation: data.purchaseLocation,
          npsScore: data.npsScore,
          feedbackDetail: data.feedbackDetail,
          skinConcern: data.skinConcern,
          emailAddress: data.emailAddress,
          beforeUrl: beforeUrl || null,
          afterUrl: afterUrl || null,
        }),
        signal: controller.signal,
      })

      if (response.ok) {
        setCurrentStep('confirmation')
      } else {
        const status = response.status
        const contentType = response.headers.get('content-type') || ''
        let message = ''
        try {
          if (contentType.includes('application/json')) {
            const errorData = await response.json()
            message = errorData?.message || ''
          } else {
            const text = await response.text()
            message = text?.slice(0, 300)
          }
        } catch {}

        if (!message) {
          if (status === 413) message = 'Upload too large. Please use images under 4 MB each.'
          else if (status === 504) message = 'The server took too long to respond. Please try again.'
          else message = 'Something went wrong. Please try again.'
        }
        alert(message)
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        alert('Request timed out. Please try again.')
      } else {
        alert(error?.message || 'Something went wrong. Please try again.')
      }
    } finally {
      clearTimeout(timeoutId)
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'purchase-location':
        return (
          <FormQuestion
            title="Where did you purchase your Radiant Renewal Duo?"
            onNext={handleNext}
            canProceed={!!watchedValues.purchaseLocation}
          >
            <Controller
              name="purchaseLocation"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="form-select text-lg"
                  onChange={(e) => {
                    field.onChange(e)
                    if (e.target.value) handleNext()
                  }}
                >
                  <option value="">Select purchase location</option>
                  {PURCHASE_LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.purchaseLocation && (
              <p className="text-red-500 text-sm mt-2">{errors.purchaseLocation.message}</p>
            )}
          </FormQuestion>
        )

      case 'nps':
        return (
          <FormQuestion
            title="On a scale of 0-10, how likely are you to recommend our 14‑Day Radiant Renewal to a friend?"
            onNext={handleNext}
            canProceed={npsScore !== null}
          >
            <NPSScale
              value={npsScore}
              onChange={(score) => {
                setNpsScore(score)
                setValue('npsScore', score)
                setTimeout(handleNext, 500)
              }}
            />
          </FormQuestion>
        )

      case 'feedback':
        return (
          <FormQuestion
            title={getFeedbackQuestion(npsScore || 0)}
            onNext={handleNext}
            canProceed={!!watchedValues.feedbackDetail.trim()}
          >
            <Controller
              name="feedbackDetail"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="form-input min-h-[120px] resize-none"
                  placeholder="Share your thoughts..."
                  rows={4}
                />
              )}
            />
            {errors.feedbackDetail && (
              <p className="text-red-500 text-sm mt-2">{errors.feedbackDetail.message}</p>
            )}
          </FormQuestion>
        )

      case 'photos':
        return (
          <FormQuestion
            title="Share your journey: add your Before and After photos"
            onNext={handleNext}
            canProceed={true}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ImageDropZone
                label="Before photo"
                file={beforePhoto}
                onFileChange={setBeforePhoto}
              />
              <ImageDropZone
                label="After photo"
                file={afterPhoto}
                onFileChange={setAfterPhoto}
              />
            </div>
            <p className="text-xs text-gray-500 mt-4">
              By uploading images, you confirm you have rights to share them. We may use them for anonymized product research. Uploads are optional.
            </p>
          </FormQuestion>
        )

      case 'skin-concern':
        return (
          <FormQuestion
            title="To personalize your regimen, what is your primary skin concern?"
            onNext={handleNext}
            canProceed={!!watchedValues.skinConcern}
          >
            <Controller
              name="skinConcern"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="form-select text-lg"
                  onChange={(e) => {
                    field.onChange(e)
                    if (e.target.value) handleNext()
                  }}
                >
                  <option value="">Select your primary concern</option>
                  {SKIN_CONCERNS.map((concern) => (
                    <option key={concern} value={concern}>
                      {concern}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.skinConcern && (
              <p className="text-red-500 text-sm mt-2">{errors.skinConcern.message}</p>
            )}
          </FormQuestion>
        )

      case 'email':
        return (
          <FormQuestion
            title="Join the Elysian Circle for your Radiant Renewal recap and exclusive care tips. Enter your email to join."
            onNext={handleSubmit(onSubmit)}
            canProceed={!!watchedValues.emailAddress && !errors.emailAddress}
            isLoading={isSubmitting}
          >
            <Controller
              name="emailAddress"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  className="form-input text-lg"
                  placeholder="your@email.com"
                />
              )}
            />
            {errors.emailAddress && (
              <p className="text-red-500 text-sm mt-2">{errors.emailAddress.message}</p>
            )}
          </FormQuestion>
        )

      case 'confirmation':
        return <ConfirmationScreen />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/facewashing.png)' }}
      />
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      
      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-md shadow-sm border-b border-cream-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-serif font-semibold text-primary-600">EF</span>
            </div>
            <span className="text-sm font-medium text-gray-600">Elysian Fields</span>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
} 