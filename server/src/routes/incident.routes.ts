import { Router } from "express";
import prisma from "../prisma";
import {
    authenticateToken,
    AuthRequest
} from "../middleware/auth.middleware";

const router = Router();

const allowedSeverities = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL"
];

const allowedStatuses = [
    "DRAFT",
    "OPEN",
    "RESOLVED"
];

const allowedCategories = [
    "DOMESTIC_ABUSE",
    "HARASSMENT",
    "STALKING",
    "ONLINE_HARASSMENT",
    "DOWRY_HARASSMENT",
    "PREGNANCY_REPRODUCTIVE_COERCION",
    "COLLEGE_HARASSMENT",
    "WORKPLACE_HARASSMENT",
    "PUBLIC_HARASSMENT",
    "THREATS",
    "OTHER"
];

/*
    CREATE INCIDENT
    POST /api/v1/incidents
*/
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const {
            category,
            subCategory,
            severity,
            status,
            title,
            description,
            latitude,
            longitude,
            occurredAt
        } = req.body;

        if (!category || !title) {
            return res.status(400).json({
                success: false,
                message: "Category and title are required"
            });
        }

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid incident category"
            });
        }

        if (severity && !allowedSeverities.includes(severity)) {
            return res.status(400).json({
                success: false,
                message: "Invalid incident severity"
            });
        }

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid incident status"
            });
        }

        const incident = await prisma.incident.create({
            data: {
                category,
                subCategory: subCategory || null,
                severity: severity || "MEDIUM",
                status: status || "DRAFT",
                title,
                description: description || null,
                latitude: latitude ?? null,
                longitude: longitude ?? null,
                occurredAt: occurredAt
                    ? new Date(occurredAt)
                    : null,
                userId: req.user!.userId
            }
        });

        res.status(201).json({
            success: true,
            message: "Incident recorded successfully",
            incident
        });
    } catch (error) {
        console.error("Create incident error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to record incident"
        });
    }
});


/*
    GET ALL INCIDENTS
    GET /api/v1/incidents
*/
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const incidents = await prisma.incident.findMany({
            where: {
                userId: req.user!.userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json({
            success: true,
            incidents
        });
    } catch (error) {
        console.error("Get incidents error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch incidents"
        });
    }
});


/*
    GET SINGLE INCIDENT
    GET /api/v1/incidents/:id
*/
router.get("/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const id = String(req.params.id);

        const incident = await prisma.incident.findFirst({
            where: {
                id,
                userId: req.user!.userId
            }
        });

        if (!incident) {
            return res.status(404).json({
                success: false,
                message: "Incident not found"
            });
        }

        res.json({
            success: true,
            incident
        });
    } catch (error) {
        console.error("Get incident error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch incident"
        });
    }
});


/*
    UPDATE INCIDENT
    PUT /api/v1/incidents/:id
*/
router.put("/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const id = String(req.params.id);

        const {
            category,
            subCategory,
            severity,
            status,
            title,
            description,
            latitude,
            longitude,
            occurredAt
        } = req.body;

        const existingIncident = await prisma.incident.findFirst({
            where: {
                id,
                userId: req.user!.userId
            }
        });

        if (!existingIncident) {
            return res.status(404).json({
                success: false,
                message: "Incident not found"
            });
        }

        if (category && !allowedCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid incident category"
            });
        }

        if (severity && !allowedSeverities.includes(severity)) {
            return res.status(400).json({
                success: false,
                message: "Invalid incident severity"
            });
        }

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid incident status"
            });
        }

        const incident = await prisma.incident.update({
            where: {
                id
            },
            data: {
                category,
                subCategory,
                severity,
                status,
                title,
                description,
                latitude,
                longitude,
                occurredAt: occurredAt
                    ? new Date(occurredAt)
                    : undefined
            }
        });

        res.json({
            success: true,
            message: "Incident updated successfully",
            incident
        });
    } catch (error) {
        console.error("Update incident error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update incident"
        });
    }
});


/*
    DELETE INCIDENT
    DELETE /api/v1/incidents/:id
*/
router.delete("/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const id = String(req.params.id);

        const existingIncident = await prisma.incident.findFirst({
            where: {
                id,
                userId: req.user!.userId
            }
        });

        if (!existingIncident) {
            return res.status(404).json({
                success: false,
                message: "Incident not found"
            });
        }

        await prisma.incident.delete({
            where: {
                id
            }
        });

        res.json({
            success: true,
            message: "Incident deleted successfully"
        });
    } catch (error) {
        console.error("Delete incident error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete incident"
        });
    }
});


export default router;