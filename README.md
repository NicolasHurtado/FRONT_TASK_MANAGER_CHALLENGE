# Task Manager Frontend 🚀

A modern **React** application built with **Next.js 15**, **TypeScript**, **Material-UI**, and **React Query** for the Task Manager system.

## ✨ Features

- 🎨 **Modern UI** - Clean, responsive design with Material-UI components
- 🔐 **Authentication** - JWT-based login/register with automatic token refresh
- ✅ **Task Management** - Full CRUD operations for tasks
- 📊 **Real-time Stats** - Live task statistics and progress tracking
- 🔄 **Optimistic Updates** - Instant UI updates with React Query
- 📱 **Responsive Design** - Works perfectly on all devices
- 🚀 **Performance** - Optimized with Next.js 15 and React 19
- 🎯 **TypeScript** - Full type safety throughout the application

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.4 | React framework with App Router |
| **React** | 19.0.0 | UI library |
| **TypeScript** | 5+ | Type safety |
| **Material-UI** | 6.1.8 | Component library |
| **React Query** | 5.62.11 | Server state management |
| **Axios** | 1.7.9 | HTTP client |
| **React Hook Form** | 7.54.2 | Form management |
| **Zod** | 3.24.1 | Schema validation |
| **Recharts** | 2.13.3 | Data visualization |
| **React Hot Toast** | 2.4.1 | Notifications |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running on http://localhost:8000

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# App Configuration
NEXT_PUBLIC_APP_NAME=Task Manager
NEXT_PUBLIC_APP_VERSION=1.0.0

# Development
NODE_ENV=development
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable components
│   │   ├── providers/         # Context providers
│   │   ├── ui/               # UI components
│   │   └── forms/            # Form components
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts        # Authentication hooks
│   │   └── useTasks.ts       # Task management hooks
│   ├── lib/                  # Utility libraries
│   │   ├── api.ts            # Axios configuration
│   │   └── queryClient.ts    # React Query setup
│   ├── services/             # API services
│   │   ├── authService.ts    # Auth API calls
│   │   └── taskService.ts    # Task API calls
│   └── types/                # TypeScript definitions
│       └── index.ts          # Type definitions
├── public/                   # Static assets
├── package.json             # Dependencies
└── README.md               # This file
```

## 🎯 Key Features Implemented

### Authentication System
- **JWT Token Management** - Automatic token refresh and storage
- **Protected Routes** - Route guards for authenticated pages
- **Login/Register Forms** - Validated forms with error handling
- **Persistent Sessions** - Secure cookie-based token storage

### Task Management
- **CRUD Operations** - Create, read, update, delete tasks
- **Status Management** - Track task progress (pending, in progress, completed)
- **Priority Levels** - Organize tasks by priority (low, medium, high)
- **Due Date Tracking** - Set and monitor task deadlines
- **Real-time Updates** - Instant UI updates with optimistic updates

### User Experience
- **Responsive Design** - Mobile-first responsive layout
- **Loading States** - Skeleton loaders and loading indicators
- **Error Handling** - User-friendly error messages
- **Success Feedback** - Toast notifications for actions
- **Optimistic Updates** - Instant UI feedback

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Run TypeScript compiler
```

## 🧪 Development Workflow

### Adding New Features
1. Create types in `src/types/`
2. Add API service methods in `src/services/`
3. Create custom hooks in `src/hooks/`
4. Build UI components in `src/components/`
5. Add pages in `src/app/`

### State Management Pattern
- **Server State** - Managed by React Query
- **Client State** - Local component state with hooks
- **Form State** - React Hook Form with Zod validation
- **Authentication State** - JWT tokens with secure storage

## 🎨 UI/UX Design

### Design System
- **Material-UI Theme** - Consistent design tokens
- **Typography Scale** - Hierarchical text sizing
- **Color Palette** - Primary, secondary, and semantic colors
- **Spacing System** - Consistent spacing units
- **Component Library** - Reusable UI components

### Responsive Breakpoints
- **Mobile** - 0px to 599px
- **Tablet** - 600px to 959px
- **Desktop** - 960px and above

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Automatic Token Refresh** - Seamless session management
- **Secure Cookie Storage** - HttpOnly, Secure, SameSite cookies
- **Input Validation** - Client and server-side validation
- **Error Boundaries** - Graceful error handling

## 📊 Performance Optimizations

- **Code Splitting** - Automatic route-based code splitting
- **Image Optimization** - Next.js automatic image optimization
- **Bundle Analysis** - Webpack bundle analyzer
- **Caching Strategy** - React Query caching with stale-while-revalidate
- **Prefetching** - Automatic link prefetching

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t task-manager-frontend .

# Run container
docker run -p 3000:3000 task-manager-frontend
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Run linting and type checking
5. Submit a pull request

---

**Built with ❤️ using Next.js 15, React 19, and Material-UI**
