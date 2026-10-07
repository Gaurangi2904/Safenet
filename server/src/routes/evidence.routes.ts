import { Router } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";

import prisma from "../prisma";
import {
    authenticateToken,
    AuthRequest
} from "../middleware/auth.middleware";
import { createAuditLog } from "../utils/auditLogger";

const router = Router();

const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "text/plain"
];

const evidenceUploadDirectory = path.resolve(
    process.cwd(),
    "uploads",
    "evidence"
);

if (!fs.existsSync(evidenceUploadDirectory)) {
    fs.mkdirSync(evidenceUploadDirectory, {
        recursive: true
    });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, evidenceUploadDirectory);
    },

    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname);

        cb(
            null,
            `${crypto.randomUUID()}${extension}`
        );
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (_req, file, cb) => {
        if (!allowedFileTypes.includes(file.mimetype)) {
            cb(
                new Error(
                    "Unsupported file type. Allowed types: JPEG, PNG, WEBP, PDF, TXT."
                )
            );

            return;
        }

        cb(null, true);
    }
});


// CREATE EVIDENCE RECORD
router.post(
    "/",
    authenticateToken,
    async (req: AuthRequest, res) => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }

            const {
                fileName,
                fileType,
                fileSize,
                storagePath,
                fileHash,
                description,
                incidentId
            } = req.body;

            if (!fileName || !fileType) {
                return res.status(400).json({
                    success: false,
                    message:
                        "fileName and fileType are required"
                });
            }

            if (!allowedFileTypes.includes(fileType)) {
                return res.status(400).json({
                    success: false,
                    message: "Unsupported file type"
                });
            }

            if (incidentId) {
                const incident =
                    await prisma.incident.findFirst({
                        where: {
                            id: incidentId,
                            userId
                        }
                    });

                if (!incident) {
                    return res.status(404).json({
                        success: false,
                        message: "Incident not found"
                    });
                }
            }

            const evidence =
                await prisma.evidenceRecord.create({
                    data: {
                        fileName,
                        fileType,
                        fileSize:
                            fileSize ?? null,
                        storagePath:
                            storagePath ?? null,
                        fileHash:
                            fileHash ?? null,
                        description:
                            description ?? null,
                        userId,
                        incidentId:
                            incidentId ?? null
                    }
                });

            await createAuditLog({
                userId,
                action: "CREATE",
                entity: "EVIDENCE",
                entityId: evidence.id,
                details:
                    `Evidence "${evidence.fileName}" was created`,
                ipAddress: req.ip,
                userAgent:
                    req.get("user-agent") ??
                    undefined
            });

            return res.status(201).json({
                success: true,
                message:
                    "Evidence record created successfully",
                evidence
            });

        } catch (error) {
            console.error(
                "Create evidence error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to create evidence record"
            });
        }
    }
);


// UPLOAD EVIDENCE FILE
router.post(
    "/upload",
    authenticateToken,
    (req: AuthRequest, res, next) => {
        upload.single("file")(
            req,
            res,
            (error) => {
                if (error instanceof multer.MulterError) {
                    if (
                        error.code ===
                        "LIMIT_FILE_SIZE"
                    ) {
                        return res.status(400).json({
                            success: false,
                            message:
                                "File size cannot exceed 10 MB"
                        });
                    }

                    return res.status(400).json({
                        success: false,
                        message: error.message
                    });
                }

                if (error) {
                    return res.status(400).json({
                        success: false,
                        message:
                            error.message
                    });
                }

                next();
            }
        );
    },
    async (req: AuthRequest, res) => {
        let uploadedFilePath:
            string | null = null;

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
                    message:
                        "Please select a file"
                });
            }

            uploadedFilePath =
                req.file.path;

            const {
                description,
                incidentId
            } = req.body;

            // Verify incident belongs to
            // logged-in user
            if (incidentId) {
                const incident =
                    await prisma.incident.findFirst({
                        where: {
                            id: incidentId,
                            userId
                        }
                    });

                if (!incident) {
                    fs.unlinkSync(
                        uploadedFilePath
                    );

                    uploadedFilePath = null;

                    return res.status(404).json({
                        success: false,
                        message:
                            "Incident not found"
                    });
                }
            }

            // Calculate SHA-256 hash
            // on the server
            const fileBuffer =
                fs.readFileSync(
                    uploadedFilePath
                );

            const fileHash =
                crypto
                    .createHash("sha256")
                    .update(fileBuffer)
                    .digest("hex");

            // Store relative path
            // in database
            const storagePath =
                path
                    .join(
                        "uploads",
                        "evidence",
                        req.file.filename
                    )
                    .replace(/\\/g, "/");

            const evidence =
                await prisma.evidenceRecord.create({
                    data: {
                        fileName:
                            req.file.originalname,
                        fileType:
                            req.file.mimetype,
                        fileSize:
                            req.file.size,
                        storagePath,
                        fileHash,
                        description:
                            description?.trim() ||
                            null,
                        userId,
                        incidentId:
                            incidentId ||
                            null
                    }
                });

            // Database creation succeeded,
            // so cleanup is no longer needed
            uploadedFilePath = null;

            await createAuditLog({
                userId,
                action: "CREATE",
                entity: "EVIDENCE",
                entityId: evidence.id,
                details:
                    `Evidence "${evidence.fileName}" was uploaded`,
                ipAddress: req.ip,
                userAgent:
                    req.get("user-agent") ??
                    undefined
            });

            return res.status(201).json({
                success: true,
                message:
                    "Evidence file uploaded successfully",
                evidence
            });

        } catch (error) {
            console.error(
                "Evidence upload error:",
                error
            );

            // Remove physical file if
            // database creation failed
            if (
                uploadedFilePath &&
                fs.existsSync(
                    uploadedFilePath
                )
            ) {
                try {
                    fs.unlinkSync(
                        uploadedFilePath
                    );
                } catch (cleanupError) {
                    console.error(
                        "Failed to clean up uploaded file:",
                        cleanupError
                    );
                }
            }

            return res.status(500).json({
                success: false,
                message:
                    "Failed to upload evidence file"
            });
        }
    }
);


