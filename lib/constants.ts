export const Role = {
    SUPER_ADMIN: "SUPER_ADMIN",
    MEMBERS_AFFAIRS: "MEMBERS_AFFAIRS",
    FINANCE: "FINANCE",
    EDUCATION: "EDUCATION",
    CHOIR: "CHOIR",
    OFFICE: "OFFICE",
    MEMBER: "MEMBER"
} as const;

export type RoleType = typeof Role[keyof typeof Role];

export const Department = {
    CHOIR: "CHOIR",
    SUNDAY_SCHOOL: "SUNDAY_SCHOOL",
    DEACONS: "DEACONS",
    OTHER: "OTHER"
} as const;

export const AttendanceType = {
    SUNDAY_SERVICE: "SUNDAY_SERVICE",
    CHOIR_PRACTICE: "CHOIR_PRACTICE",
    CLASS: "CLASS",
    EVENT: "EVENT",
    OTHER: "OTHER"
} as const;

export const AttendanceStatus = {
    PRESENT: "PRESENT",
    ABSENT: "ABSENT",
    EXCUSED: "EXCUSED"
} as const;

export const FinancialType = {
    MONTHLY_CONTRIBUTION: "MONTHLY_CONTRIBUTION",
    MEMBERSHIP_FEE: "MEMBERSHIP_FEE",
    DONATION: "DONATION",
    OTHER: "OTHER"
} as const;

export const FinancialStatus = {
    PAID: "PAID",
    PENDING: "PENDING",
    OVERDUE: "OVERDUE"
} as const;

export const AcademicStatus = {
    ENROLLED: "ENROLLED",
    GRADUATED: "GRADUATED",
    DROPPED: "DROPPED",
    ON_LEAVE: "ON_LEAVE"
} as const;

export const EligibilityStatus = {
    ELIGIBLE: "ELIGIBLE",
    INELIGIBLE: "INELIGIBLE",
    PENDING: "PENDING"
} as const;

// Eligibility thresholds (configurable defaults)
export const ELIGIBILITY_THRESHOLDS = {
    MIN_ATTENDANCE_RATE: 70,   // %
    MIN_FINANCE_RATE: 60,      // % of months paid
    MIN_ACADEMIC_SCORE: 50,    // out of 100
} as const;

export const ETHIOPIAN_MONTHS = {
    en: [
        "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yakatit",
        "Magabit", "Miyazya", "Ginbot", "Sene", "Hamle", "Nehasse", "Pagume"
    ],
    am: [
        "መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ", "ጥር", "የካቲት",
        "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
    ]
};
