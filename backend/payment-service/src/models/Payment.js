import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Payment = sequelize.define(
    'Payment',
    {
        id: {
            type: DataTypes.CHAR(36),
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        paymentId: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        orderId: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING(100),
            allowNull: false,
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
            type: DataTypes.ENUM('card'),
            allowNull: false,
            defaultValue: 'card',
        },
        paymentGateway: {
            type: DataTypes.STRING(50),
            defaultValue: 'stripe',
        },
        transactionId: {
            type: DataTypes.STRING(200),
        },
        status: {
            type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
            defaultValue: 'pending',
        },
        failureReason: {
            type: DataTypes.TEXT,
        },
        refundAmount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        refundReason: {
            type: DataTypes.TEXT,
        },
        refundTransactionId: {
            type: DataTypes.STRING(200),
        },
        metadata: {
            type: DataTypes.JSON,
        },
        processedAt: {
            type: DataTypes.DATE,
        },
        refundedAt: {
            type: DataTypes.DATE,
        },
    },
    {
        tableName: 'payments',
        timestamps: true,
        indexes: [{ fields: ['orderId'] }, { fields: ['userId'] }, { fields: ['status'] }, { fields: ['createdAt'] }],
    },
);

export default Payment;
