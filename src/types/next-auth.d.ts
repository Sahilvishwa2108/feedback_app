import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        _id: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
    interface Session {
        user: {
            _id: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}
// This file is a declaration file for the NextAuth library. It extends the User, Session, and JWT interfaces to include the _id, isVerified, isAcceptingMessages, and username properties. This allows you to access these properties in your application when using NextAuth.