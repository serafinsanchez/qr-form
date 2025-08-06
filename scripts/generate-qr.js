const QRCode = require('qrcode')
const fs = require('fs')
const path = require('path')

async function generateQRCode() {
  const url = 'https://qr-form.vercel.app'
  
  try {
    // Generate QR code as PNG
    const qrCodeBuffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 400
    })
    
    // Save to public directory
    const outputPath = path.join(__dirname, '../public/qr-code.png')
    fs.writeFileSync(outputPath, qrCodeBuffer)
    
    console.log('✅ QR Code generated successfully!')
    console.log(`📁 Saved to: ${outputPath}`)
    console.log(`🔗 URL: ${url}`)
    console.log('\n📋 Instructions:')
    console.log('1. Print the QR code at minimum 2.5cm x 2.5cm')
    console.log('2. Ensure high contrast (black on white)')
    console.log('3. Test scanning with multiple devices')
    console.log('4. Include in product packaging insert')
    
  } catch (error) {
    console.error('❌ Error generating QR code:', error)
  }
}

generateQRCode() 