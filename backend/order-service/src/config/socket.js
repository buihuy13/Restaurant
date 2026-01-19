import { Server } from 'socket.io';
let io;

export const initOrderSocket = (server) => {
    io = new Server(server, { cors: { origin: '*' } });

    io.on('connection', (socket) => {
        console.log(`[SOCKET] New connection: ${socket.id}`);

        // Restaurant joins their room to receive new orders
        socket.on('join-restaurant', (restaurantId) => {
            socket.join(`restaurant_${restaurantId}`);
            console.log(`[SOCKET] Restaurant ${restaurantId} joined room`);
        });

        // User joins their room to receive order status updates
        socket.on('join-user-orders', (userId) => {
            socket.join(`user_${userId}`);
            console.log(`[SOCKET] User ${userId} joined their orders room`);
        });

        socket.on('disconnect', () => {
            console.log(`[SOCKET] Client disconnected: ${socket.id}`);
        });
    });
};

export const notifyNewOrder = (restaurantId, orderData) => {
    console.log(`[SOCKET] Sending new-order to restaurant_${restaurantId}`, orderData);
    const roomSize = io?.sockets?.adapter?.rooms?.get(`restaurant_${restaurantId}`)?.size || 0;
    console.log(`[SOCKET] Room size: ${roomSize} clients`);

    io?.to(`restaurant_${restaurantId}`).emit('new-order', {
        type: 'NEW_ORDER',
        data: orderData,
        timestamp: new Date(),
        sound: 'ting.mp3',
    });
};

export const notifyOrderStatusUpdate = (userId, orderData) => {
    console.log(`[SOCKET] Sending order-status-updated to user_${userId}`, orderData);
    const roomSize = io?.sockets?.adapter?.rooms?.get(`user_${userId}`)?.size || 0;
    console.log(`[SOCKET] User room size: ${roomSize} clients`);

    io?.to(`user_${userId}`).emit('order-status-updated', {
        type: 'ORDER_STATUS_UPDATE',
        orderId: orderData.orderId,
        status: orderData.status,
        previousStatus: orderData.previousStatus,
        paymentStatus: orderData.paymentStatus,
        cancellationReason: orderData.cancellationReason,
        timestamp: new Date(),
    });
};
