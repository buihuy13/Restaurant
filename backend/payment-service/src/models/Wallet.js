// src/models/Wallet.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Wallet = sequelize.define(
    'Wallet',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        restaurantId: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            field: 'restaurant_id',
        },
        balance: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        totalEarned: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0.0,
            field: 'total_earned',
        },
        totalWithdrawn: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0.0,
            field: 'total_withdrawn',
        },
    },
    {
        tableName: 'wallets',
        timestamps: true,
        indexes: [{ fields: ['restaurant_id'], unique: true }],
    },
);

export default Wallet;
