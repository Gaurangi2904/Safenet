import { Router } from "express";

import prisma from "../prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// GET all audit logs belonging to logged-in user
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const auditLogs = await prisma.auditLog.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            success: true,
            count: auditLogs.length,
            auditLogs
        });

    } catch (error) {
        console.error("Get audit logs error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch audit logs"
        });
    }
});


// GET single audit log
router.get("/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.userId;
        const auditId = String(req.params.id);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const auditLog = await prisma.auditLog.findFirst({
            where: {
                id: auditId,
                userId
            }
        });

        if (!auditLog) {
            return res.status(404).json({
                success: false,
                message: "Audit log not found"
            });
        }

        return res.status(200).json({
            success: true,
            auditLog
        });

    } catch (error) {
        console.error("Get audit log error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch audit log"
        });
    }
});


export default router;