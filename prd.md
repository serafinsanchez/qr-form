# Product Requirements Document: Elysian Circle Post-Purchase Initiative

---

**Author:** Head of Sales & Growth  
**Stakeholders:** Marketing, Product Development, Engineering, Customer Experience  
**Date:** August 7, 2025  
**Version:** 1.0  
**Status:** In Review

---

## 1. Overview & Problem Statement

### 1.1 Overview

This document details the requirements for the "Elysian Circle" post-purchase initiative. The project centers on a seamless digital experience initiated by a QR code on the packaging of the new "Radiant C Serum." Scanning the code leads customers to a visually rich landing page and a conversational, Typeform-style feedback form. The main objectives are to:

- Gather actionable product insights
- Increase customer lifetime value (LTV) by enrolling users in our loyalty program
- Reinforce the premium, high-touch Elysian Fields brand experience

### 1.2 Problem Statement

There is a significant drop-off between first and second purchases. We currently lack a scalable, immediate way to collect high-quality feedback and convert satisfied first-time buyers into loyal advocates. This initiative aims to engage customers at their peak excitement—immediately after product use.

---

## 2. QR Code Implementation

### 2.1 QR Code Specifications

The QR code will be prominently displayed on the "Radiant C Serum" packaging and will serve as the primary entry point to the Elysian Circle experience.

**QR Code Details:**
- **URL:** `https://qr-form.vercel.app`
- **Format:** Standard QR Code (QR Code Model 2)
- **Error Correction Level:** M (Medium - 15% recovery capacity)
- **Size:** Minimum 2.5cm x 2.5cm for optimal scanning
- **Colors:** Black QR code on white background for maximum contrast and readability

**QR Code Placement:**
- **Primary Location:** Product packaging insert (card stock)
- **Secondary Location:** Product box exterior (if space permits)
- **Digital Reinforcement:** Landing page will also display the QR code for easy sharing

**Cross-Platform Functionality:**
- **Mobile Devices:** Direct scan-to-navigate functionality
- **Desktop Users:** Clickable hyperlink for manual navigation
- **Fallback:** URL is human-readable and can be typed manually if needed

### 2.2 QR Code Generation & Management

**Technical Requirements:**
- Generate QR code using a reliable QR code generation service
- Ensure the URL is short and memorable
- Test QR code readability across various devices and lighting conditions
- Include brand logo overlay option for enhanced visual appeal

**Quality Assurance:**
- Test scanning with multiple QR code reader apps
- Verify functionality across iOS and Android devices
- Ensure proper redirect handling for both mobile and desktop users

---

## 3. Goals & Success Metrics

| Goal                           | Key Success Metric                                      | Target                        |
|---------------------------------|--------------------------------------------------------|-------------------------------|
| Gather Product Insights         | Achieve high Net Promoter Score (NPS)                  | Average NPS of +50            |
|                                 | Collect positive testimonials for marketing            | 500+ unique testimonials (Q1) |
| Increase Customer LTV           | High form submission rate from purchasers              | 15% submission rate           |
|                                 | Convert submitters to loyalty program members          | 60% opt-in rate               |
| Reinforce Brand Experience      | Premium, fast, seamless user journey                   | Page load < 2 seconds         |

---

## 4. Target Audience

Our core customer is a discerning individual aged 28–55 with high disposable income. They are digitally savvy, active on Instagram and Pinterest, and value brand aesthetics, scientific credibility, and flawless user experience. They expect luxury and seamlessness in every brand interaction.

---

## 5. User Flow

1. **Purchase & Unboxing:** Customer buys "Radiant C Serum" and finds a QR code insert in the packaging.
2. **Scan QR Code:** Customer scans the QR code with their mobile device.
3. **Landing Page:** Redirected to a mobile-optimized, visually stunning landing page with the Elysian Fields logo, a compelling headline, and a prominent QR code (for digital reinforcement).
4. **Initiate Form:** User taps "Begin" or is auto-directed to the feedback form.
5. **Complete Form:** User answers questions one at a time in a conversational, Typeform-style interface.
6. **Submit & Confirmation:** User sees a thank-you message confirming entry and loyalty program enrollment. An automated email is sent.
7. **Data Capture:** Submission data is instantly added as a new row in a designated Google Sheet for analysis.

---

## 6. Feature Requirements

### 6.1 QR Code Landing Page

