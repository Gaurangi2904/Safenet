import { Router } from "express";
import prisma from "../prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

/**
 * POST /api/v1/checkins
 * Create a new safety check-in
 */
router.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const userId = req.user.userId;

      const {
        location,
        message,
        checkInAt,
        expiresAt,
      } = req.body;

      if (!checkInAt || !expiresAt) {
        return res.status(400).json({
          success: false,
          message: "checkInAt and expiresAt are required",
        });
      }

      const checkIn = await prisma.checkIn.create({
        data: {
          userId,
          location: location || null,
          message: message || null,
          checkInAt: new Date(checkInAt),
          expiresAt: new Date(expiresAt),
          status: "ACTIVE",
        },
      });

      return res.status(201).json({
        success: true,
        checkIn,
      });
    } catch (error) {
      console.error("Create check-in error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create check-in",
      });
    }
  }
);


/**
 * GET /api/v1/checkins
 * Get current user's check-ins
 */
router.get(
  "/",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const userId = req.user.userId;
      const now = new Date();

      // Mark expired check-ins as EXPIRED
      await prisma.checkIn.updateMany({
        where: {
          userId,
          status: "ACTIVE",
          expiresAt: {
            lt: now,
          },
        },
        data: {
          status: "EXPIRED",
        },
      });

      const checkIns = await prisma.checkIn.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.json({
        success: true,
        checkIns,
      });
    } catch (error) {
      console.error("Get check-ins error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch check-ins",
      });
    }
  }
);


export default router;