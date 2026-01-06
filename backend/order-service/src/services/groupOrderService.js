import GroupOrder from '../models/GroupOrder.js';
import Order from '../models/Order.js';
import logger from '../utils/logger.js';
import orderService from './orderService.js';
import axios from 'axios';

class GroupOrderService {
    // Tạo group order mới
    async createGroupOrder(data, userId, userName) {
        try {
            const groupOrderId = `GRP${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            
            // Validate restaurant
            await orderService.validateRestaurant(data.restaurantId);

            // Tính thời gian hết hạn (mặc định 2 giờ)
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + (data.expiresInHours || 2));

            const groupOrder = new GroupOrder({
                groupOrderId,
                creatorId: userId,
                creatorName: userName,
                restaurantId: data.restaurantId,
                restaurantName: data.restaurantName,
                deliveryAddress: data.deliveryAddress,
                expiresAt,
                groupNote: data.groupNote || '',
                paymentMethod: data.paymentMethod || 'split',
                allowIndividualPayment: data.allowIndividualPayment !== false, // Mặc định true
            });

            await groupOrder.save();

            logger.info(`Group order created: ${groupOrderId} by ${userName}`);
            
            return groupOrder;
        } catch (error) {
            logger.error('Create group order error:', error);
            throw new Error(`Failed to create group order: ${error.message}`);
        }
    }

    // Lấy thông tin group order bằng shareToken
    async getGroupOrderByToken(shareToken) {
        try {
            const groupOrder = await GroupOrder.findOne({ shareToken });

            if (!groupOrder) {
                throw new Error('Group order not found');
            }

            // Kiểm tra xem có hết hạn chưa
            if (new Date() > groupOrder.expiresAt && groupOrder.status === 'open') {
                groupOrder.status = 'cancelled';
                await groupOrder.save();
                throw new Error('Group order has expired');
            }

            return groupOrder;
        } catch (error) {
            logger.error('Get group order error:', error);
            throw error;
        }
    }

    // Tham gia group order và thêm món
    async joinGroupOrder(shareToken, userId, userName, items) {
        try {
            const groupOrder = await this.getGroupOrderByToken(shareToken);

            if (groupOrder.status !== 'open') {
                throw new Error('Group order is not accepting new participants');
            }

            // Kiểm tra user đã tham gia chưa
            const existingParticipant = groupOrder.participants.find(
                p => p.userId === userId
            );

            // Tính tổng tiền của user này
            const totalAmount = items.reduce((sum, item) => {
                return sum + (item.price * item.quantity);
            }, 0);

            if (existingParticipant) {
                // Cập nhật món của user
                existingParticipant.items = items;
                existingParticipant.totalAmount = totalAmount;
            } else {
                // Thêm user mới
                groupOrder.participants.push({
                    userId,
                    userName,
                    items,
                    totalAmount,
                });
            }

            // Tính lại tổng tiền
            this.recalculateTotal(groupOrder);

            await groupOrder.save();

            logger.info(`User ${userName} joined group order ${groupOrder.groupOrderId}`);
            
            return groupOrder;
        } catch (error) {
            logger.error('Join group order error:', error);
            throw error;
        }
    }

    // Xóa món của một participant
    async removeParticipant(shareToken, userId, requesterId) {
        try {
            const groupOrder = await this.getGroupOrderByToken(shareToken);

            if (groupOrder.status !== 'open') {
                throw new Error('Cannot remove participant from locked group order');
            }

            // Chỉ cho phép user tự xóa hoặc creator xóa
            if (userId !== requesterId && groupOrder.creatorId !== requesterId) {
                throw new Error('Unauthorized to remove this participant');
            }

            groupOrder.participants = groupOrder.participants.filter(
                p => p.userId !== userId
            );

            // Tính lại tổng tiền
            this.recalculateTotal(groupOrder);

            await groupOrder.save();

            logger.info(`Participant ${userId} removed from group order ${groupOrder.groupOrderId}`);
            
            return groupOrder;
        } catch (error) {
            logger.error('Remove participant error:', error);
            throw error;
        }
    }

    // Khóa group order (không cho thêm người)
    async lockGroupOrder(shareToken, userId) {
        try {
            const groupOrder = await this.getGroupOrderByToken(shareToken);

            if (groupOrder.creatorId !== userId) {
                throw new Error('Only creator can lock the group order');
            }

            if (groupOrder.status !== 'open') {
                throw new Error('Group order is not open');
            }

            if (groupOrder.participants.length === 0) {
                throw new Error('Cannot lock empty group order');
            }

            groupOrder.status = 'locked';
            await groupOrder.save();

            logger.info(`Group order ${groupOrder.groupOrderId} locked`);
            
            return groupOrder;
        } catch (error) {
            logger.error('Lock group order error:', error);
            throw error;
        }
    }

    // Confirm và tạo order thực tế
    async confirmGroupOrder(shareToken, userId, token) {
        try {
            const groupOrder = await this.getGroupOrderByToken(shareToken);

            if (groupOrder.creatorId !== userId) {
                throw new Error('Only creator can confirm the group order');
            }

            if (groupOrder.status === 'ordered') {
                throw new Error('Group order already confirmed');
            }

            if (groupOrder.participants.length === 0) {
                throw new Error('Cannot confirm empty group order');
            }

            // Kiểm tra thanh toán nếu yêu cầu
            if (groupOrder.allowIndividualPayment) {
                const unpaidParticipants = groupOrder.participants.filter(
                    p => p.paymentStatus !== 'completed'
                );
                
                if (unpaidParticipants.length > 0) {
                    logger.warn(`Confirming with ${unpaidParticipants.length} unpaid participants`);
                    // Không block, chỉ log warning
                }
            }

            // Tổng hợp tất cả items từ participants
            const allItems = [];
            groupOrder.participants.forEach(participant => {
                participant.items.forEach(item => {
                    // Tìm xem món này đã có trong allItems chưa
                    const existingItem = allItems.find(
                        i => i.productId === item.productId && i.customizations === item.customizations
                    );
                    
                    if (existingItem) {
                        // Tăng số lượng
                        existingItem.quantity += item.quantity;
                    } else {
                        // Thêm món mới
                        allItems.push({
                            productId: item.productId,
                            productName: item.productName,
                            quantity: item.quantity,
                            price: item.price,
                            customizations: item.customizations || '',
                        });
                    }
                });
            });

            // Tạo order chính thức
            const orderData = {
                restaurantId: groupOrder.restaurantId,
                items: allItems,
                deliveryAddress: groupOrder.deliveryAddress,
                orderNote: `Group Order: ${groupOrder.groupNote}\nParticipants: ${groupOrder.participants.map(p => p.userName).join(', ')}`,
                paymentMethod: groupOrder.paymentMethod === 'split' ? 'cash' : groupOrder.paymentMethod,
            };

            const finalOrder = await orderService.createOrder(orderData, token);

            // Cập nhật group order
            groupOrder.status = 'ordered';
            groupOrder.finalOrderId = finalOrder.orderId;
            await groupOrder.save();

            logger.info(`Group order ${groupOrder.groupOrderId} confirmed, created order ${finalOrder.orderId}`);
            
            return {
                groupOrder,
                order: finalOrder,
            };
        } catch (error) {
            logger.error('Confirm group order error:', error);
            throw error;
        }
    }

    // Hủy group order
    async cancelGroupOrder(shareToken, userId) {
        try {
            const groupOrder = await this.getGroupOrderByToken(shareToken);

            if (groupOrder.creatorId !== userId) {
                throw new Error('Only creator can cancel the group order');
            }

            if (groupOrder.status === 'ordered') {
                throw new Error('Cannot cancel confirmed group order');
            }

            groupOrder.status = 'cancelled';
            await groupOrder.save();

            logger.info(`Group order ${groupOrder.groupOrderId} cancelled`);
            
            return groupOrder;
        } catch (error) {
            logger.error('Cancel group order error:', error);
            throw error;
        }
    }

    // Lấy danh sách group orders của user
    async getUserGroupOrders(userId, filters = {}) {
        try {
            const query = {
                $or: [
                    { creatorId: userId },
                    { 'participants.userId': userId },
                ],
            };

            if (filters.status) {
                query.status = filters.status;
            }

            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 20;
            const skip = (page - 1) * limit;

            const groupOrders = await GroupOrder.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await GroupOrder.countDocuments(query);

            return {
                groupOrders,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('Get user group orders error:', error);
            throw error;
        }
    }

    // Helper: Tính lại tổng tiền
    recalculateTotal(groupOrder) {
        groupOrder.totalAmount = groupOrder.participants.reduce((sum, p) => {
            return sum + p.totalAmount;
        }, 0);

        // Tính tổng số tiền đã thanh toán
        groupOrder.totalPaidAmount = groupOrder.participants.reduce((sum, p) => {
            return sum + (p.paidAmount || 0);
        }, 0);

        // Có thể tính phí giao hàng và thuế ở đây
        groupOrder.deliveryFee = groupOrder.deliveryFee || 0;
        groupOrder.tax = Math.round(groupOrder.totalAmount * 0.1); // 10% thuế
        groupOrder.finalAmount = groupOrder.totalAmount + groupOrder.deliveryFee + groupOrder.tax;
    }

    // Thanh toán toàn bộ cho group order (creator hoặc ai đó trả hết)
    async payForWholeGroup(shareToken, userId, paymentData) {
        try {
            const groupOrder = await this.getGroupOrderByToken(shareToken);

            // Kiểm tra đã thanh toán toàn bộ chưa
            if (groupOrder.totalPaidAmount >= groupOrder.finalAmount) {
                throw new Error('This group order has been fully paid');
            }

            if (groupOrder.participants.length === 0) {
                throw new Error('Cannot pay for empty group order');
            }

            // Tính tổng số tiền cần thanh toán
            const totalToPay = groupOrder.finalAmount;

            logger.info(`User ${userId} attempting to pay for whole group: ${totalToPay}`);

            // Xử lý thanh toán
            let paymentResult;
            try {
                paymentResult = await this.processPayment({
                    userId,
                    amount: totalToPay,
                    paymentMethod: paymentData.paymentMethod,
                    orderId: groupOrder.groupOrderId,
                    description: `Full payment for group order ${groupOrder.groupOrderId}`,
                });

                if (paymentResult.success) {
                    // Đánh dấu tất cả participants đã được thanh toán
                    groupOrder.participants.forEach(participant => {
                        participant.paymentStatus = 'completed';
                        participant.paymentMethod = paymentData.paymentMethod;
                        participant.paymentTransactionId = paymentResult.transactionId;
                        const participantShare = participant.totalAmount / groupOrder.totalAmount;
                        const participantDeliveryFee = Math.round(groupOrder.deliveryFee * participantShare);
                        const participantTax = Math.round(participant.totalAmount * 0.1);
                        participant.paidAmount = participant.totalAmount + participantDeliveryFee + participantTax;
                        participant.paidAt = new Date();
                    });

                    groupOrder.totalPaidAmount = totalToPay;
                    await groupOrder.save();

                    logger.info(`Full payment completed by user ${userId} for group order ${groupOrder.groupOrderId}`);

                    return {
                        success: true,
                        paymentResult,
                        amountPaid: totalToPay,
                        message: 'Full payment completed successfully',
                    };
                } else {
                    throw new Error(paymentResult.message || 'Payment failed');
                }
            } catch (paymentError) {
                logger.error(`Full payment failed for group ${groupOrder.groupOrderId}:`, paymentError);
                throw new Error(`Payment processing failed: ${paymentError.message}`);
            }
        } catch (error) {
            logger.error('Pay for whole group error:', error);
            throw error;
        }
    }

    // Thanh toán riêng cho participant
    async payForParticipant(shareToken, userId, paymentData) {
        try {
            const groupOrder = await this.getGroupOrderByToken(shareToken);

            // Tìm participant
            const participant = groupOrder.participants.find(p => p.userId === userId);
            if (!participant) {
                throw new Error('You are not a participant in this group order');
            }

            // Kiểm tra đã thanh toán chưa
            if (participant.paymentStatus === 'completed') {
                throw new Error('You have already paid for this order');
            }

            // Nếu không cho phép thanh toán riêng và không phải creator
            if (!groupOrder.allowIndividualPayment && groupOrder.creatorId !== userId) {
                throw new Error('Individual payment is not allowed for this group order');
            }

            // Tính số tiền cần thanh toán (bao gồm phí và thuế theo tỷ lệ)
            const participantShare = participant.totalAmount / groupOrder.totalAmount;
            const participantDeliveryFee = Math.round(groupOrder.deliveryFee * participantShare);
            const participantTax = Math.round(participant.totalAmount * 0.1);
            const totalToPay = participant.totalAmount + participantDeliveryFee + participantTax;

            // Cập nhật trạng thái thanh toán
            participant.paymentStatus = 'processing';
            participant.paymentMethod = paymentData.paymentMethod;
            await groupOrder.save();

            // Gọi payment service để xử lý thanh toán
            let paymentResult;
            try {
                paymentResult = await this.processPayment({
                    userId,
                    amount: totalToPay,
                    paymentMethod: paymentData.paymentMethod,
                    orderId: groupOrder.groupOrderId,
                    description: `Payment for group order ${groupOrder.groupOrderId}`,
                });

                // Nếu thanh toán thành công
                if (paymentResult.success) {
                    participant.paymentStatus = 'completed';
                    participant.paymentTransactionId = paymentResult.transactionId;
                    participant.paidAmount = totalToPay;
                    participant.paidAt = new Date();

                    this.recalculateTotal(groupOrder);
                    await groupOrder.save();

                    logger.info(`Payment completed for user ${userId} in group order ${groupOrder.groupOrderId}`);

                    return {
                        success: true,
                        participant,
                        paymentResult,
                        amountPaid: totalToPay,
                    };
                } else {
                    throw new Error(paymentResult.message || 'Payment failed');
                }
            } catch (paymentError) {
                // Nếu thanh toán thất bại
                participant.paymentStatus = 'failed';
                await groupOrder.save();
                
                logger.error(`Payment failed for user ${userId}:`, paymentError);
                throw new Error(`Payment processing failed: ${paymentError.message}`);
            }
        } catch (error) {
            logger.error('Pay for participant error:', error);
            throw error;
        }
    }

    // Xử lý thanh toán qua payment service
    async processPayment(paymentData) {
        try {
            // Gọi API payment service
            const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://localhost:8084';
            const response = await axios.post(
                `${paymentServiceUrl}/api/payments/process`,
                {
                    userId: paymentData.userId,
                    amount: paymentData.amount,
                    paymentMethod: paymentData.paymentMethod,
                    orderId: paymentData.orderId,
                    description: paymentData.description,
                },
                {
                    timeout: 10000,
                }
            );

            return response.data;
        } catch (error) {
            logger.error('Payment service error:', error);
            
            // Nếu payment service không available, cho phép thanh toán cash
            if (paymentData.paymentMethod === 'cash') {
                return {
                    success: true,
                    transactionId: `CASH_${Date.now()}`,
                    message: 'Cash payment accepted',
                };
            }
            
            throw new Error('Payment service unavailable');
        }
    }

    // Kiểm tra xem tất cả participants đã thanh toán chưa
    async checkAllPaid(shareToken) {
        try {
            const groupOrder = await this.getGroupOrderByToken(shareToken);

            if (!groupOrder.allowIndividualPayment) {
                return { allPaid: true, message: 'Individual payment not required' };
            }

            const totalParticipants = groupOrder.participants.length;
            const paidParticipants = groupOrder.participants.filter(
                p => p.paymentStatus === 'completed'
            ).length;

            const allPaid = totalParticipants === paidParticipants && totalParticipants > 0;

            return {
                allPaid,
                totalParticipants,
                paidParticipants,
                pendingParticipants: totalParticipants - paidParticipants,
                participants: groupOrder.participants.map(p => ({
                    userId: p.userId,
                    userName: p.userName,
                    paymentStatus: p.paymentStatus,
                    paidAmount: p.paidAmount,
                    totalAmount: p.totalAmount,
                })),
            };
        } catch (error) {
            logger.error('Check all paid error:', error);
            throw error;
        }
    }

    // Lấy link chia sẻ
    getShareLink(groupOrder) {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return `${baseUrl}/group-order/${groupOrder.shareToken}`;
    }
}

export default new GroupOrderService();
