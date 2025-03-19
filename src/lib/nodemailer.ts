import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'sahilvishwa2108@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'zjfx obfh thac dabr', // App password, not regular password
  },
  tls: {
    rejectUnauthorized: false // Helps with self-signed certificates
  }
});

// Verify connection configuration (optional but recommended)
transporter.verify((error: Error | null) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

export default transporter;