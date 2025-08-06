# Deployment Guide - Elysian Circle QR Form

## Quick Deployment to Vercel

### 1. Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "feat: initial Elysian Circle QR form implementation"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/qr-form.git
   git branch -M main
   git push -u origin main
   ```

### 2. Deploy to Vercel

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
   GOOGLE_PROJECT_ID=qr-form-468220
   GOOGLE_PROJECT_NUMBER=406540141678
   GOOGLE_SHEET_ID=16lZrN8q6A6ZAcU6UcvluHH4fwMXlA7x0uWoLpsIyD7M
   GOOGLE_CLIENT_EMAIL=qr-form-bot@qr-form-468220.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCSx9LEHCiIt/yL\n9tUH2VqNRr3ifKHvscye++l7qF+eVmyW3TZiPGGWWFzJhJuGhwi7S1L4G9u6K2I7\n9kySH21bg4K3mpzDIjYYWKuGy8T5u/HY5KRSs9FRFRG6LqojcEwSsoyiR5nZLeLo\nHP2keoCxtF0a5QpsZlucs3fc6j+d4cGnzbj+A6F7cJjGbX0uQpvQ5IP5VOhqHvmv\nHA2BjtNBmiMzvNmJfnMvIzyxLwjuTWH4xZTY22xX0Fpvs3wVLRl3rDyl8ejYgBfA\nZ/X/dTJcAXJU3Vbos4QbdzAuNw/pMuxoUzZFkHNKDdl9s0ouhfuVXoCKdclN4hyR\nXRrYfLn1AgMBAAECggEASOV8w3DIoL3faxO3USKdWjSb8XO8aPKAkSTDHGrOsjBx\n1asfa0JZpPVVf6+gHfvKVlpeZmJPifIp42W7OYbqJNz3eoALAs5m10iSR2vD89Nn\nlTRYd8peVkqEd1bdoKQQ4+hQ9/dfbQDhBC4BukIs0BSneMfvmU5siTKIgOrFlX7c\nrHgKVoMyGe2wNoQnpc7g7dUx0fdD/5Jv62Y9m0BEzBbMCLrkRsOafaohK/vd++E0\nQNB/bRQZQJHsMPcThguYXS0qtT8tSJDYv4IqGTIyQBXICPGQfOo2LEj61Ezs9C3g\nYoroc1YtNu3DOFr2zXoHWGHmyZVK6Q8Dw0yKdh5VsQKBgQDIX2wYpy5CPl9DJEAO\nQEQyqnamkiniao6rKXQodNErjveFDsfWu5gbIw/ei/0Ror8fTaaZBy0GOAN0ytPe\ndc0oveq4qn111DZVM8KjFQjCdNofnGDChulsPtnQfaYMoEaaEBoS9XojAYAbf/YX\nDPamL4YGn4+3SMUaeUzSIHUN0wKBgQC7h5TSuFHb+TUe259uiWRzDgeueC4XV7Lr\nBvnX4yJkvthqXOdRQW0lOjFkEyjjwnxLhk40f/LfJnoFrikK2NyCAep6noj5O3xe\n6K2uEF0Ok08m78hr3zRAJNs7yEpHM3G+iVb4mjBsDhNHNVhnktBTdbE4GtBDjYum\nnjY+cQwUFwKBgQCqdxvUgW5GZx/OVCm2thAO9pzIqzK88CB+F18+B9vn7dJAPcnf\nsmr+Mz8N+xSKi2WDsSEZsVQppT+zfdbvvFKU5bWp80mXE7pBlC5zZbK1FIp5OCXN\neM9fCr1ttWet+DD4Yth75qFI5L7jJmLrS1kPGwEv41F2AY/GLQog/gH3hwKBgGe5\nWUaoLpbmI0ybG3cPRWEiHHuS+6NrnYnDxQN1HTvuF1PVaRiXgKA7rL/2nQJFO2ym\nr7D4KETnSkzEBO17/5NlLeV+tLJuBZ+VQSNq5529OuWFcSzBO2xTNnO9l+AEA2Dp\nJBLDbg8GRgF37xryqInRKiGnKxSCQQD6t3QYIR8nAoGAW1vBkzvBp5BmYyWk2dY0\n4sPkejiw4Sq2Fwd9wGK0Vikzll2l8AOrwgN+29obMuYKHR1Qv8Q3XfjTooVSxcew\nN3TDv67RhmA4uKadBQYssKPTdZTGdZEJzNC1M+C8urwE2b+5p6MDtiJBxfzyOsZO\nD1v+Y9PDoDIYOrJUdZri44g=\n-----END PRIVATE KEY-----\n"
   ```

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
3. **Google Sheets**: Verify data is being collected
4. **Mobile Testing**: Test on various devices

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

2. **Google Sheets**:
   - Set up automated backups
   - Create dashboards for data analysis

3. **Error Tracking**:
   - Consider adding Sentry for production monitoring

### 7. Post-Deployment Checklist

- [ ] Landing page loads correctly
- [ ] Form submission works end-to-end
- [ ] Data is being collected in Google Sheets
- [ ] Mobile responsiveness is working
- [ ] QR code scans correctly
- [ ] Environment variables are secure
- [ ] Performance meets requirements (< 2s load time)
- [ ] Error handling is working
- [ ] Confirmation emails are being sent (if implemented)

### 8. Troubleshooting

**Common Issues**:

1. **Build Failures**:
   - Check environment variables are set correctly
   - Verify all dependencies are installed

2. **Google Sheets API Errors**:
   - Ensure service account has proper permissions
   - Verify sheet ID is correct
   - Check sheet is shared with service account

3. **Form Not Submitting**:
   - Check browser console for errors
   - Verify API route is working
   - Test with Postman or similar tool

4. **Styling Issues**:
   - Clear browser cache
   - Check Tailwind CSS is building correctly

### 9. Maintenance

- **Regular Updates**: Keep dependencies updated
- **Security**: Monitor for security vulnerabilities
- **Performance**: Monitor Core Web Vitals
- **Data**: Regular backups of Google Sheets data

### 10. Support

For technical issues:
- Check Vercel deployment logs
- Review Google Sheets API documentation
- Consult the project README.md

For business questions:
- Refer to the PRD document
- Contact the development team 