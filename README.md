# Groceries Management App

A comprehensive Next.js-based application for managing grocery shopping lists, family collaboration, and household organization. Built with modern web technologies to provide a seamless experience for tracking items, categories, and shopping history.

## Features

- **User Authentication**: Secure login/register with JWT tokens, session management, and multi-device support
- **Shopping Lists**: Create, manage, and share shopping lists with family members
- **Categories**: Organize items into customizable categories with icons and colors
- **Family Groups**: Collaborate with family members, send invites, and manage shared lists
- **Dashboard**: Overview of active lists, recent activity, insights, and quick actions
- **Item Management**: Add items with quantities, priorities, brands, and estimated prices
- **Shopping History**: Track past purchases, spending charts, and frequency analysis
- **Settings**: Comprehensive user settings including notifications, privacy, appearance, and security
- **Responsive Design**: Mobile-first design with dark/light theme support
- **Real-time Updates**: Live updates for collaborative features

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components, Framer Motion animations
- **Backend**: Next.js API routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT tokens, bcrypt hashing
- **State Management**: React Context, custom hooks
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

## Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or cloud like MongoDB Atlas)
- Git

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd groceries
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
DATABASE_URL="mongodb://localhost:27017/groceries"  # Or your MongoDB connection string
JWT_SECRET="your-super-secret-jwt-key-here"  # Generate a secure random string
NEXTAUTH_SECRET="your-nextauth-secret"  # If using NextAuth (optional)
```

### 4. Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Seed the database with initial data:

```bash
npm run seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage

1. **Register/Login**: Create an account or log in with existing credentials
2. **Create Lists**: Start by creating your first shopping list
3. **Add Categories**: Organize items into categories (e.g., Dairy, Produce, Pantry)
4. **Manage Items**: Add items to lists with details like quantity, priority, and notes
5. **Collaborate**: Invite family members to join groups and share lists
6. **Track History**: View past purchases and spending patterns in the history section

## API Endpoints

The application provides RESTful API endpoints for all major features:

- **Auth**: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/refresh`
- **Lists**: `/api/lists`, `/api/lists/[id]`
- **Items**: `/api/item`, `/api/item/[id]`
- **Categories**: `/api/category`, `/api/category/[id]`
- **Dashboard**: `/api/dashboard`
- **Sessions**: `/api/sessions`, `/api/sessions/[id]`
- **Invites**: `/api/invites`
- **Database**: `/api/db` (for setup/testing)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed the database

## Project Structure

```
groceries/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (main)/            # Main app pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   └── ...
├── lib/                  # Utility libraries
├── prisma/               # Database schema and seed
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
└── context/              # React context providers
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
