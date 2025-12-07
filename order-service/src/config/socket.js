import { Server } from 'socket.io';
let io;

export const initOrderSocket = (server) => {
    io = new Server(server, { cors: { origin: '*' } });

    io.on('connection', (socket) => {
        socket.on('join-restaurant', (restaurantId) => {
            socket.join(`restaurant_${restaurantId}`);
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