// GET ALL EVIDENCE BELONGING
// TO LOGGED-IN USER
router.get(
    "/",
    authenticateToken,
    async (req: AuthRequest, res) => {
        try {
            const userId =
                req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Unauthorized"
                });
            }

            const evidence =
                await prisma.evidenceRecord.findMany({
                    where: {
                        userId
                    },
                    orderBy: {
                        createdAt:
                            "desc"
                    }
                });

            return res.status(200).json({
                success: true,
                count:
                    evidence.length,
                evidence
            });

        } catch (error) {
            console.error(
                "Get evidence error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch evidence"
            });
        }
    }
);


// GET SINGLE EVIDENCE RECORD
router.get(
    "/:id",
    authenticateToken,
    async (req: AuthRequest, res) => {
        try {
            const userId =
                req.user?.userId;

            const evidenceId =
                String(req.params.id);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Unauthorized"
                });
            }

            const evidence =
                await prisma.evidenceRecord.findFirst({
                    where: {
                        id: evidenceId,
                        userId
                    }
                });

            if (!evidence) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Evidence not found"
                });
            }

            return res.status(200).json({
                success: true,
                evidence
            });

        } catch (error) {
            console.error(
                "Get evidence error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch evidence"
            });
        }
    }
);


// DELETE EVIDENCE RECORD
// AND PHYSICAL FILE
router.delete(
    "/:id",
    authenticateToken,
    async (req: AuthRequest, res) => {
        try {
            const userId =
                req.user?.userId;

            const evidenceId =
                String(req.params.id);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Unauthorized"
                });
            }

            const evidence =
                await prisma.evidenceRecord.findFirst({
                    where: {
                        id: evidenceId,
                        userId
                    }
                });

            if (!evidence) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Evidence not found"
                });
            }

            // Delete physical file
            if (evidence.storagePath) {
                const filePath =
                    path.resolve(
                        process.cwd(),
                        evidence.storagePath
                    );

                const evidenceDirectory =
                    path.resolve(
                        process.cwd(),
                        "uploads",
                        "evidence"
                    );

                const normalizedFilePath =
                    path.resolve(
                        filePath
                    );

                // Security check
                if (
                    normalizedFilePath !==
                        evidenceDirectory &&
                    !normalizedFilePath.startsWith(
                        evidenceDirectory +
                            path.sep
                    )
                ) {
                    return res.status(403).json({
                        success: false,
                        message:
                            "Access to this file is not allowed"
                    });
                }

                if (
                    fs.existsSync(
                        normalizedFilePath
                    )
                ) {
                    fs.unlinkSync(
                        normalizedFilePath
                    );
                }
            }

            // Delete database record
            await prisma.evidenceRecord.delete({
                where: {
                    id: evidenceId
                }
            });

            await createAuditLog({
                userId,
                action: "DELETE",
                entity: "EVIDENCE",
                entityId: evidenceId,
                details:
                    `Evidence "${evidence.fileName}" was deleted`,
                ipAddress: req.ip,
                userAgent:
                    req.get("user-agent") ??
                    undefined
            });

            return res.status(200).json({
                success: true,
                message:
                    "Evidence file and record deleted successfully"
            });

        } catch (error) {
            console.error(
                "Delete evidence error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to delete evidence"
            });
        }
    }
);


