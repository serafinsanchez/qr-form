'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Code, Zap, Shield } from 'lucide-react'

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">About This App</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Overview */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Overview</h3>
                <p className="text-gray-700 leading-relaxed">
                  This is a prototype application for "Elysian Fields," a fictional luxury skincare brand. The Elysian Circle QR form delivers a seamless, premium digital experience to capture post-purchase feedback and convert customers into loyalty program members. It features a Typeform-style interface that engages users immediately after using the Radiant C Serum.
                </p>
              </div>

              {/* Technical Stack */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary-600" />
                  Technical Stack
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Frontend</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Next.js 14 with React 18</li>
                      <li>• TypeScript for type safety</li>
                      <li>• Tailwind CSS with custom design tokens</li>
                      <li>• Mobile-first, fully responsive design</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Backend & Data</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Vercel for hosting and serverless functions</li>
                      <li>• Google Sheets API for data storage</li>
                      <li>• Google Cloud Functions for processing</li>
                      <li>• Real-time data capture and analysis</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Performance & Security */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  Performance & Security
                </h3>
                <div className="bg-primary-50 rounded-lg p-4">
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• <span className="font-medium">Load Time:</span> &lt; 2 seconds on 4G connections</li>
                    <li>• <span className="font-medium">Security:</span> HTTPS encryption, secure API authentication</li>
                    <li>• <span className="font-medium">Data Validation:</span> Server-side form validation and sanitization</li>
                    <li>• <span className="font-medium">Hosting:</span> Vercel (optimized for global performance)</li>
                    <li>• <span className="font-medium">Note:</span> This is a prototype - production would require additional privacy compliance</li>
                  </ul>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Interested in a customized or deployed version for your business?</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Contact Serafin Sanchez at{' '}
                  <a 
                    href="mailto:serafin.f.sanchez@gmail.com" 
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    serafin.f.sanchez@gmail.com
                  </a>
                  {' '}or text/call{' '}
                  <a 
                    href="tel:303-915-5489" 
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    303-915-5489
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 