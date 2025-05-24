# ✨ Mystery Message

A modern web application that enables anonymous feedback for personal growth and honest communication.

## 🌟 Features

- **Complete Anonymity**: Send feedback without revealing your identity
- **Enhanced Privacy**: No tracking of IP addresses or identifying information
- **User Control**: Toggle feedback reception on/off whenever you want
- **Personalized Links**: Share your unique link to receive anonymous messages
- **Responsive Design**: Beautiful UI that works across all devices
- **Interactive Experience**: Elegant animations and micro-interactions

## 🚀 Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL
- **Deployment**: Vercel

## 🛠️ Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/sahilvishwa2108/feedback_app.git
    cd mystery-message
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Configure environment variables: Create a `.env` file in the root directory with the following variables:
    ```bash
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_SECRET=your_nextauth_secret_key
    OPENAI_API_KEY=your_openai_api_key
    EMAIL_USER=your_email@example.com
    EMAIL_PASSWORD=your_email_app_password
    EMAIL_FROM=your_sender_email@example.com
    ```

4. Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. Open http://localhost:3000 in your browser to see the application.

## 📁 Project Structure
```
feedback_app/
├── .next/                        # Next.js build output (generated)
├── node_modules/                 # Dependencies (not tracked in git)
├── public/                       # Static assets
│   ├── favicon.ico               # Site favicon
│   └── images/                   # Image assets
├── src/
│   ├── app/                      # Next.js app router
│   │   ├── api/                  # API routes
│   │   │   └── auth/             # Authentication API endpoints
│   │   ├── feedback/             # Feedback routes
│   │   │   └── page.tsx          # Feedback page component
│   │   ├── dashboard/            # Dashboard routes
│   │   │   └── page.tsx          # Dashboard page component  
│   │   ├── login/                # Login route
│   │   │   └── page.tsx          # Login page component
│   │   ├── register/             # Registration route
│   │   │   └── page.tsx          # Registration page component
│   │   ├── globals.css           # Global CSS styles
│   │   ├── layout.tsx            # Root layout component
│   │   └── page.tsx              # Home page component
│   ├── components/               # Reusable UI components
│   │   ├── auth/                 # Authentication components
│   │   │   ├── LoginForm.tsx     # Login form component
│   │   │   └── RegisterForm.tsx  # Registration form component
│   │   ├── feedback/             # Feedback components
│   │   │   ├── FeedbackCard.tsx  # Individual feedback display
│   │   │   ├── FeedbackForm.tsx  # Submit feedback form
│   │   │   └── FeedbackList.tsx  # List of feedback items
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx        # App header
│   │   │   ├── Footer.tsx        # App footer
│   │   │   └── Sidebar.tsx       # App sidebar
│   │   └── ui/                   # UI components (shadcn/ui)
│   │       ├── Button.tsx        # Button component
│   │       ├── Card.tsx          # Card component
│   │       ├── Input.tsx         # Input component
│   │       ├── Toaster.tsx       # Toast notifications
│   │       └── ...               # Other UI components
│   ├── context/                  # React context providers
│   │   ├── AuthProvider.tsx      # Authentication context
│   │   └── FeedbackProvider.tsx  # Feedback management context
│   ├── lib/                      # Utility functions and libraries
│   │   ├── api.ts                # API client functions
│   │   ├── auth.ts               # Authentication utilities
│   │   ├── db.ts                 # Database utilities
│   │   └── utils.ts              # General utility functions
│   ├── types/                    # TypeScript type definitions
│   │   ├── auth.ts               # Authentication types
│   │   ├── feedback.ts           # Feedback data types
│   │   └── index.ts              # Common types
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Authentication hook
│   │   └── useFeedback.ts        # Feedback management hook
│   └── styles/                   # Component-specific styles
├── .env                          # Environment variables (not tracked)
├── .env.example                  # Example environment variables
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore configuration
├── components.json               # shadcn/ui configuration
├── eslint.config.mjs             # ESLint configuration
├── next.config.js                # Next.js configuration
├── package.json                  # NPM package configuration
├── package-lock.json             # NPM dependency lock file
├── postcss.config.mjs            # PostCSS configuration
├── README.md                     # Project documentation
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```
## 🔒 Privacy & Security Features

- **No IP Storage**: No storage of sender IP addresses or identifying information
- **End-to-End Encryption**: Complete message encryption for maximum security
- **Message Auto-Delete**: Automatic message deletion option
- **User Controls**: Comprehensive user-controlled privacy settings

## 🧩 Key Components

- **User Authentication**: Secure login and account management
- **Dashboard**: Personal space to manage received messages
- **Message Center**: Interface for reading and organizing feedback
- **Link Sharing**: Tools to share your personalized feedback link
- **Settings**: Control privacy and notification preferences

## 💫 UI/UX Design

- **Cosmic Theme**: Dark theme with purple/indigo accents and subtle animated backgrounds
- **Advanced Animations**: Thoughtful use of Framer Motion for micro-interactions
- **Responsive Layout**: Beautiful experience across all device sizes
- **Glassmorphism Elements**: Modern blur effects with semi-transparent components

## 🔮 Roadmap

- [ ] Message categorization system
- [ ] Anonymous response capability
- [ ] Themes and customization options
- [ ] Analytics for received feedback (without compromising anonymity)
- [ ] Mobile application

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request