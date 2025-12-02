// src/models/WalletTransaction.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const WalletTransaction = sequelize.define(
    'WalletTransaction',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        walletId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'wallet_id',
        },
        orderId: {
            type: DataTypes.STRING(100),
            field: 'order_id',
        },
        payoutRequestId: {
            type: DataTypes.UUID,
            field: 'payout_request_id',
        },
        type: {
            type: DataTypes.ENUM('EARN', 'WITHDRAW'),
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
            defaultValue: 'PENDING',
        },
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        tableName: 'wallet_transactions',
        timestamps: true,
        indexes: [
            { fields: ['wallet_id'] },
            { fields: ['order_id'] },
            { fields: ['payout_request_id'] },
            { fields: ['created_at'] },
            { fields: ['updated_at'] },
        ],
    },
);

export default WalletTransaction;
