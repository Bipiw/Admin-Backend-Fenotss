const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('Purging database...')
    // Correct relational deletion order to avoid constraint failures
    await prisma.clearanceRecord.deleteMany()
    await prisma.memberNotification.deleteMany()
    await prisma.serviceEligibility.deleteMany()
    await prisma.academicRecord.deleteMany()
    await prisma.financialRecord.deleteMany()
    await prisma.attendance.deleteMany()
    await prisma.memberProfile.deleteMany()
    await prisma.announcement.deleteMany()
    await prisma.auditLog.deleteMany()
    await prisma.user.deleteMany()
    await prisma.asset.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.studyMaterial.deleteMany()
    await prisma.systemSetting.deleteMany()
    console.log('Purging complete.')

    const password = bcrypt.hashSync('password123', 10)

    console.log('Seeding system settings...')
    await prisma.systemSetting.createMany({
        data: [
            { key: 'MIN_ATTENDANCE_RATE', value: '70', description: 'Minimum attendance percentage required' },
            { key: 'MIN_FINANCE_RATE', value: '60', description: 'Minimum paid months percentage required' },
            { key: 'MIN_ACADEMIC_SCORE', value: '50', description: 'Minimum academic exam score required' },
        ]
    })

    console.log('Seeding core administrative accounts & members...')
    const roles = [
        { email: 'admin@fenot.com', role: 'SUPER_ADMIN', firstName: 'Super', lastName: 'Admin', department: 'OTHER' },
        { email: 'affairs@fenot.com', role: 'MEMBERS_AFFAIRS', firstName: 'Members', lastName: 'Affairs', department: 'OTHER' },
        { email: 'finance@fenot.com', role: 'FINANCE', firstName: 'Finance', lastName: 'Officer', department: 'OTHER' },
        { email: 'education@fenot.com', role: 'EDUCATION', firstName: 'Education', lastName: 'Coordinator', department: 'SUNDAY_SCHOOL' },
        { email: 'choir@fenot.com', role: 'CHOIR', firstName: 'Choir', lastName: 'Director', department: 'CHOIR' },
        { email: 'office@fenot.com', role: 'OFFICE', firstName: 'Office', lastName: 'Secretary', department: 'OTHER' },
        { email: 'member@fenot.com', role: 'MEMBER', firstName: 'John', lastName: 'Doe', department: 'OTHER' },
    ]

    const usersMap = {}
    for (const r of roles) {
        const u = await prisma.user.create({
            data: {
                email: r.email,
                password,
                role: r.role,
                profile: {
                    create: {
                        firstName: r.firstName,
                        lastName: r.lastName,
                        department: r.department,
                    }
                }
            },
            include: { profile: true }
        })
        usersMap[r.email] = u
        console.log(`Created core user: ${r.email} with profile`)
    }

    console.log('Seeding test members for pipeline validation...')
    
    // Member A (The Ideal Member)
    // 90 days of 100% attendance, 6 months of paid monthly contributions, 90% exam score -> computed ELIGIBLE
    const memberA = await prisma.user.create({
        data: {
            email: 'ideal@fenot.com',
            password,
            role: 'MEMBER',
            profile: {
                create: {
                    firstName: 'Ideal',
                    lastName: 'Member',
                    department: 'SUNDAY_SCHOOL'
                }
            }
        },
        include: { profile: true }
    })

    // Seed 90 days of high attendance
    const attendanceDataA = []
    const baseDate = new Date()
    for (let i = 0; i < 90; i++) {
        const date = new Date()
        date.setDate(baseDate.getDate() - i)
        attendanceDataA.push({
            memberId: memberA.profile.id,
            date,
            type: 'SUNDAY_SERVICE',
            status: 'PRESENT'
        })
    }
    await prisma.attendance.createMany({ data: attendanceDataA })

    // Seed 6 months of PAID monthly contributions
    const financeDataA = []
    for (let i = 0; i < 6; i++) {
        const date = new Date()
        date.setMonth(baseDate.getMonth() - i)
        financeDataA.push({
            memberId: memberA.profile.id,
            amount: 100.0,
            type: 'MONTHLY_CONTRIBUTION',
            status: 'PAID',
            date,
            description: `Monthly contribution - Month ${i+1}`,
            verified: true,
            recordedById: usersMap['finance@fenot.com'].id
        })
    }
    await prisma.financialRecord.createMany({ data: financeDataA })

    // Seed high exam scores (90%)
    await prisma.academicRecord.create({
        data: {
            memberId: memberA.profile.id,
            year: 2026,
            semester: '1st',
            status: 'ENROLLED',
            subjectName: 'Church History',
            examScore: 90.0,
            totalScore: 100.0,
            gradeLabel: 'A',
            recordedById: usersMap['education@fenot.com'].id
        }
    })

    // Compute and Seed ServiceEligibility
    await prisma.serviceEligibility.create({
        data: {
            memberId: memberA.profile.id,
            status: 'ELIGIBLE',
            reason: 'All criteria met',
            attendanceRate: 100.0,
            financeRate: 100.0,
            academicScore: 90.0,
            computedAt: new Date()
        }
    })
    console.log('Created Member A: ideal@fenot.com')


    // Member B (The Attendance Defaulter)
    // 40% attendance, perfect finances, perfect grades -> computed INELIGIBLE
    const memberB = await prisma.user.create({
        data: {
            email: 'attendance_defaulter@fenot.com',
            password,
            role: 'MEMBER',
            profile: {
                create: {
                    firstName: 'Attendance',
                    lastName: 'Defaulter',
                    department: 'CHOIR'
                }
            }
        },
        include: { profile: true }
    })

    // Seed attendance (40% rate: 4 PRESENT, 6 ABSENT out of 10 records)
    const attendanceDataB = []
    for (let i = 0; i < 10; i++) {
        const date = new Date()
        date.setDate(baseDate.getDate() - i)
        attendanceDataB.push({
            memberId: memberB.profile.id,
            date,
            type: 'CHOIR_PRACTICE',
            status: i < 4 ? 'PRESENT' : 'ABSENT'
        })
    }
    await prisma.attendance.createMany({ data: attendanceDataB })

    // Seed perfect finances
    const financeDataB = []
    for (let i = 0; i < 6; i++) {
        const date = new Date()
        date.setMonth(baseDate.getMonth() - i)
        financeDataB.push({
            memberId: memberB.profile.id,
            amount: 100.0,
            type: 'MONTHLY_CONTRIBUTION',
            status: 'PAID',
            date,
            description: `Monthly contribution - Month ${i+1}`,
            verified: true,
            recordedById: usersMap['finance@fenot.com'].id
        })
    }
    await prisma.financialRecord.createMany({ data: financeDataB })

    // Seed perfect grades (100%)
    await prisma.academicRecord.create({
        data: {
            memberId: memberB.profile.id,
            year: 2026,
            semester: '1st',
            status: 'ENROLLED',
            subjectName: 'Liturgy',
            examScore: 100.0,
            totalScore: 100.0,
            gradeLabel: 'A+',
            recordedById: usersMap['education@fenot.com'].id
        }
    })

    // Compute and Seed ServiceEligibility
    await prisma.serviceEligibility.create({
        data: {
            memberId: memberB.profile.id,
            status: 'INELIGIBLE',
            reason: 'Attendance 40% < 70%',
            attendanceRate: 40.0,
            financeRate: 100.0,
            academicScore: 100.0,
            computedAt: new Date()
        }
    })
    console.log('Created Member B: attendance_defaulter@fenot.com')


    // Member C (The Financial Defaulter)
    // 100% attendance, perfect grades, last 4 monthly contributions PENDING/OVERDUE -> computed INELIGIBLE
    const memberC = await prisma.user.create({
        data: {
            email: 'financial_defaulter@fenot.com',
            password,
            role: 'MEMBER',
            profile: {
                create: {
                    firstName: 'Financial',
                    lastName: 'Defaulter',
                    department: 'DEACONS'
                }
            }
        },
        include: { profile: true }
    })

    // Seed perfect attendance
    const attendanceDataC = []
    for (let i = 0; i < 10; i++) {
        const date = new Date()
        date.setDate(baseDate.getDate() - i)
        attendanceDataC.push({
            memberId: memberC.profile.id,
            date,
            type: 'SUNDAY_SERVICE',
            status: 'PRESENT'
        })
    }
    await prisma.attendance.createMany({ data: attendanceDataC })

    // Seed poor finances (2 paid, 4 overdue/pending -> 33.3% rate)
    const financeDataC = []
    for (let i = 0; i < 6; i++) {
        const date = new Date()
        date.setMonth(baseDate.getMonth() - i)
        financeDataC.push({
            memberId: memberC.profile.id,
            amount: 100.0,
            type: 'MONTHLY_CONTRIBUTION',
            status: i < 2 ? 'PAID' : (i < 4 ? 'OVERDUE' : 'PENDING'),
            date,
            description: `Monthly contribution - Month ${i+1}`,
            verified: i < 2,
            recordedById: usersMap['finance@fenot.com'].id
        })
    }
    await prisma.financialRecord.createMany({ data: financeDataC })

    // Seed perfect grades (100%)
    await prisma.academicRecord.create({
        data: {
            memberId: memberC.profile.id,
            year: 2026,
            semester: '1st',
            status: 'ENROLLED',
            subjectName: 'Dogmatics',
            examScore: 100.0,
            totalScore: 100.0,
            gradeLabel: 'A+',
            recordedById: usersMap['education@fenot.com'].id
        }
    })

    // Compute and Seed ServiceEligibility
    await prisma.serviceEligibility.create({
        data: {
            memberId: memberC.profile.id,
            status: 'INELIGIBLE',
            reason: 'Finance 33% < 60%',
            attendanceRate: 100.0,
            financeRate: 33.3,
            academicScore: 100.0,
            computedAt: new Date()
        }
    })
    console.log('Created Member C: financial_defaulter@fenot.com')


    // Member D (The Manual Override Case)
    // poor metrics across the board, but manual override APPROVED
    const memberD = await prisma.user.create({
        data: {
            email: 'override@fenot.com',
            password,
            role: 'MEMBER',
            profile: {
                create: {
                    firstName: 'Override',
                    lastName: 'Case',
                    department: 'OTHER'
                }
            }
        },
        include: { profile: true }
    })

    // Seed poor attendance (10%)
    const attendanceDataD = []
    for (let i = 0; i < 10; i++) {
        const date = new Date()
        date.setDate(baseDate.getDate() - i)
        attendanceDataD.push({
            memberId: memberD.profile.id,
            date,
            type: 'SUNDAY_SERVICE',
            status: i === 0 ? 'PRESENT' : 'ABSENT'
        })
    }
    await prisma.attendance.createMany({ data: attendanceDataD })

    // Seed poor finances (0% paid)
    const financeDataD = []
    for (let i = 0; i < 6; i++) {
        const date = new Date()
        date.setMonth(baseDate.getMonth() - i)
        financeDataD.push({
            memberId: memberD.profile.id,
            amount: 100.0,
            type: 'MONTHLY_CONTRIBUTION',
            status: 'OVERDUE',
            date,
            description: `Monthly contribution - Month ${i+1}`,
            verified: false
        })
    }
    await prisma.financialRecord.createMany({ data: financeDataD })

    // Seed poor grades (20%)
    await prisma.academicRecord.create({
        data: {
            memberId: memberD.profile.id,
            year: 2026,
            semester: '1st',
            status: 'ENROLLED',
            subjectName: 'Patrology',
            examScore: 20.0,
            totalScore: 100.0,
            gradeLabel: 'F',
            recordedById: usersMap['education@fenot.com'].id
        }
    })

    // Seed ServiceEligibility with Manual Override APPROVED
    await prisma.serviceEligibility.create({
        data: {
            memberId: memberD.profile.id,
            status: 'ELIGIBLE', // Approved override
            reason: 'Attendance 10% < 70%; Finance 0% < 60%; Academic score 20% < 50%',
            attendanceRate: 10.0,
            financeRate: 0.0,
            academicScore: 20.0,
            overriddenById: usersMap['affairs@fenot.com'].id,
            overrideReason: 'Special health dispensation',
            computedAt: new Date()
        }
    })
    console.log('Created Member D: override@fenot.com')


    console.log('Seeding asset management records...')
    const assets = [
        { name: 'Yamaha Keyboard', category: 'AUDIO', status: 'FUNCTIONAL' },
        { name: 'Sound Mixer', category: 'AUDIO', status: 'MAINTENANCE' },
        { name: 'Main Hall Chairs', category: 'FURNITURE', status: 'FUNCTIONAL' },
        { name: 'Wireless Microphone Set', category: 'AUDIO', status: 'FUNCTIONAL' },
        { name: 'Office Wooden Desk', category: 'FURNITURE', status: 'FUNCTIONAL' },
    ]
    await prisma.asset.createMany({ data: assets })
    console.log('Asset management records seeded successfully.')
    
    console.log('Seeding announcements & general audit log items...')
    await prisma.announcement.create({
        data: {
            title: 'Welcome to the New Fenot CMS',
            content: 'The new Church Management System is now live! Admins can oversee finances, grades, attendance, and member eligibility.',
            isActive: true,
            authorId: usersMap['admin@fenot.com'].id
        }
    })
    
    await prisma.auditLog.create({
        data: {
            action: 'USER_CREATE',
            details: 'Seeded initial system accounts and dynamic testing cohort',
            userId: usersMap['admin@fenot.com'].id
        }
    })

    console.log('Database seeding successfully finished!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
