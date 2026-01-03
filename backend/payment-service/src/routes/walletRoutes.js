// src/routes/walletRoutes.js
import express from 'express';
import walletController from '../controllers/walletController.js';
import { restaurantAuth } from '../middlewares/restaurantAuth.js';

const router = express.Router();

router.use(restaurantAuth); // Bảo vệ tất cả route ví

/**
 * @swagger
 * /api/wallet:
 *   get:
 *     summary: Xem số dư ví nhà hàng
 *     tags: [Wallet]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Thành công
 *         schema:
 *           type: object
 *           properties:
 *             success: { type: boolean, example: true }
 *             data:
 *               $ref: '#/definitions/Wallet'
 *       401:
 *         description: Chưa đăng nhập
 *         schema:
 *           $ref: '#/definitions/Error'
 */
router.get('/', walletController.getWallet);

/**
 * @swagger
 * /api/wallet/transactions:
 *   get:
 *     summary: Lịch sử giao dịch ví
 *     tags: [Wallet]
 *     security:
 *       - Bearer: []
 *     parameters:
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
 *         description: Danh sách giao dịch
 *         schema:
 *           type: object
 *           properties:
 *             success: { type: boolean }
 *             data:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/WalletTransaction'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     totalPages: { type: integer }
 */
router.get('/transactions', walletController.getTransactions);

/**
 * @swagger
 * /api/wallet/withdraw:
 *   post:
 *     summary: Yêu cầu rút tiền về ngân hàng
 *     tags: [Wallet]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - amount
 *             - bankInfo
 *           properties:
 *             amount:
 *               type: number
 *               example: 1500000
 *             bankInfo:
 *               type: object
 *               required:
 *                 - bankName
 *                 - accountNumber
 *                 - accountHolderName
 *               properties:
 *                 bankName:
 *                   type: string
 *                   example: "Techcombank"
 *                 accountNumber:
 *                   type: string
 *                   example: "19037654321012"
 *                 accountHolderName:
 *                   type: string
 *                   example: "NGUYEN VAN A"
 *             note:
 *               type: string
 *               example: "Rút tiền tuần này"
 *     responses:
 *       200:
 *         description: Yêu cầu rút thành công
 *         schema:
 *           type: object
 *           properties:
 *             success: { type: boolean, example: true }
 *             message: { type: string }
 *             data:
 *               $ref: '#/definitions/PayoutRequest'
 *       400:
 *         description: Thiếu thông tin hoặc số dư không đủ
 *         schema:
 *           $ref: '#/definitions/Error'
 */
router.post('/withdraw', walletController.requestWithdraw);

export default router;