// SECURE EVIDENCE FILE ACCESS
router.get(
    "/file/:id",
    authenticateToken,
    async (req: AuthRequest, res) => {
        try {
            const userId =
                req.user?.userId;

            const evidenceId =
                String(req.params.id);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Unauthorized"
                });
            }

            const evidence =
                await prisma.evidenceRecord.findFirst({
                    where: {
                        id: evidenceId,
                        userId
                    }
                });

            if (!evidence) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Evidence not found"
                });
            }

            if (!evidence.storagePath) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Evidence file is not available"
                });
            }

            const filePath =
                path.resolve(
                    process.cwd(),
                    evidence.storagePath
                );

            const evidenceDirectory =
                path.resolve(
                    process.cwd(),
                    "uploads",
                    "evidence"
                );

            const normalizedFilePath =
                path.resolve(
                    filePath
                );

            // Security check
            if (
                normalizedFilePath !==
                    evidenceDirectory &&
                !normalizedFilePath.startsWith(
                    evidenceDirectory +
                        path.sep
                )
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Access to this file is not allowed"
                });
            }

            if (
                !fs.existsSync(
                    normalizedFilePath
                )
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Evidence file not found on server"
                });
            }

            await createAuditLog({
                userId,
                action: "ACCESS",
                entity: "EVIDENCE_FILE",
                entityId: evidenceId,
                details:
                    `Evidence file "${evidence.fileName}" was accessed`,
                ipAddress: req.ip,
                userAgent:
                    req.get("user-agent") ??
                    undefined
            });

            return res.sendFile(
                normalizedFilePath,
                {
                    headers: {
                        "Content-Disposition":
                            `inline; filename="${evidence.fileName}"`
                    }
                }
            );

        } catch (error) {
            console.error(
                "Evidence file access error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to access evidence file"
            });
        }
    }
);


// VERIFY EVIDENCE FILE INTEGRITY
router.get(
    "/verify/:id",
    authenticateToken,
    async (req: AuthRequest, res) => {
        try {
            const userId =
                req.user?.userId;

            const evidenceId =
                String(req.params.id);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Unauthorized"
                });
            }

            const evidence =
                await prisma.evidenceRecord.findFirst({
                    where: {
                        id: evidenceId,
                        userId
                    }
                });

            if (!evidence) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Evidence not found"
                });
            }

            if (!evidence.storagePath) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Evidence file is not available"
                });
            }

            if (!evidence.fileHash) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Evidence hash is not available"
                });
            }

            const filePath =
                path.resolve(
                    process.cwd(),
                    evidence.storagePath
                );

            const evidenceDirectory =
                path.resolve(
                    process.cwd(),
                    "uploads",
                    "evidence"
                );

            const normalizedFilePath =
                path.resolve(
                    filePath
                );

            // Security check
            if (
                normalizedFilePath !==
                    evidenceDirectory &&
                !normalizedFilePath.startsWith(
                    evidenceDirectory +
                        path.sep
                )
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Access to this file is not allowed"
                });
            }

            if (
                !fs.existsSync(
                    normalizedFilePath
                )
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Evidence file not found on server"
                });
            }

            // Calculate current SHA-256 hash
            const fileBuffer =
                fs.readFileSync(
                    normalizedFilePath
                );

            const currentHash =
                crypto
                    .createHash("sha256")
                    .update(fileBuffer)
                    .digest("hex");

            const isIntact =
                currentHash ===
                evidence.fileHash;

            await createAuditLog({
                userId,
                action: "VERIFY",
                entity:
                    "EVIDENCE_INTEGRITY",
                entityId: evidenceId,
                details:
                    `Integrity verification completed for "${evidence.fileName}" - ${isIntact ? "VALID" : "MODIFIED"}`,
                ipAddress: req.ip,
                userAgent:
                    req.get("user-agent") ??
                    undefined
            });

            return res.status(200).json({
                success: true,
                evidenceId:
                    evidence.id,
                fileName:
                    evidence.fileName,
                integrity:
                    isIntact
                        ? "VALID"
                        : "MODIFIED",
                isIntact,
                storedHash:
                    evidence.fileHash,
                currentHash
            });

        } catch (error) {
            console.error(
                "Evidence integrity verification error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to verify evidence integrity"
            });
        }
    }
);


export default router;