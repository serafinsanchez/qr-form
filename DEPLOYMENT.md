# Deployment Guide - Elysian Circle QR Form

## Quick Deployment to Vercel

### 1. Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "feat: initial Elysian Circle QR form implementation with InstantDB"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/qr-form.git
   git branch -M main
   git push -u origin main
   ```

### 2. Set Up InstantDB

1. **Create InstantDB Account**:
   - Go to [instantdb.com](https://instantdb.com)
   - Sign up and create a new app named "QR-STORE"
   - Copy your App ID

2. **Get Admin Token**:
   - In your InstantDB dashboard, go to Settings
   - Generate an Admin Token for server-side operations
   - Keep this secure - it provides full access to your database

### 3. Deploy to Vercel

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your `qr-form` repository

2. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

3. **Add Environment Variables**:
   In the Vercel dashboard, go to Settings → Environment Variables and add:
   ```
   NEXT_PUBLIC_INSTANTDB_APP_ID=e8dd4dce-33da-481e-adce-d4e2eb1f0d55
   INSTANTDB_PUBLIC_APP_ID=e8dd4dce-33da-481e-adce-d4e2eb1f0d55
   INSTANTDB_ADMIN_TOKEN=your_instantdb_admin_token_here
   GITHUB_REPO=https://github.com/serafinsanchez/qr-form
   ```
   
   **Important**: Replace `your_instantdb_admin_token_here` with your actual admin token from InstantDB.

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be available at `https://qr-form.vercel.app`

### 3. Set Up Custom Domain (Optional)

1. **Add Domain**:
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `qr-form.elysianfields.com`)

2. **Configure DNS**:
   - Add the required DNS records as instructed by Vercel
   - Wait for DNS propagation (up to 48 hours)

### 4. Test Your Deployment

1. **Landing Page**: Visit your deployed URL
2. **Form Flow**: Test the complete form submission
3. **InstantDB**: Verify data is being collected in your InstantDB dashboard
4. **Image Uploads**: Test before/after photo uploads work correctly
5. **Mobile Testing**: Test on various devices

### 5. QR Code Setup

1. **Download QR Code**: The QR code is generated at `public/qr-code.png`
2. **Print Requirements**:
   - Minimum size: 2.5cm x 2.5cm
   - High contrast: Black on white
   - Test scanning with multiple devices

3. **Packaging Integration**:
   - Include QR code in product packaging insert
   - Consider secondary placement on product box
   - Ensure QR code is easily accessible

### 6. Monitoring & Analytics

1. **Vercel Analytics**:
   - Enable in Project Settings
   - Monitor performance and user behavior

2. **InstantDB Dashboard**:
   - Monitor data collection in real-time
   - Review file storage usage
   - Set up data export if needed

3. **Error Tracking**:
   - Consider adding Sentry for production monitoring

### 7. Post-Deployment Checklist

- [ ] Landing page loads correctly
- [ ] Form submission works end-to-end
- [ ] Data is being collected in InstantDB
- [ ] Image uploads are working and files are accessible
- [ ] Admin page displays submissions correctly
- [ ] Mobile responsiveness is working
- [ ] QR code scans correctly
- [ ] Environment variables are secure
- [ ] Performance meets requirements (< 2s load time)
- [ ] Error handling is working
- [ ] InstantDB admin token is properly secured

### 8. Troubleshooting

**Common Issues**:

1. **Build Failures**:
   - Check environment variables are set correctly
   - Verify all dependencies are installed
   - Ensure InstantDB packages are properly installed

2. **InstantDB Connection Errors**:
   - Verify App ID is correct in environment variables
   - Check admin token is properly set and valid
   - Ensure InstantDB app is active and properly configured

3. **Form Not Submitting**:
   - Check browser console for errors
   - Verify API route is working
   - Test with Postman or similar tool
   - Check InstantDB dashboard for error logs

4. **Image Upload Issues**:
   - Verify file size limits (InstantDB may have limits)
   - Check image file types are supported
   - Monitor browser network tab for upload failures

5. **Styling Issues**:
   - Clear browser cache
   - Check Tailwind CSS is building correctly

### 9. Maintenance

- **Regular Updates**: Keep dependencies updated, especially InstantDB packages
- **Security**: Monitor for security vulnerabilities, rotate admin tokens periodically
- **Performance**: Monitor Core Web Vitals and InstantDB query performance
- **Data**: Monitor InstantDB storage usage and set up alerts for limits
- **Backups**: Consider exporting InstantDB data periodically for backup

### 10. Support

For technical issues:
- Check Vercel deployment logs
- Review InstantDB documentation and dashboard
- Check InstantDB community forums and Discord
- Consult the project README.md

For business questions:
- Refer to the PRD document
- Contact the development team

### 11. InstantDB Specific Notes

**Data Structure**:
- Form submissions are stored in the `submissions` collection
- Images are stored using InstantDB's file storage
- All data is real-time and automatically synced

**File Storage**:
- Images are stored directly in InstantDB
- URLs are publicly accessible
- File storage usage counts toward your InstantDB plan limits

**Performance**:
- InstantDB provides real-time updates
- No need for manual data fetching/refreshing
- Built-in caching and optimization 