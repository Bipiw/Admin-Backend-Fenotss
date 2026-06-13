# FENOT SUNDAY SCHOOL MANAGEMENT SYSTEM - OPERATIONAL GUIDE

## 1. PROJECT DESCRIPTION & CORE PURPOSE

The **Fenot Sunday School Management System** is a comprehensive, role-based administrative platform designed for Sunday School organizations to streamline member management, attendance tracking, financial records, and academic progress monitoring. The system solves the organizational challenge of coordinating multiple departments (Education, Choir, Finance, Members Affairs, Main Office) that need to track member data independently while maintaining a unified view of member eligibility for church services and activities.

**Primary Target Audience**: Sunday School administrators, department heads, and members who need a centralized system to manage member lifecycle from onboarding through service eligibility determination.

**Core Tech Stack**:
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with JWT strategy
- **Styling**: Tailwind CSS with Radix UI components
- **Icons**: Lucide React

---

## 2. KEY SYSTEM MODULES & ROLES

The system features seven distinct role-based dashboards, each with specific capabilities:

### **SUPER_ADMIN (admin@fenot.com)**
- Complete system oversight and configuration
- User management: Create, edit, delete user accounts across all roles
- System settings: Configure eligibility thresholds, department parameters
- Audit logs: View all system actions and changes
- Announcements: Create and manage system-wide notifications
- Backup and restore functionality

### **MEMBERS_AFFAIRS (affairs@fenot.com)**
- Member registration and profile management
- Department assignments and transfers
- Attendance oversight across all departments
- **Eligibility management**: Run automatic eligibility calculations, manual overrides
- Member notifications and communications
- View comprehensive member status reports

### **FINANCE & ASSETS (finance@fenot.com)**
- Financial record management: Monthly contributions, membership fees, donations
- Payment verification and receipt management
- Defaulter identification and tracking
- Financial ledger maintenance
- Asset management: Track audio equipment, furniture, and other church assets
- Generate financial reports and payment histories

### **EDUCATION (education@fenot.com)**
- Student enrollment and academic record management
- Grade entry and exam score tracking
- Academic progress monitoring
- Study material management
- Level/class organization
- Generate academic transcripts and progress reports

### **CHOIR (choir@fenot.com)**
- Choir practice attendance tracking
- Choir member management
- Performance and event participation records
- Attendance pattern analysis for choir members

### **MAIN OFFICE (office@fenot.com)**
- **Clearance letter issuance**: Generate official clearance letters for members
- Member verification and status confirmation
- Official document generation
- Cross-department member status review
- Administrative support for member requests

### **MEMBER PORTAL (member@fenot.com)**
- Personal profile management
- View personal attendance history
- View financial payment status and history
- View academic grades and progress
- **Service eligibility status**: Real-time view of eligibility for services
- Access study materials and resources
- Receive personal notifications

---

## 3. STEP-BY-STEP OPERATIONAL DATA FLOW

### **Step 1: Member Onboarding**
1. **Members Affairs** creates a new user account via the admin dashboard
2. Member profile is established with basic information (name, contact, department assignment)
3. Initial user credentials are generated and provided to the member
4. Member can log into their personal portal to complete profile details

### **Step 2: Department Data Logging**
Each department independently logs data for members:

- **Education Department**: Records academic enrollment, exam scores, and grade progress through the Education dashboard
- **Choir Department**: Tracks choir practice attendance and participation via Choir dashboard
- **Finance Department**: Logs monthly contributions, payment status, verifies receipts via Finance dashboard
- **Members Affairs**: Records general service attendance (Sunday services, events) via Members Affairs dashboard

All data is stored in the central SQLite database with proper relationships to member profiles.

### **Step 3: Central Eligibility Engine Calculation**
The eligibility calculation is triggered manually by Members Affairs or Super Admin:

1. **Attendance Calculation**: System calculates attendance rate over the past 90 days (PRESENT vs total records)
2. **Finance Calculation**: System calculates payment rate over the past 6 months (PAID months vs 6 months total)
3. **Academic Calculation**: System averages exam scores from all academic records (defaults to 100% if no grades exist)
4. **Threshold Comparison**: System compares calculated metrics against configurable thresholds:
   - Minimum attendance rate: 70%
   - Minimum finance rate: 60%
   - Minimum academic score: 50%
