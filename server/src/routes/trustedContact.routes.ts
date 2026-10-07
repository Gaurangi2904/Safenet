import { Router } from "express";
import prisma from "../prisma";
import {
    authenticateToken,
    AuthRequest
} from "../middleware/auth.middleware";

const router = Router();

// Add trusted contact
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { name, phone, relation, isPrimary } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name and phone are required"
            });
        }

        const contact = await prisma.trustedContact.create({
            data: {
                name,
                phone,
                relation,
                isPrimary: isPrimary ?? false,
                userId: req.user!.userId
            }
        });

        res.status(201).json({
            success: true,
            message: "Trusted contact added successfully",
            contact
        });
    } catch (error) {
        console.error("Add trusted contact error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add trusted contact"
        });
    }
});

// Get my trusted contacts
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const contacts = await prisma.trustedContact.findMany({
            where: {
                userId: req.user!.userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json({
            success: true,
            contacts
        });
    } catch (error) {
        console.error("Get trusted contacts error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch trusted contacts"
        });
    }
});

// Update trusted contact
router.put("/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const id = String(req.params.id);
        const { name, phone, relation, isPrimary } = req.body;

        const existingContact = await prisma.trustedContact.findFirst({
            where: {
                id,
                userId: req.user!.userId
            }
        });

        if (!existingContact) {
            return res.status(404).json({
                success: false,
                message: "Trusted contact not found"
            });
        }

        const contact = await prisma.trustedContact.update({
            where: {
                id
            },
            data: {
                name,
                phone,
                relation,
                isPrimary
            }
        });

        res.json({
            success: true,
            message: "Trusted contact updated successfully",
            contact
        });
    } catch (error) {
        console.error("Update trusted contact error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update trusted contact"
        });
    }
});

// Delete trusted contact
router.delete("/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
        const id = String(req.params.id);

        const existingContact = await prisma.trustedContact.findFirst({
            where: {
                id,
                userId: req.user!.userId
            }
        });

        if (!existingContact) {
            return res.status(404).json({
                success: false,
                message: "Trusted contact not found"
            });
        }

        await prisma.trustedContact.delete({
            where: {
                id
            }
        });

        res.json({
            success: true,
            message: "Trusted contact deleted successfully"
        });
    } catch (error) {
        console.error("Delete trusted contact error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete trusted contact"
        });
    }
});

export default router;