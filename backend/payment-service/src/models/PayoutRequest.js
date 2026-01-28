// src/models/PayoutRequest.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Modal để quản lý các yêu cầu rút tiền từ ví
const PayoutRequest = sequelize.define(
    'PayoutRequest',
    {
        id: {
            type: DataTypes.CHAR(36),
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        walletId: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            field: 'wallet_id',
        },
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        bankInfo: {
            type: DataTypes.JSON,
            allowNull: false,
            field: 'bank_info',
        },
        status: {
            type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
            defaultValue: 'pending',
        },
        note: {
            type: DataTypes.TEXT,
        },
        processedAt: {
            type: DataTypes.DATE,
            field: 'processed_at',
        },
    },
    {
        tableName: 'payout_requests',
        timestamps: true,
        indexes: [{ fields: ['wallet_id'] }, { fields: ['status'] }, { fields: ['createdAt'] }],
    },
);

export default PayoutRequest;