5. **Status Determination**: Member is marked ELIGIBLE if all thresholds are met, otherwise INELIGIBLE
6. **Result Storage**: Calculation results are stored in the ServiceEligibility table with timestamps and detailed reasons

**Manual Override**: Members Affairs can manually override eligibility status with justification (e.g., health dispensation), which is logged with the override reason and author.

### **Step 4: Clearance and Member Access**
- **Main Office**: Accesses the eligibility data via the Office dashboard, reviews member status across all departments, and generates official clearance letters for members who need proof of standing
- **Member Portal**: Members can view their real-time eligibility status, see detailed breakdown of why they are eligible/ineligible, and access their complete departmental history (attendance, finances, grades) in one centralized view

---

## 4. USER ACCESS GUIDE (HOW TO INITIALIZE & LOG IN)

### **Development Server Initialization**

1. **Navigate to project directory**:
   ```bash
   cd c:\Users\Roba\Documents\Fenot\Admin-Backend-Fenotss
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Set up environment variables** (create `.env` file if not exists):
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize database with seed data**:
   ```bash
   npx prisma migrate dev --name init
   node prisma/seed.js
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Access application**: Open http://localhost:3000 in your browser

### **Seeded Test Credentials & Validation Cohorts**

All accounts use the same default password: **`password123`**

