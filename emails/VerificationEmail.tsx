import {
    Html,
    Head,
    Font,
    Preview,
    Row,
    Section,
    Text,
    Body,
    Container,
    Column,
    Heading,
} from '@react-email/components';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html lang="en" dir='ltr'>
            <Head>
                <title>Verification Email</title>
                <Font
                    fontFamily='Roboto'
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle='normal'
                />
            </Head>
            <Preview>Here&apos;s your verification code: {otp}</Preview>
            <Body style={{
                backgroundColor: '#f6f9fc',
                fontFamily: 'Roboto, Verdana, sans-serif',
            }}>
                <Container style={{
                    backgroundColor: '#ffffff',
                    margin: '40px auto',
                    padding: '20px',
                    borderRadius: '5px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    maxWidth: '600px',
                }}>
                    <Section>
                        <Heading style={{
                            color: '#7e22ce', 
                            fontSize: '24px',
                            textAlign: 'center',
                            margin: '10px 0 20px'
                        }}>
                            Verification Required
                        </Heading>
                        <Text style={{
                            fontSize: '16px',
                            color: '#333',
                            lineHeight: '24px'
                        }}>
                            Hello {username},
                        </Text>
                        <Text style={{
                            fontSize: '16px',
                            color: '#333',
                            lineHeight: '24px'
                        }}>
                            Thank you for registering with Mystery Message. Please use the following code to verify your email address:
                        </Text>
                        <Section style={{
                            textAlign: 'center',
                            margin: '30px 0',
                        }}>
                            <Text style={{
                                fontSize: '32px',
                                color: '#7e22ce',
                                fontWeight: 'bold',
                                letterSpacing: '5px',
                                padding: '15px 20px',
                                backgroundColor: '#f3e8ff',
                                borderRadius: '4px',
                                display: 'inline-block',
                            }}>
                                {otp}
                            </Text>
                        </Section>
                        <Text style={{
                            fontSize: '14px',
                            color: '#666',
                        }}>
                            If you didn't request this code, you can safely ignore this email.
                        </Text>
                        <Text style={{
                            fontSize: '14px',
                            color: '#666',
                            marginTop: '30px',
                            borderTop: '1px solid #eee',
                            paddingTop: '20px',
                        }}>
                            © 2025 Mystery Message. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
