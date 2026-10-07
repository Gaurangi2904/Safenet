import prisma from "../prisma";

interface AuditLogData {
    userId: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
}

export const createAuditLog = async ({
    userId,
    action,
    entity,
    entityId,
    details,
    ipAddress,
    userAgent
}: AuditLogData) => {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId: entityId ?? null,
                details: details ?? null,
                ipAddress: ipAddress ?? null,
                userAgent: userAgent ?? null
            }
        });
    } catch (error) {
        console.error("Audit log creation error:", error);
    }
};
