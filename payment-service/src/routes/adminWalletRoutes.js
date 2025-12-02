// src/routes/adminWalletRoutes.js
import express from 'express';
import adminWalletController from '../controllers/adminWalletController.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();

router.use(adminAuth);

/**
 * @swagger
 * /admin/wallets/payout-requests:
 *   get:
 *     summary: "[ADMIN] Lấy danh sách yêu cầu rút tiền"
 *     tags:
 *       - Admin - Wallet
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: status
 *         in: query
 *         type: string
 *         enum:
 *           - pending
 *           - completed
 *           - rejected
 *       - name: page
 *         in: query
 *         type: integer
 *         default: 1
 *       - name: limit
 *         in: query
 *         type: integer
 *         default: 20
 *     responses:
 *       200:
 *         description: Thành công
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             data:
 *               type: object
 */
router.get('/payout-requests', adminWalletController.getPayoutRequests);

/**
 * @swagger
 * /admin/wallets/payout-requests/{id}/approve:
 *   post:
 *     summary: "[ADMIN] Duyệt yêu cầu rút tiền"
 *     tags:
 *       - Admin - Wallet
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Duyệt thành công
 */
router.post('/payout-requests/:id/approve', adminWalletController.approve);

/**
 * @swagger
 * /admin/wallets/payout-requests/{id}/reject:
 *   post:
 *     summary: "[ADMIN] Từ chối yêu cầu rút tiền"
 *     tags:
 *       - Admin - Wallet
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - reason
 *           properties:
 *             reason:
 *               type: string
 *     responses:
 *       200:
 *         description: Từ chối thành công
 */
router.post('/payout-requests/:id/reject', adminWalletController.reject);

export default router;
