# Home Buddy

A modern monorepo application built with Next.js and NestJS, featuring robust authentication and microservices architecture.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with server-side rendering
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Reusable component library

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Static type checking
- **PostgreSQL** - Primary database
- **Redis** - Session management and caching
- **Prisma** - ORM for database operations
- **JWT** - Token-based authentication

## 🏗️ Architecture

The project follows a monorepo structure using Yarn workspaces:

```plaintext
home-buddy-monorepo/
├── apps/
│   ├── frontend/    # Next.js application
│   └── backend/     # NestJS application
└── packages/        # Shared packages

## 🔐 Authentication Flow
1. Registration
   
   - User registers with username, email, and password
   - Password is hashed using bcrypt
   - JWT tokens (access + refresh) are generated
2. Login
   
   - User provides credentials
   - System validates and returns JWT tokens
   - Tokens are stored in HTTP-only cookies
3. Token Management
   
   - Access Token: 15 minutes validity
   - Refresh Token: 7 days validity
   - Redis stores active tokens for validation
4. Security Features
   
   - HTTP-only cookies
   - JWT token validation
   - Redis token blacklisting
   - Route protection using Guards
## 🛠️ Setup and Installation
### Prerequisites
- Node.js 20+
- Docker and Docker Compose
- Yarn 4.6.0+
- PostgreSQL 15+
- Redis 7+
### Environment Variables