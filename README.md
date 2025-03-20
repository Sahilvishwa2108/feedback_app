# ✨ Mystery Message

![Mystery Message](public/app-preview.png)

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
    git clone https://github.com/yourusername/mystery-message.git
    cd mystery-message
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Configure environment variables: Create a `.env.local` file in the root directory with the following variables:
    ```bash
    DATABASE_URL=your_database_url
    NEXTAUTH_SECRET=your_nextauth_secret
    NEXTAUTH_URL=http://localhost:3000
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
mystery-message/
├── public/           # Static assets
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # Reusable UI components
│   ├── lib/          # Utility functions and libraries
│   ├── types/        # TypeScript type definitions
│   └── styles/       # Global styles
├── prisma/           # Database schema and migrations
└── ...configuration files
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