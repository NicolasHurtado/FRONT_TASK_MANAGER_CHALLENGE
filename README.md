# Task Manager Frontend 🚀

A modern **React** application built with **Next.js 15**, **TypeScript**, **Material-UI**, and **React Query** for efficient task management.

## ✨ Features

- 🔐 **JWT Authentication** - Secure login/register with automatic token refresh
- ✅ **Task Management** - Complete CRUD operations for tasks
- 📊 **Real-time Dashboard** - Live task statistics and progress tracking
- 📱 **Responsive Design** - Optimized for all devices
- 🎯 **TypeScript** - Full type safety throughout the application
- 🚀 **SSR Ready** - Server-side rendering with Next.js App Router

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Static typing for better development experience
- **Material-UI (MUI)** - Modern component library
- **React Query** - Powerful server state management
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Performant forms with validation
- **Zod** - Schema validation

## 🚀 Getting Started

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── auth/              # Authentication pages
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Register page
│   │   └── dashboard/         # Protected dashboard
│   │       ├── tasks/         # Task management
│   │       ├── analytics/     # Analytics page
│   │       └── settings/      # User settings
│   ├── components/            # Reusable components
│   │   └── providers/         # App providers
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts         # Authentication logic
│   │   └── useTasks.ts        # Task management logic
│   ├── services/              # API services
│   │   ├── authService.ts     # Authentication API
│   │   └── taskService.ts     # Task API
│   ├── lib/                   # Utilities
│   │   ├── api.ts             # Axios configuration
│   │   └── queryClient.ts     # React Query setup
│   ├── types/                 # TypeScript definitions
│   └── middleware.ts          # Next.js middleware
├── __tests__/                 # Unit tests
└── package.json
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
```

## 🧪 Testing

Comprehensive unit tests for core functionality:

- **AuthService Tests** - Authentication operations
- **TaskService Tests** - Task CRUD operations
- **Component Tests** - UI component testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔒 Security Features

- **JWT Authentication** with automatic refresh
- **Protected Routes** with middleware
- **Form Validation** with Zod schemas
- **HTTPS Support** for production
- **Secure Cookies** for token storage

## 🚀 Deployment

The application is optimized for deployment on:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- Any Node.js hosting platform

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

**Built with ❤️ using modern React ecosystem**
