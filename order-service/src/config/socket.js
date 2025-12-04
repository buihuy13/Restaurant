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
    io?.to(`restaurant_${restaurantId}`).emit('new-order', {
        type: 'NEW_ORDER',
        data: orderData,
        timestamp: new Date(),
        sound: 'ting.mp3',
    });
};
