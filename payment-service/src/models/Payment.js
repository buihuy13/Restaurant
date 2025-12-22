import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Payment = sequelize.define(
    'Payment',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        paymentId: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            field: 'payment_id',
        },
        orderId: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'order_id',
        },
        userId: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'user_id',
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },
        paymentMethod: {
            type: DataTypes.ENUM('cash', 'card', 'wallet'),
            allowNull: false,
            field: 'payment_method',
        },
        paymentGateway: {
            type: DataTypes.STRING(50),
            defaultValue: 'stripe',
            field: 'payment_gateway',
        },
        transactionId: {
            type: DataTypes.STRING(200),
            field: 'transaction_id',
        },
        status: {
            type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
            defaultValue: 'pending',
        },
        failureReason: {
            type: DataTypes.TEXT,
            field: 'failure_reason',
        },
        refundAmount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            field: 'refund_amount',
        },
        refundReason: {
            type: DataTypes.TEXT,
            field: 'refund_reason',
        },
        refundTransactionId: {
            type: DataTypes.STRING(200),
            field: 'refund_transaction_id',
        },
        metadata: {
            type: DataTypes.JSON,
        },
        processedAt: {
            type: DataTypes.DATE,
            field: 'processed_at',
        },
        refundedAt: {
            type: DataTypes.DATE,
            field: 'refunded_at',
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at',
        },
    },
    {
        tableName: 'payments',
        timestamps: false,
        indexes: [
            { fields: ['order_id'] },
            { fields: ['user_id'] },
            { fields: ['status'] },
            { fields: ['created_at'] },
        ],
    },
);

export default Payment;
