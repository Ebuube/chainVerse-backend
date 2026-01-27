const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrowController");
const auth = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/borrows:
 *   post:
 *     summary: Borrow a resource
 *     tags: [Borrows]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resourceId
 *               - resourceType
 *               - resourceTitle
 *             properties:
 *               resourceId:
 *                 type: string
 *               resourceType:
 *                 type: string
 *                 enum: [course, book, material, equipment]
 *               resourceTitle:
 *                 type: string
 *               borrowDurationDays:
 *                 type: number
 *                 default: 14
 */
router.post("/", auth.authMiddleware, borrowController.createBorrow);

/**
 * @swagger
 * /api/borrows:
 *   get:
 *     summary: Get user's borrows
 *     tags: [Borrows]
 *     security:
 *       - BearerAuth: []
 */
router.get("/", auth.authMiddleware, borrowController.getUserBorrows);

/**
 * @swagger
 * /api/borrows/stats:
 *   get:
 *     summary: Get borrow statistics
 *     tags: [Borrows]
 *     security:
 *       - BearerAuth: []
 */
router.get("/stats", auth.authMiddleware, borrowController.getBorrowStats);

/**
 * @swagger
 * /api/borrows/{id}/return:
 *   patch:
 *     summary: Return a borrowed resource
 *     tags: [Borrows]
 *     security:
 *       - BearerAuth: []
 */
router.patch("/:id/return", auth.authMiddleware, borrowController.returnBorrow);

/**
 * @swagger
 * /api/borrows/{id}/renew:
 *   patch:
 *     summary: Renew a borrow
 *     tags: [Borrows]
 *     security:
 *       - BearerAuth: []
 */
router.patch("/:id/renew", auth.authMiddleware, borrowController.renewBorrow);

module.exports = router;
