import prisma from "@/lib/prisma"

export async function logAction(userId: string, action: string, details?: string, targetId?: string) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                details,
                targetId
            }
        })
    } catch (error) {
        console.error("Failed to create audit log:", error)
    }
}
