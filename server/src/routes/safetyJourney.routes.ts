import { Router } from "express";
import prisma from "../prisma";
import {
    authenticateToken,
    AuthRequest
} from "../middleware/auth.middleware";

const router = Router();

// Create safety journey
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { destination } = req.body;

        if (!destination) {
            return res.status(400).json({
                success: false,
                message: "Destination is required"
            });
        }

        const journey = await prisma.safetyJourney.create({
            data: {
                destination,
                userId: req.user!.userId
            }
        });

        res.status(201).json({
            success: true,
            message: "Safety journey created successfully",
            journey
        });
    } catch (error) {
        console.error("Create safety journey error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create safety journey"
        });
    }
});

// Get my safety journeys
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const journeys = await prisma.safetyJourney.findMany({
            where: {
                userId: req.user!.userId
            },
            orderBy: {
                startedAt: "desc"
            }
        });

        res.json({
            success: true,
            journeys
        });
    } catch (error) {
        console.error("Get safety journeys error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch safety journeys"
        });
    }
});

// End safety journey
router.put("/:id/end", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const id = String(req.params.id);

        const existingJourney = await prisma.safetyJourney.findFirst({
            where: {
                id,
                userId: req.user!.userId
            }
        });

        if (!existingJourney) {
            return res.status(404).json({
                success: false,
                message: "Safety journey not found"
            });
        }

        const journey = await prisma.safetyJourney.update({
            where: {
                id
            },
            data: {
                status: "COMPLETED",
                endedAt: new Date()
            }
        });

        res.json({
            success: true,
            message: "Safety journey completed successfully",
            journey
        });
    } catch (error) {
        console.error("End safety journey error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to complete safety journey"
        });
    }
});

export default router;