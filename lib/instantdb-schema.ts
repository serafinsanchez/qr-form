// InstantDB Schema Configuration
// This file defines the database schema for the QR form application

export const instantDBSchema = {
  submissions: {
    // Required fields
    timestamp: 'string',         // ISO timestamp of submission
    purchaseLocation: 'string',  // Where user purchased product
    npsScore: 'number',          // NPS rating (0-10)
    feedbackDetail: 'string',    // User feedback text
    skinConcern: 'string',       // Primary skin concern
    emailAddress: 'string',      // User email for loyalty program
    joinedLoyalty: 'boolean',    // Whether user joined loyalty program
    createdAt: 'number',         // Unix timestamp for sorting
    
    // Optional fields
    beforeUrl: 'string?',        // URL to before photo (optional)
    afterUrl: 'string?',         // URL to after photo (optional)
  }
}

// Type definitions for TypeScript support
export interface SubmissionRecord {
  id: string
  timestamp: string
  purchaseLocation: string
  npsScore: number
  feedbackDetail: string
  skinConcern: string
  emailAddress: string
  joinedLoyalty: boolean
  beforeUrl?: string | null
  afterUrl?: string | null
  createdAt: number
}

// Schema validation constants
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

export const NPS_RANGE = {
  MIN: 0,
  MAX: 10
} as const

// Instructions for setting up this schema in InstantDB dashboard:
/*
1. Go to your InstantDB dashboard
2. Navigate to the Schema section
3. Create a new collection called "submissions" 
4. Add the following attributes:
   - timestamp (string)
   - purchaseLocation (string) 
   - npsScore (number)
   - feedbackDetail (string)
   - skinConcern (string)
   - emailAddress (string)
   - joinedLoyalty (boolean)
   - beforeUrl (string, optional)
   - afterUrl (string, optional)
   - createdAt (number)
5. Set up appropriate indexes:
   - createdAt (descending) for chronological sorting
   - emailAddress for lookups
   - purchaseLocation for filtering
6. Configure permissions as needed for your use case
*/
