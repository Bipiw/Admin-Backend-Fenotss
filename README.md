# Fenot Sunday School Management System

A comprehensive, role-based management platform designed for Sunday Schools. This application streamlines member management, attendance tracking, financial records, and academic progress monitoring.

##  Features

- **Role-Based Access Control (RBAC):** Dedicated dashboards for Super Admin, Members Affairs, Finance, Education, and Members.
- **Member Management:** Comprehensive profiles for members including contact details and department affiliation.
- **Attendance Tracking:** Record and monitor attendance for various services and practices.
- **Financial Management:** Track monthly contributions, membership fees, and donations with verification workflows.
- **Academic Progress:** Monitor student enrollment and graduation status.
- **Multilingual Support:** Full support for both **English** and **Amharic** languages.
- **Modern UI:** Built with Radix UI and Tailwind CSS for a premium, responsive experience.

##  Tech Stack

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [Prisma](https://www.prisma.io/) (SQLite)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Components:** [Radix UI](https://www.radix-ui.com/) / Shadcn
- **Icons:** [Lucide React](https://lucide.dev/)

##   Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Riter-Rob/Bura_senbet.git
   cd Bura_senbet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your connection strings and auth secrets:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

##  Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components.
- `contexts/`: React Contexts (Language, etc.).
- `lib/`: Utility functions and shared constants.
- `prisma/`: Database schema and migrations.
- `public/`: Static assets.
- `types/`: TypeScript definitions.

##  License

This project is private and for internal use.
