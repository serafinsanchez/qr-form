import { z } from 'zod'

export const formSchema = z.object({
  purchaseLocation: z.string().min(1, 'Please select a purchase location'),
  npsScore: z.number().min(0).max(10).int('NPS score must be a whole number between 0 and 10'),
  feedbackDetail: z.string().min(1, 'Please provide your feedback'),
  skinConcern: z.string().min(1, 'Please select your primary skin concern'),
  emailAddress: z.string().email('Please enter a valid email address'),
})

export type FormSchema = z.infer<typeof formSchema> 