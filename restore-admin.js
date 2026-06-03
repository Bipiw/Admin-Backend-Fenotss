
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Find the user who looks like an admin but is a member
    // We'll search for 'sura' or 'admin'
    const users = await prisma.user.findMany({
        where: {
            email: { contains: 'sura' }
        }
    })

    console.log("Found users:", users)

    if (users.length > 0) {
        const userToRestore = users[0]
        console.log(`Restoring ${userToRestore.email} to SUPER_ADMIN...`)
        await prisma.user.update({
            where: { id: userToRestore.id },
            data: { role: 'SUPER_ADMIN' }
        })
        console.log("Success!")
    } else {
        console.log("No user found matching 'sura'. Listing all:")
        const all = await prisma.user.findMany()
        console.log(all.map(u => ({ email: u.email, role: u.role })))
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
