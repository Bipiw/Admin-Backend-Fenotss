
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const admin = await prisma.user.findFirst({
        where: { role: 'SUPER_ADMIN' }
    })
    if (admin) {
        console.log(`Admin Email: ${admin.email}`)
    } else {
        console.log("No Super Admin found.")
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
