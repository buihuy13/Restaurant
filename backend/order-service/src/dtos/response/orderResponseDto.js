// DTO cho từng item
export const orderItemDTO = (item) => ({
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    price: item.price,
    customizations: item.customizations || '',
});

// DTO tổng thể trả về cho client
export const orderResponseDTO = (order) => ({
    //   id: order._id,
    orderId: order.orderId,
    slug: order.slug,
    userId: order.userId,
    restaurant: {
        id: order.restaurantId,
        name: order.restaurantName,
    },
    items: order.items?.map(orderItemDTO),
    deliveryAddress: order.deliveryAddress,
    totalAmount: order.totalAmount,
    discount: order.discount,
    deliveryFee: order.deliveryFee,
    tax: order.tax,
    finalAmount: order.finalAmount,
    paymentMethod: order.paymentMethod,
    status: order.status,
    paymentStatus: order.paymentStatus,
    estimatedDeliveryTime: order.estimatedDeliveryTime,
    actualDeliveryTime: order.actualDeliveryTime || null,
    orderNote: order.orderNote || '',
    rating: order.rating || null,
    review: order.review || '',
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
});
