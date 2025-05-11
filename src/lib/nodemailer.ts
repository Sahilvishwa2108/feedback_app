import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Helps with self-signed certificates
  }
});

// Add error handling if credentials aren't available
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('Email credentials not configured properly in environment variables');
}

// Verify connection configuration (optional but recommended)
transporter.verify((error: Error | null) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

export default transporter;