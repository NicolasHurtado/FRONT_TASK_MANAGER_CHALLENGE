# Task Manager Frontend 🚀

A modern **React** application built with **Next.js 15**, **TypeScript**, **Material-UI**, and **React Query** for task management.

## ✨ Features

- 🔐 **JWT Authentication** - Login/register with automatic token refresh
- ✅ **Task Management** - Full CRUD operations for tasks
- 📊 **Real-time Stats** - Live task statistics and progress tracking
- 📱 **Responsive Design** - Works on all devices
- 🎯 **TypeScript** - Full type safety throughout the application

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Static typing
- **Material-UI** - Component library
- **React Query** - Server state management
- **Axios** - HTTP client

## 🚀 Getting Started

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

## ⚙️ Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Pages (App Router)
│   │   ├── auth/              # Authentication
│   │   └── dashboard/         # Dashboard
│   ├── components/            # Reusable components
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.ts        # Authentication hook
│   │   └── useTasks.ts       # Task management hook
│   ├── services/             # API services
│   │   ├── authService.ts    # Auth services
│   │   └── taskService.ts    # Task services
│   ├── types/                # TypeScript definitions
│   └── __tests__/            # Unit tests
├── jest.config.js           # Jest configuration
└── package.json
```

## 🎯 Key Features

### Authentication System
- Login/Register with validation
- JWT tokens with automatic refresh
- Protected routes
- Persistent sessions

### Task Management
- Create, read, update, delete tasks
- Status: pending, in progress, completed
- Priority: low, medium, high
- Due date tracking

## 🔧 Available Scripts

```bash
npm run dev          # Development server
npm run build        # Build for production
npm run start        # Production server
npm run lint         # Run linter
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🧪 Testing

The project includes **comprehensive unit tests** for core services:

- **AuthService Tests** (20 tests) - User CRUD operations
- **TaskService Tests** (20 tests) - Task CRUD operations
- **Direct mocks** - Fast tests without external dependencies
- **Full coverage** - Success cases, errors, and edge cases

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

```
src/__tests__/
├── services/
│   ├── authService.test.ts    # User CRUD tests
│   └── taskService.test.ts    # Task CRUD tests
└── README.md                  # Test documentation
```

## 🔒 Security

- Secure JWT authentication
- Form validation
- Error handling
- Secure token cookies

---
## 📞 Contact

For any inquiries about the project, contact us at [nicolashurtado0712@gmail.com](mailto:nicolashurtado0712@gmail.com).

---

**Developed with ❤️ by Nicolas Hurtado**
