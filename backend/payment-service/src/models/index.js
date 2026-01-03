// Trong file khởi tạo models (thường là src/models/index.js)
import Wallet from './Wallet.js';
import WalletTransaction from './WalletTransaction.js';
import PayoutRequest from './PayoutRequest.js';

// Quan hệ
Wallet.hasMany(WalletTransaction, { foreignKey: 'wallet_id', as: 'transactions' });
Wallet.hasMany(PayoutRequest, { foreignKey: 'wallet_id', as: 'payouts' });

WalletTransaction.belongsTo(Wallet, { foreignKey: 'wallet_id' });
PayoutRequest.belongsTo(Wallet, { foreignKey: 'wallet_id' });
