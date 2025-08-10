# Elysian Circle QR Form

A beautiful, Typeform-style feedback collection system for Elysian Fields' post-purchase initiative. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Elegant Design**: Minimalist, luxury aesthetic inspired by Aesop and Tatcha
- 📱 **Mobile-First**: Fully responsive design optimized for mobile devices
- 🔄 **Typeform Experience**: One question at a time with smooth transitions
- 📊 **NPS Collection**: Interactive Net Promoter Score scale
- 📧 **Google Sheets Integration**: Automatic data collection and storage
- 🎯 **Loyalty Program**: Seamless enrollment in Elysian Circle
- ⚡ **Fast Performance**: Optimized for sub-2-second load times

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Backend**: Google Sheets API
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Cloud Project with Sheets API enabled
- Google Service Account with Sheets permissions

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qr-form
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Google Cloud credentials:
   ```env
   GOOGLE_PROJECT_ID=your-project-id
   GOOGLE_PROJECT_NUMBER=your-project-number
   GOOGLE_SHEET_ID=your-sheet-id
   GOOGLE_CLIENT_EMAIL=your-service-account-email
   GOOGLE_PRIVATE_KEY="your-private-key"
   GCS_BUCKET_NAME=your-gcs-bucket-name
   GCS_PUBLIC_READ=true
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Google Sheets Setup

1. **Create a Google Sheet** with the following columns:
   - A: Timestamp
   - B: Purchase_Location
   - C: NPS_Score
   - D: Feedback_Detail
   - E: Skin_Concern
   - F: Email_Address
   - G: Joined_Loyalty

2. **Share the sheet** with your service account email (read/write permissions)

3. **Copy the Sheet ID** from the URL and add it to your environment variables

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Set up custom domain** (optional)
   - Configure `qr-form.vercel.app` or your custom domain

### Environment Variables for Production

Make sure to set these in your Vercel project settings:

- `GOOGLE_PROJECT_ID`
- `GOOGLE_PROJECT_NUMBER`
- `GOOGLE_SHEET_ID`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GCS_BUCKET_NAME`
- `GCS_PUBLIC_READ`

## Project Structure

```
qr-form/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── form/              # Form page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ConfirmationScreen.tsx
│   ├── FormQuestion.tsx
│   └── NPSScale.tsx
├── lib/                   # Utilities and types
│   ├── google-sheets.ts   # Google Sheets API
│   ├── types.ts           # TypeScript types
│   └── validation.ts      # Zod schemas
├── public/                # Static assets
└── prd.md                # Product Requirements Document
```

## Form Flow

1. **Landing Page** (`/`) - Elegant introduction with QR code display
2. **Purchase Location** - Where customer bought the product
3. **NPS Score** - Interactive 0-10 scale
4. **Feedback** - Contextual question based on NPS score
5. **Skin Concern** - Primary skincare concern selection
6. **Email Collection** - Loyalty program enrollment
7. **Confirmation** - Success screen with benefits overview

## Customization

### Colors and Branding

Update the design tokens in `tailwind.config.js`:

```javascript
colors: {
  primary: { /* Your brand colors */ },
  cream: { /* Neutral tones */ },
  gold: { /* Accent colors */ },
  blush: { /* Secondary colors */ }
}
```

### Form Questions

Modify questions in `app/form/page.tsx` and update the validation schema in `lib/validation.ts`.

### Google Sheets Structure

Adjust the column mapping in `lib/google-sheets.ts` if your sheet structure differs.

## Performance Optimization

- **Images**: Optimized with Next.js Image component
- **Fonts**: Google Fonts with font-display: swap
- **Animations**: Hardware-accelerated with Framer Motion
- **Bundle**: Tree-shaking and code splitting enabled

## Security

- **Environment Variables**: Sensitive data stored securely
- **Input Validation**: Zod schema validation on all form inputs
- **CORS**: Configured for production domains
- **Rate Limiting**: Consider implementing for production

## Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Google Sheets**: Real-time data collection
- **Error Tracking**: Consider adding Sentry for production

## Support

For questions or issues, please refer to the PRD document or contact the development team.

## License

This project is proprietary to Elysian Fields. 