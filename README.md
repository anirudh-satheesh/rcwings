# RC Wings

RC Wings is a production-grade e-commerce and project management system built for high-performance teams and RC enthusiast builds. It features a robust authentication system, a dynamic project management dashboard, and a complete e-commerce pipeline from product discovery to transactional checkout.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- PostgreSQL database (e.g., [Neon.tech](https://neon.tech))
- Google Cloud Console account (for Google OAuth)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd rcwings
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
   JWT_SECRET="your-super-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   NODE_ENV="development"
   ```

4. **Initialize the Database:**
   Sync the schema and generate the Prisma client:
   ```bash
   npx prisma db push
   # or for formal migrations:
   npx prisma migrate dev
   ```

### Running the Application

Since this is a Next.js Full-Stack application, the client and server run concurrently on the same dev server.

- **Development Mode:**
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) to see the application.

- **Production Build:**
  ```bash
  npm run build
  npm start
  ```

---

## 🛠️ Implemented Features

### 🔐 Authentication & Security
- **Secure Sessions**: HttpOnly, Secure, and SameSite cookies for JWT management (XSS mitigation).
- **Dual Auth**: Traditional Email/Password (bcrypt) + Google OAuth integration.
- **Role-Based Access**: Specialized `USER` and `ADMIN` roles.
- **COOP Headers**: Configured for secure Google popups.

### 📦 E-Commerce Core
- **Product Management**: Admin-controlled CRUD, public listing with pagination, search, category filtering, and price sorting.
- **Smart Shopping Cart**: Persistent, user-specific cart with stock validation.
- **Transactional Orders**: Atomic checkout process that ensures stock reduction, order creation, and cart clearing happen in a single safe transaction.

### 🏗️ Project Management
- **Dashboard**: Interactive UI for managing RC build projects.
- **CRUD Operations**: Create, list, update status, and delete projects with ownership enforcement.

### 🧱 Technical Foundation
- **Framework**: Next.js 16 (App Router) with Turbopack.
- **Database**: PostgreSQL with Prisma ORM.
- **Validation**: Schema-level validation using Zod for all API inputs.
- **Architecture**: Service Layer pattern for clean, testable business logic.
- **Styling**: Tailwind CSS v4 for a modern, architectural aesthetic.

---

## 🧪 Development Utilities

- **Schema Check**: `npm run ts-node scripts/check-db.ts` to verify DB columns.
- **Manual Sync**: `npm run ts-node scripts/sync-db.ts` for emergency schema drift fixes.

---

Built with passion for the RC Community. © 2026 RCWings.