| Email Address | Assigned Role | Assigned Department | Explicit Login URL Path | Scenario / Test Case Validation |
| :--- | :--- | :--- | :--- | :--- |
| **admin@fenot.com** | `SUPER_ADMIN` | `OTHER` | [`/dashboard/admin`](http://localhost:3000/dashboard/admin) | Core system administrator account. Used to manage all users, adjust eligibility thresholds in settings, and inspect system audit logs. |
| **affairs@fenot.com** | `MEMBERS_AFFAIRS` | `OTHER` | [`/dashboard/members-affairs`](http://localhost:3000/dashboard/members-affairs) | Members Affairs administrator. Used for member onboarding, tracking general attendance, running service eligibility calculations, and inputting manual overrides. |
| **finance@fenot.com** | `FINANCE` | `OTHER` | [`/dashboard/finance`](http://localhost:3000/dashboard/finance) | Finance Administrator. Tracks contributions, verifies manual payment receipts, handles asset database records, and flags members in arrears. |
| **education@fenot.com** | `EDUCATION` | `SUNDAY_SCHOOL` | [`/dashboard/education`](http://localhost:3000/dashboard/education) | Sunday School academic administrator. Enrolls students, inputs exam scores, and uploads study materials. |
| **choir@fenot.com** | `CHOIR` | `CHOIR` | [`/dashboard/choir`](http://localhost:3000/dashboard/choir) | Choir department supervisor. Logs choir practice attendance and reviews choir participation. |
| **office@fenot.com** | `OFFICE` | `OTHER` | [`/dashboard/office`](http://localhost:3000/dashboard/office) | Main Office secretary. Confirms member eligibility status and generates official clearance letters. |
| **member@fenot.com** | `MEMBER` | `OTHER` | [`/dashboard/member`](http://localhost:3000/dashboard/member) | Standard member profile with clean state to check standard dashboard navigation. |
| **ideal@fenot.com** | `MEMBER` | `SUNDAY_SCHOOL` | [`/dashboard/member`](http://localhost:3000/dashboard/member) | **Cohort Test (Member A)**: Validates perfect metrics flow. Seeded with 90 days of 100% attendance, 6 months of paid monthly contributions, and a high exam score (90%). Computed status: **`ELIGIBLE`**. |
| **attendance_defaulter@fenot.com** | `MEMBER` | `CHOIR` | [`/dashboard/member`](http://localhost:3000/dashboard/member) | **Cohort Test (Member B)**: Validates low attendance failure. Seeded with 40% attendance rate (below 70% threshold), but perfect finances and grades. Computed status: **`INELIGIBLE`**. |
| **financial_defaulter@fenot.com** | `MEMBER` | `DEACONS` | [`/dashboard/member`](http://localhost:3000/dashboard/member) | **Cohort Test (Member C)**: Validates financial failure. Seeded with 100% attendance, perfect grades, but only 33% monthly contributions paid (below 60% threshold). Computed status: **`INELIGIBLE`**. |
| **override@fenot.com** | `MEMBER` | `OTHER` | [`/dashboard/member`](http://localhost:3000/dashboard/member) | **Cohort Test (Member D)**: Validates manual override authorization. Seeded with failing metrics (10% attendance, 0% finances, 20% academic), but Members Affairs has input a manual override with reason "Special health dispensation". Computed status: **`ELIGIBLE`**. |

All test accounts use the same password: **`password123`**

---

## 5. SECURITY MEASURES & RECOMMENDATIONS

### **Currently Implemented Security Measures**

#### **Authentication & Session Security**
- **NextAuth.js with JWT Strategy**: Token-based authentication with secure session management
- **Bcrypt Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10 before storage
- **Password Change Verification**: Users must provide current password before changing to a new one
- **Session-based Access Control**: All dashboard routes protected by NextAuth middleware

#### **Authorization & Access Control**
- **Role-Based Access Control (RBAC)**: 7 distinct roles with specific permissions
- **API Route Protection**: `requireAuth()` middleware function enforces role-based access on all API endpoints
- **Data Isolation**: Members can only view their own data (attendance, finances, grades) while staff can view department-wide data
- **Super Admin Override**: Super Admin has access to all functions regardless of role restrictions

#### **Input Validation & Data Sanitization**
- **Zod Schema Validation**: All API endpoints use Zod schemas for strict input validation
- **Email Standardization**: Automatic email normalization (lowercase, trim, domain enforcement)
- **Type Safety**: TypeScript provides compile-time type checking throughout the application
- **Enum Validation**: Role, department, and status fields use strict enum validation

#### **Database Security**
- **Prisma ORM**: Provides automatic SQL injection protection through parameterized queries
- **SQLite Database**: File-based database with proper access controls
- **Relational Integrity**: Foreign key constraints and cascade deletes maintain data consistency
- **Transaction Support**: Critical operations use database transactions for data consistency

#### **Audit & Monitoring**
- **Audit Logging**: All significant actions (user creation, eligibility changes, clearance issuance) are logged with user ID, action type, and timestamp
- **Error Logging**: Console error logging for debugging and monitoring
- **Action Tracking**: Financial records, attendance logs, and academic changes track who performed each action

#### **File Upload Security**
- **Basic File Validation**: File uploads are processed with basic validation
- **Timestamped Filenames**: Uploaded files receive timestamp-based names to prevent conflicts
- **Public Directory Isolation**: Uploads stored in dedicated public/uploads directory

### **Security Recommendations & Improvements**

#### **High Priority**
1. **Environment Variables**: Ensure `.env` file is properly secured and not committed to version control
2. **Password Policy**: Implement stronger password requirements (minimum 8 characters, complexity requirements)
3. **Rate Limiting**: Add rate limiting to API endpoints to prevent brute force attacks
4. **HTTPS Enforcement**: Ensure production deployment uses HTTPS with proper SSL certificates
5. **Session Timeout**: Implement session timeout and refresh mechanisms

#### **Medium Priority**
6. **File Upload Validation**: Implement comprehensive file type validation, size limits, and virus scanning
7. **CORS Configuration**: Configure proper CORS headers for API security
8. **Security Headers**: Add security headers (Content-Security-Policy, X-Frame-Options, etc.)
9. **SQL Injection Testing**: Regular security testing despite ORM protection
10. **Dependency Updates**: Regularly update dependencies to patch security vulnerabilities

#### **Low Priority**
11. **Two-Factor Authentication**: Consider implementing 2FA for admin accounts
12. **Encryption at Rest**: Consider database encryption for sensitive member data
13. **API Key Management**: Implement API key authentication for external integrations
14. **Security Monitoring**: Implement real-time security monitoring and alerting
15. **Penetration Testing**: Regular security audits and penetration testing

### **Security Best Practices for Deployment**

1. **Never commit `.env` files** to version control
2. **Use strong, unique `NEXTAUTH_SECRET`** in production (minimum 32 characters)
3. **Enable database backups** with secure storage
4. **Implement proper logging** with log rotation and secure storage
5. **Regular security updates** for all dependencies
6. **Use environment-specific configurations** for development, staging, and production
7. **Implement proper error handling** that doesn't expose sensitive information
8. **Regular security audits** of user access and permissions
