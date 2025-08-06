import { motion } from 'framer-motion'

interface NPSScaleProps {
  value: number | null
  onChange: (score: number) => void
}

export default function NPSScale({ value, onChange }: NPSScaleProps) {
  const scores = Array.from({ length: 11 }, (_, i) => i)

  return (
    <div className="space-y-6">
      {/* Scale */}
      <div className="flex justify-between items-center gap-2">
        {scores.map((score) => (
          <motion.button
            key={score}
            onClick={() => onChange(score)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center font-medium text-lg transition-all duration-200
              ${value === score
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-cream-200 hover:bg-cream-300 text-gray-700 hover:text-gray-900'
              }
            `}
          >
            {score}
          </motion.button>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>Not at all likely</span>
        <span>Extremely likely</span>
      </div>

      {/* Selected Score Display */}
      {value !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-lg font-medium text-gray-900">
            You selected: <span className="text-primary-600">{value}</span>
          </p>
        </motion.div>
      )}
    </div>
  )
} 