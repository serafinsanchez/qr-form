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

type FormStep = 'purchase-location' | 'nps' | 'feedback' | 'skin-concern' | 'email' | 'confirmation'

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState<FormStep>('purchase-location')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [npsScore, setNpsScore] = useState<number | null>(null)

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
    const steps: FormStep[] = ['purchase-location', 'nps', 'feedback', 'skin-concern', 'email', 'confirmation']
    const currentIndex = steps.indexOf(currentStep)
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const steps: FormStep[] = ['purchase-location', 'nps', 'feedback', 'skin-concern', 'email', 'confirmation']
    const currentIndex = steps.indexOf(currentStep)
    
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const onSubmit = async (data: FormSchema) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setCurrentStep('confirmation')
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'purchase-location':
        return (
          <FormQuestion
            title="Where did you purchase your Radiant C Serum?"
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
            title="On a scale of 0-10, how likely are you to recommend the Radiant C Serum to a friend?"
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

      case 'skin-concern':
        return (
          <FormQuestion
            title="To better personalize your journey, what is your primary skin concern?"
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
            title="Become a member of the Elysian Circle. You'll receive early access to new formulas, complimentary shipping, and a special gift on your birthday. Please enter your email to join."
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