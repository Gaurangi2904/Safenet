import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import prisma from "./prisma";
import authRoutes from "./routes/auth.routes";
import { authenticateToken, AuthRequest } from "./middleware/auth.middleware";
import trustedContactRoutes from "./routes/trustedContact.routes";
import safetyJourneyRoutes from "./routes/safetyJourney.routes";
import sosRoutes from "./routes/sos.routes";
import checkinRoutes from "./routes/checkin.routes";
import incidentRoutes from "./routes/incident.routes";
import journalRoutes from "./routes/journal.routes";
import evidenceRoutes from "./routes/evidence.routes";
import evidenceUploadRoutes from "./routes/evidenceUpload.routes";
import auditRoutes from "./routes/audit.routes";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// Enable frontend requests
app.use(cors());

// Read JSON request body
app.use(express.json());

// Request logger
app.use(morgan("dev"));

// Authentication routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/trusted-contacts", trustedContactRoutes);

app.use("/api/v1/safety-journeys", safetyJourneyRoutes);

app.use("/api/v1/sos", sosRoutes);

// Safety check-ins
app.use("/api/v1/checkins", checkinRoutes);

app.use("/api/v1/incidents", incidentRoutes);

app.use("/api/v1/journal", journalRoutes);
app.use("/api/v1/evidence", evidenceRoutes);

app.use(
    "/api/v1/evidence/upload",
    evidenceUploadRoutes
);

app.use("/api/v1/audit-logs", auditRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SAFENET Backend Running 🚀"
    });
});

// API health check
app.get("/api/v1/health", (req, res) => {
    res.json({
        success: true,
        message: "SAFENET API is healthy",
        timestamp: new Date().toISOString()
    });
});

// Database connection test
app.get("/api/v1/db-test", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            success: true,
            message: "SAFENET database connected successfully"
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// Protected user test route
app.get(
    "/api/v1/auth/me",
    authenticateToken,
    async (req: AuthRequest, res) => {
        try {
            res.json({
                success: true,
                message: "Authentication successful",
                user: req.user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Unable to get user information"
            });
        }
    }
);

// Server port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🛡️ SAFENET server running on http://localhost:${PORT}`);
});