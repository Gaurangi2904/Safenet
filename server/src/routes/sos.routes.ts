import { Router } from "express";
import prisma from "../prisma";
import {
    authenticateToken,
    AuthRequest
} from "../middleware/auth.middleware";

const router = Router();

// Trigger emergency SOS
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { latitude, longitude, journeyId } = req.body;

        if (journeyId) {
            const journey = await prisma.safetyJourney.findFirst({
                where: {
                    id: journeyId,
                    userId: req.user!.userId
                }
            });

            if (!journey) {
                return res.status(404).json({
                    success: false,
                    message: "Safety journey not found"
                });
            }
        }

        const sosEvent = await prisma.sosEvent.create({
            data: {
                latitude,
                longitude,
                journeyId: journeyId || null,
                userId: req.user!.userId,
                status: "ACTIVE"
            }
        });

        res.status(201).json({
            success: true,
            message: "Emergency SOS activated",
            sosEvent
        });
    } catch (error) {
        console.error("SOS activation error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to activate emergency SOS"
        });
    }
});

// Get my SOS events
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const sosEvents = await prisma.sosEvent.findMany({
            where: {
                userId: req.user!.userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json({
            success: true,
            sosEvents
        });
    } catch (error) {
        console.error("Get SOS events error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch SOS events"
        });
    }
});

// Resolve emergency SOS
router.put("/:id/resolve", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const id = String(req.params.id);

        const existingSos = await prisma.sosEvent.findFirst({
            where: {
                id,
                userId: req.user!.userId
            }
        });

        if (!existingSos) {
            return res.status(404).json({
                success: false,
                message: "SOS event not found"
            });
        }

        const sosEvent = await prisma.sosEvent.update({
            where: {
                id
            },
            data: {
                status: "RESOLVED"
            }
        });

        res.json({
            success: true,
            message: "Emergency SOS resolved successfully",
            sosEvent
        });
    } catch (error) {
        console.error("Resolve SOS error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to resolve SOS"
        });
    }
});

export default router;