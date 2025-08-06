export interface FormData {
  purchaseLocation: string
  npsScore: number
  feedbackDetail: string
  skinConcern: string
  emailAddress: string
}

export interface FormSubmission {
  timestamp: string
  purchaseLocation: string
  npsScore: number
  feedbackDetail: string
  skinConcern: string
  emailAddress: string
  joinedLoyalty: boolean
}

export const PURCHASE_LOCATIONS = [
  'ElysianFields.com',
  'Sephora',
  'Bergdorf Goodman',
  'Other'
] as const

export const SKIN_CONCERNS = [
  'Hydration',
  'Fine Lines & Wrinkles',
  'Dark Spots & Hyperpigmentation',
  'Firmness'
] as const

export type PurchaseLocation = typeof PURCHASE_LOCATIONS[number]
export type SkinConcern = typeof SKIN_CONCERNS[number] 