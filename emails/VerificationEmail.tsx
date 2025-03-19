import {
    Html,
    Head,
    Preview,
    Section,
    Text,
    Body,
    Container,
    Heading,
} from '@react-email/components';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Your verification code: {otp}</Preview>
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
                        Here's your verification code:
                    </Text>
                    
                    <Section style={{
                        backgroundColor: '#f9f9f9',
                        border: '1px solid #eaeaea',
                        borderRadius: '5px',
                        margin: '0 auto 24px',
                        padding: '16px',
                        textAlign: 'center',
                    }}>
                        <Text style={{
                            color: '#6366f1',
                            fontSize: '32px',
                            fontWeight: 'bold',
                            letterSpacing: '6px',
                            margin: '0',
                        }}>
                            {otp}
                        </Text>
                    </Section>
                    
                    <Text style={{
                        color: '#666',
                        fontSize: '14px',
                        marginBottom: '0',
                        textAlign: 'center',
                    }}>
                        This code will expire in 10 minutes.
                    </Text>
                    
                    <Text style={{
                        color: '#888',
                        fontSize: '12px',
                        marginTop: '32px',
                        textAlign: 'center',
                    }}>
                        © 2025 Mystery Message • Please check your spam folder if you don't see this email
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}