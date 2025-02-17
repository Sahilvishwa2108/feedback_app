import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
    Body,
} from '@react-email/components';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp}: VerificationEmailProps) {
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
            <Body>
                <Preview>Here&apos;s your verification code: {otp}</Preview>
                <Section>
                    <Row>
                        <Text>
                            Thank you for registering with us. Please use the following code to verify your email address:
                        </Text>
                    </Row>
                    <Row>
                        <Text>
                            <strong>{otp}</strong>
                        </Text>
                    </Row>
                    <Row>
                        <Text>
                            If you didn't request this code, you can safely ignore this email.
                        </Text>
                    </Row>
                </Section>
            </Body>
        </Html>
        );
    }
