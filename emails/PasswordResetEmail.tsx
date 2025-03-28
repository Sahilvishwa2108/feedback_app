import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Link,
  Section,
  Hr,
  Heading,
} from '@react-email/components';

interface PasswordResetEmailProps {
  username: string;
  resetLink: string;
}

export default function PasswordResetEmail({ username, resetLink }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Mystery Message password</Preview>
      <Body style={{
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
        margin: 0,
        padding: '20px',
      }}>
        <Container style={{
          backgroundColor: '#ffffff',
          border: '1px solid #eaeaea',
          borderRadius: '5px',
          margin: '0 auto',
          maxWidth: '400px',
          padding: '20px',
        }}>
          <Heading style={{
            color: '#6366f1',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            Mystery Message
          </Heading>
          
          <Text style={{
            color: '#333',
            fontSize: '16px',
            marginBottom: '24px',
          }}>
            Hi {username},
          </Text>
          
          <Text style={{
            color: '#333',
            fontSize: '16px',
            marginBottom: '24px',
          }}>
            We received a request to reset your password for your Mystery Message account. Click the button below to set a new password:
          </Text>
          
          <Section style={{
            textAlign: 'center',
            marginBottom: '24px',
          }}>
            <Link
              href={resetLink}
              style={{
                backgroundColor: '#6366f1',
                borderRadius: '5px',
                color: '#ffffff',
                display: 'inline-block',
                fontWeight: 'bold',
                padding: '12px 20px',
                textDecoration: 'none',
              }}
            >
              Reset Password
            </Link>
          </Section>
          
          <Text style={{
            color: '#666',
            fontSize: '14px',
            marginBottom: '24px',
          }}>
            If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
          </Text>
          
          <Text style={{
            color: '#666',
            fontSize: '14px',
            marginBottom: '24px',
          }}>
            This password reset link will expire in 1 hour for security reasons.
          </Text>
          
          <Hr style={{
            borderColor: '#eaeaea',
            margin: '24px 0',
          }} />
          
          <Text style={{
            color: '#888',
            fontSize: '12px',
            marginTop: '12px',
            textAlign: 'center',
          }}>
            © 2025 Mystery Message • Please check your spam folder if you don't see this email
          </Text>
        </Container>
      </Body>
    </Html>
  );
}