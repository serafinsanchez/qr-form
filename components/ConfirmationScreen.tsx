import { motion } from 'framer-motion'
import { CheckCircle, Gift, Heart } from 'lucide-react'
import Link from 'next/link'

export default function ConfirmationScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full text-center"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-3xl font-serif font-medium text-gray-900 mb-4"
      >
        Welcome to the Circle
      </motion.h2>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-lg text-gray-700 mb-8 leading-relaxed"
      >
        Thank you, your insights are invaluable to us. A confirmation and your exclusive gift are on their way to your inbox.
      </motion.p>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-cream-50 rounded-xl p-6 mb-8"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Elysian Circle Benefits:</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-primary-600 flex-shrink-0" />
            <span className="text-gray-700">Early access to new formulas</span>
          </div>
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-primary-600 flex-shrink-0" />
            <span className="text-gray-700">Complimentary shipping on all orders</span>
          </div>
          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-primary-600 flex-shrink-0" />
            <span className="text-gray-700">Special birthday gift</span>
          </div>
        </div>
      </motion.div>

      {/* Back to Home */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Return to Home
        </Link>
      </motion.div>
    </motion.div>
  )
} 