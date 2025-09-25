# Surge - Sports Fest Registration Platform

Surge is a comprehensive sports festival registration platform built with Next.js, designed for managing multi-day sports events. The platform enables college students to easily register for various sports events, form teams, and track their participation in the annual "Three-Day Sports Fest of SNIOE".

## 🏆 Features

- **User Authentication**: Secure registration and login with email verification
- **Event Registration**: Browse and register for multiple sports events
- **Team Management**: Create and manage sports teams with multiple members
- **Shopping Cart**: Add events to cart and manage registrations
- **Dashboard**: Personalized user dashboard to manage profile and registrations
- **Responsive Design**: Works seamlessly across all device sizes
- **Real-time Countdown**: Timer showing the countdown to the event
- **Interactive UI**: Modern and engaging user interface with animations

## 🛠 Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS, Framer Motion for animations
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with email verification
- **API**: TRPC for type-safe API calls
- **Email Service**: Resend for email verification
- **Image Optimization**: Next.js Image component

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/surge.git
   cd surge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   RESEND_API_KEY="your-resend-api-key"
   EMAIL_FROM="your-verified-sender@example.com"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the application

## 📋 Project Structure

```
surge/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── components/        # Reusable UI components
│   ├── styles/            # CSS modules
│   └── ...
├── server/                # Server-side logic
├── prisma/                # Prisma schema and migrations
├── public/                # Static assets
└── ...
```

## 🧪 Available Scripts

- `npm run dev` - Start development server with development database environment
- `npm run build` - Build for production
- `npm run build:dev` - Build with development environment variables
- `npm start` - Start production server
- `npm run lint` - Lint the codebase
- `npm run pushdev` - Push Prisma schema to development database (.env.development)
- `npm run pushprod` - Push Prisma schema to production database (.env.local)
- `npx prisma generate` - Generate Prisma client

## 🔐 Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL database connection string
- `NEXTAUTH_URL`: Application URL (for development: `http://localhost:3000`)
- `NEXTAUTH_SECRET`: Secret for NextAuth.js (generate one with `openssl rand -base64 32`)
- `RESEND_API_KEY`: API key from Resend for email service
- `EMAIL_FROM`: Verified email address for sending verification emails

### Environment Configuration

This project supports multiple environments using different .env files:

- `.env.local` - Local development (takes precedence over other .env files)
- `.env.development` - Development environment variables
- `.env.production` - Production environment variables
- `.env` - Default environment variables

For development with a specific database, create a `.env.development` file with your development database configuration.

## 👥 User Roles

- **Users**: Can register for events, create teams, and manage their profile
- **Admins**: Can manage events and view dashboard metrics (implementation pending)

## 🏅 Event Management

- **Individual Events**: Single player participation
- **Team Events**: Multiple players per team (configurable team size)
- **Prize Distribution**: Winner and runner-up prizes per event
- **Registration Fees**: Per-player fees for events

## 📱 Mobile Responsive

The platform is fully responsive and provides an optimal experience on:
- Desktop computers
- Tablets
- Mobile devices

## 🛡️ Security

- Passwords are securely hashed using bcrypt
- Email verification required for account activation
- Secure session management with NextAuth.js
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions, please open an issue in the repository.

## ⭐ Acknowledgments

- Next.js team for the excellent framework
- Prisma team for the amazing ORM
- All the open-source libraries used in this project