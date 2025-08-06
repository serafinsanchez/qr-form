'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Info } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import AboutModal from '@/components/AboutModal'

export default function LandingPage() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-50 to-blush-50"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
              <span className="text-2xl font-serif font-semibold text-primary-600">EF</span>
            </div>
            <h1 className="text-sm font-medium text-gray-600 tracking-wider uppercase">
              Elysian Fields
            </h1>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-gray-900 mb-6 leading-tight"
          >
            Your Journey to Radiance
            <span className="block text-primary-600">Continues</span>
          </motion.h2>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Thank you for welcoming us into your ritual. Share your experience and unlock an exclusive gift for your next purchase.
          </motion.p>

          {/* QR Code Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-2xl shadow-lg p-4 mb-4">
              <Image
                src="/qr-code.png"
                alt="QR Code to share your experience"
                width={96}
                height={96}
                className="w-24 h-24"
                priority
              />
            </div>
            <p className="text-sm text-gray-600">Scan to share your experience</p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Link
              href="/form"
              className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              Begin Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute top-10 left-10 w-20 h-20 border border-gold-300 rounded-full opacity-30"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="absolute bottom-10 right-10 w-16 h-16 border border-primary-300 rounded-full opacity-30"
          />
        </motion.div>
      </div>

      {/* About This App Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
      >
        <button
          onClick={() => setIsAboutModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white/90"
        >
          <Info className="w-4 h-4" />
          About This App
        </button>
      </motion.div>

      {/* About Modal */}
      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
    </div>
  )
} 