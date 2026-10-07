import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { createAuditLog } from "../utils/auditLogger";
import prisma from "../prisma";
import {
    authenticateToken,
    AuthRequest
} from "../middleware/auth.middleware";

const router = Router();

const uploadDirectory = path.join(
    process.cwd(),
    "uploads",
    "evidence"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true
    });
}

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "text/plain"
];

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (_req, file, cb) => {
        const uniqueName =
            `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (_req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
                new Error("Unsupported file type")
            );
        }

        cb(null, true);
    }
});


// REAL FILE UPLOAD
router.post(
    "/",
    authenticateToken,
    upload.single("file"),
    async (req: AuthRequest, res) => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Evidence file is required"
                });
            }

            const {
                description,
                incidentId
            } = req.body;

            // Validate incident ownership
            if (incidentId) {
                const incident =
                    await prisma.incident.findFirst({
                        where: {
                            id: incidentId,
                            userId
                        }
                    });

                if (!incident) {
                    if (fs.existsSync(req.file.path)) {
                        fs.unlinkSync(req.file.path);
                    }

                    return res.status(404).json({
                        success: false,
                        message: "Incident not found"
                    });
                }
            }

            // Read uploaded file
            const fileBuffer =
                fs.readFileSync(req.file.path);

            // Generate SHA-256 hash
            const fileHash =
                crypto
                    .createHash("sha256")
                    .update(fileBuffer)
                    .digest("hex");

            // Store relative path in database
            const relativeStoragePath =
                path.relative(
                    process.cwd(),
                    req.file.path
                );

            // Create evidence database record
            const evidence =
                await prisma.evidenceRecord.create({
                    data: {
                        fileName: req.file.originalname,
                        fileType: req.file.mimetype,
                        fileSize: req.file.size,
                        storagePath: relativeStoragePath,
                        fileHash,
                        description:
                            description ?? null,
                        userId,
                        incidentId:
                            incidentId ?? null
                    }
                });

            // Create audit log
            await createAuditLog({
                userId,
                action: "UPLOAD",
                entity: "EVIDENCE",
                entityId: evidence.id,
                details:
                    `Evidence file "${evidence.fileName}" was uploaded`,
                ipAddress: req.ip,
                userAgent:
                    req.get("user-agent") ?? undefined
            });

            return res.status(201).json({
                success: true,
                message: "Evidence file uploaded successfully",
                evidence
            });

        } catch (error) {
            console.error(
                "Evidence upload error:",
                error
            );

            // Delete uploaded file if something fails
            if (req.file?.path) {
                try {
                    if (fs.existsSync(req.file.path)) {
                        fs.unlinkSync(req.file.path);
                    }
                } catch (cleanupError) {
                    console.error(
                        "File cleanup error:",
                        cleanupError
                    );
                }
            }

            // Multer-specific errors
            if (error instanceof multer.MulterError) {

                if (error.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({
                        success: false,
                        message:
                            "File size must not exceed 10 MB"
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            // Unsupported file type
            if (
                error instanceof Error &&
                error.message === "Unsupported file type"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Unsupported file type. Allowed types: JPEG, PNG, WEBP, PDF and TXT"
                });
            }

            // Generic server error
            return res.status(500).json({
                success: false,
                message: "Failed to upload evidence"
            });
        }
    }
);

export default router;