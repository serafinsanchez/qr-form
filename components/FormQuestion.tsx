import { motion } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'

interface FormQuestionProps {
  title: string
  children: React.ReactNode
  onNext: () => void
  canProceed: boolean
  isLoading?: boolean
}

export default function FormQuestion({ 
  title, 
  children, 
  onNext, 
  canProceed, 
  isLoading = false 
}: FormQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full"
    >
      {/* Question Title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 mb-8 leading-tight"
      >
        {title}
      </motion.h2>

      {/* Form Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        {children}
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-end"
      >
        <button
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${canProceed && !isLoading
              ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  )
} 