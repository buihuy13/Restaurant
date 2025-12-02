// src/routes/adminWalletRoutes.js
import express from 'express';
import adminWalletController from '../controllers/adminWalletController.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();

// Bảo vệ toàn bộ route bằng adminAuth
router.use(adminAuth);

/**
 * @swagger
 * /api/admin/payout-requests:
 *   get:
 *     summary: [ADMIN] Lay danh sach yeu cau rut tien
 *     tags: [Admin - Wallet]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: status
 *         in: query
 *         description: Loc theo trang thai (pending/completed/failed)
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed]
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Danh sach yeu cau rut tien
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     requests:
 *                       type: array
 *                       items:
 *                         $ref: '#/definitions/PayoutRequest'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page: { type: integer }
 *                         limit: { type: integer }
 *                         total: { type: integer }
 *                         totalPages: { type: integer }
 */

/**
 * @swagger
 * /api/admin/payout-requests/{id}/approve:
 *   post:
 *     summary: [ADMIN] Duyet yeu cau rut tien va chuyen tien qua Stripe
 *     tags: [Admin - Wallet]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID cua PayoutRequest
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chuyen tien thanh cong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Chuyen tien thanh cong
 *                 transferId:
 *                   type: string
 *                   description: Stripe Transfer ID
 *       400:
 *         description: Loi (da duyet, khong co Stripe account, ...)
 */

/**
 * @swagger
 * /api/admin/payout-requests/{id}/reject:
 *   post:
 *     summary: [ADMIN] Tu choi yeu cau rut tien va hoan tien lai vi
 *     tags: [Admin - Wallet]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID cua PayoutRequest
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Thong tin ngan hang khong chinh xac
 *     responses:
 *       200:
 *         description: Da tu choi va hoan tien thanh cong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Da tu choi va hoan tien thanh cong
 */

router.get('/payout-requests', adminWalletController.getPayoutRequests);
router.post('/payout-requests/:id/approve', adminWalletController.approve);
router.post('/payout-requests/:id/reject', adminWalletController.reject);

export default router;
