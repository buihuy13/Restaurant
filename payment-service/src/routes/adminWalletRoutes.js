// src/routes/adminWalletRoutes.js
import express from 'express';
import adminWalletController from '../controllers/adminWalletController.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();

router.use(adminAuth);

/**
 * @swagger
 * /api/admin/wallets/payout-requests:
 *   get:
 *     summary: [ADMIN] Lấy danh sách yêu cầu rút tiền
 *     tags: [Admin - Wallet]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pending, completed, rejected]
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
 *         description: Thành công
 */
router.get('/payout-requests', adminWalletController.getPayoutRequests);

/**
 * @swagger
 * /api/admin/wallets/payout-requests/{id}/approve:
 *   post:
 *     summary: [ADMIN] Duyệt yêu cầu rút tiền
 *     tags: [Admin - Wallet]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Duyệt thành công
 */
router.post('/payout-requests/:id/approve', adminWalletController.approve);

/**
 * @swagger
 * /api/admin/wallets/payout-requests/{id}/reject:
 *   post:
 *     summary: [ADMIN] Từ chối yêu cầu rút tiền
 *     tags: [Admin - Wallet]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
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
 *     responses:
 *       200:
 *         description: Từ chối thành công
 */
router.post('/payout-requests/:id/reject', adminWalletController.reject);

export default router;