- **Aesthetic:** Minimalist, elegant, and luxurious (inspired by Aesop and Tatcha)
- **Visuals:**
  - Slow-motion video background (product texture or key botanicals)
  - Color palette: soft blush, cream, gold foil accents
  - Subtle Elysian Fields logo at the top
- **Content:**
  - Headline: _"Your Journey to Radiance Continues."_
  - Sub-headline: _"Thank you for welcoming us into your ritual. Scan the code below to share your experience and unlock an exclusive gift for your next purchase."_
- **Functionality:**
  - Fully responsive, mobile-first
  - Clear call-to-action button ("Begin" or similar) to start the form

### 6.2 Feedback & Loyalty Form (Typeform Clone)

- **UI/UX:**
  - Identical to Typeform experience
  - One question at a time
  - Clean, minimalist design with smooth transitions
  - Fully responsive, mobile-first
- **Form Logic & Questions:**
  1. **Purchase Location:**  
     _"Where did you purchase your Radiant C Serum?"_  
     (Multiple Choice: ElysianFields.com, Sephora, Bergdorf Goodman, Other)
  2. **NPS:**  
     _"On a scale of 0-10, how likely are you to recommend the Radiant C Serum to a friend?"_  
     (NPS Scale Input)
  3. **Conditional Feedback:**
     - **Negative/Neutral (NPS ≤ 6):**  
       _"We're truly sorry to hear that. We value your feedback above all and would love to learn more so we can make it right."_  
       (Long Text Input)
     - **Passive (NPS 7–8):**  
       _"We're so pleased you're enjoying it! What's one thing you think we could improve?"_  
       (Long Text Input)
     - **Positive/Testimonial (NPS 9–10):**  
       _"We are thrilled! What specific results or aspects of the serum did you love the most?"_  
       (Long Text Input)
  4. **Personalization:**  
     _"To better personalize your journey, what is your primary skin concern?"_  
     (Multiple Choice: Hydration, Fine Lines & Wrinkles, Dark Spots & Hyperpigmentation, Firmness)
  5. **Loyalty Opt-in:**  
     _"Become a member of the Elysian Circle. You'll receive early access to new formulas, complimentary shipping, and a special gift on your birthday. Please enter your email to join."_  
     (Email Input)
- **Post-Submission:**  
  Confirmation screen: _"Thank you, your insights are invaluable to us. A confirmation and your exclusive gift are on their way to your inbox. Welcome to the Circle."_

### 6.3 Data Handling & Integration

- **Backend:** Securely transmit form submissions to a Google Cloud function
- **Data Storage:** Google Cloud function writes data to a designated Google Sheet
- **Google Sheet Format:** Each submission is a new row with columns:  
  `Timestamp`, `Purchase_Location`, `NPS_Score`, `Feedback_Detail`, `Skin_Concern`, `Email_Address`, `Joined_Loyalty`
- **Data Validation:**
  - `Email_Address` must be a valid email format (e.g., user@example.com)
  - `NPS_Score` must be an integer between 0 and 10

---

## 7. Non-Functional Requirements

| Category    | Requirement                                                                                  |
|-------------|---------------------------------------------------------------------------------------------|
| Security    | End-to-end SSL encryption. GDPR & CCPA compliance. Secure, least-privilege API service accounts. |
| Performance | Landing page and form must load in under 2 seconds on a standard 4G connection.              |
| Scalability | Vercel and Google Cloud must handle several thousand concurrent users, especially post-launch.|
| Usability   | Experience must be intuitive, instruction-free, and flawless on all modern iOS/Android devices and browsers. |

---

## 8. Assumptions & Constraints

- **Assumptions:** Customers have a mobile device with a camera for QR scanning.
- **Constraints:**  
  - V1 uses Google Sheets as the backend for speed to market  
  - Direct CRM integration is out of scope for V1  
  - Project must use Cursor AI, Vercel (hosting), and Google Cloud Platform (backend/data)

---

## 9. Future Considerations (V2)

- **CRM Integration:** Direct API integration with Klaviyo to trigger personalized email journeys based on NPS and skin concerns
- **A/B Testing:** Add A/B testing for landing page (headlines, visuals) and form (question order, wording) to optimize conversion
- **Personalized Post-Submission Content:** Show dynamic confirmation content based on user feedback, e.g., skincare tips for their concerns