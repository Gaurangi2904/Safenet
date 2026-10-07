import { Router } from "express";
import prisma from "../prisma";
import {
    authenticateToken,
    AuthRequest
} from "../middleware/auth.middleware";

const router = Router();

/*
    CREATE JOURNAL ENTRY
    POST /api/v1/journal
*/
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const {
            title,
            content,
            incidentId
        } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        if (incidentId) {
            const incident = await prisma.incident.findFirst({
                where: {
                    id: incidentId,
                    userId: req.user!.userId
                }
            });

            if (!incident) {
                return res.status(404).json({
                    success: false,
                    message: "Incident not found"
                });
            }
        }

        const journalEntry = await prisma.journalEntry.create({
            data: {
                title,
                content,
                incidentId: incidentId || null,
                userId: req.user!.userId
            }
        });

        res.status(201).json({
            success: true,
            message: "Journal entry created successfully",
            journalEntry
        });
    } catch (error) {
        console.error("Create journal entry error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create journal entry"
        });
    }
});


/*
    GET JOURNAL ENTRIES
    GET /api/v1/journal
*/
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const journalEntries = await prisma.journalEntry.findMany({
            where: {
                userId: req.user!.userId
            },
            include: {
                incident: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json({
            success: true,
            journalEntries
        });
    } catch (error) {
        console.error("Get journal entries error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch journal entries"
        });
    }
});


/*
    GET SINGLE JOURNAL ENTRY
    GET /api/v1/journal/:id
*/
router.get("/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const id = String(req.params.id);

        const journalEntry = await prisma.journalEntry.findFirst({
            where: {
                id,
                userId: req.user!.userId
            },
            include: {
                incident: true
            }
        });

        if (!journalEntry) {
            return res.status(404).json({
                success: false,
                message: "Journal entry not found"
            });
        }

        res.json({
            success: true,
            journalEntry
        });
    } catch (error) {
        console.error("Get journal entry error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch journal entry"
        });
    }
});


/*
    UPDATE JOURNAL ENTRY
    PUT /api/v1/journal/:id
*/
router.put("/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const id = String(req.params.id);

        const {
            title,
            content,
            incidentId
        } = req.body;

        const existingEntry = await prisma.journalEntry.findFirst({
            where: {
                id,
                userId: req.user!.userId
            }
        });

        if (!existingEntry) {
            return res.status(404).json({
                success: false,
                message: "Journal entry not found"
            });
        }

        if (incidentId) {
            const incident = await prisma.incident.findFirst({
                where: {
                    id: incidentId,
                    userId: req.user!.userId
                }
            });

            if (!incident) {
                return res.status(404).json({
                    success: false,
                    message: "Incident not found"
                });
            }
        }

        const journalEntry = await prisma.journalEntry.update({
            where: {
                id
            },
            data: {
                title,
                content,
                incidentId: incidentId || null
            }
        });

        res.json({
            success: true,
            message: "Journal entry updated successfully",
            journalEntry
        });
    } catch (error) {
        console.error("Update journal entry error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update journal entry"
        });
    }
});


/*
    DELETE JOURNAL ENTRY
    DELETE /api/v1/journal/:id
*/
router.delete("/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const id = String(req.params.id);

        const existingEntry = await prisma.journalEntry.findFirst({
            where: {
                id,
                userId: req.user!.userId
            }
        });

        if (!existingEntry) {
            return res.status(404).json({
                success: false,
                message: "Journal entry not found"
            });
        }

        await prisma.journalEntry.delete({
            where: {
                id
            }
        });

        res.json({
            success: true,
            message: "Journal entry deleted successfully"
        });
    } catch (error) {
        console.error("Delete journal entry error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete journal entry"
        });
    }
});


export default router;