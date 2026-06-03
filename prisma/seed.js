const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('password123', 10)

    const users = [
        {
            email: 'admin@fenot.com',
            role: 'SUPER_ADMIN',
            firstName: 'Admin',
            lastName: 'User',
        },
        {
            email: 'finance@fenot.com',
            role: 'FINANCE',
            firstName: 'Finance',
            lastName: 'Officer',
        },
        {
            email: 'education@fenot.com',
            role: 'EDUCATION',
            firstName: 'Education',
            lastName: 'Coordinator',
        },
        {
            email: 'affairs@fenot.com',
            role: 'MEMBERS_AFFAIRS',
            firstName: 'Members',
            lastName: 'Affairs',
        },
        {
            email: 'member@fenot.com',
            role: 'MEMBER',
            firstName: 'John',
            lastName: 'Doe',
            department: 'CHOIR',
        },
    ]

    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                email: u.email,
                password,
                role: u.role,
                profile: {
                    create: {
                        firstName: u.firstName,
                        lastName: u.lastName,
                        department: u.department || 'OTHER',
                    },
                },
            },
        })
        console.log(`Created/Updated user: ${user.email}`)
    }
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
