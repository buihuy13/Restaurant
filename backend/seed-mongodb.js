// ============================================
// MONGODB SEED DATA FOR RESTAURANT PROJECT
// Run with: mongosh < seed-mongodb.js
// Or copy-paste into MongoDB Compass
// ============================================

// ===========================================
// ORDER DATABASE
// ===========================================
db = db.getSiblingDB('order_db');

// Drop old data
db.orders.drop();
db.carts.drop();
db.grouporders.drop();

print('Seeding order database with comprehensive test data...');

// Helper function to generate random date within range
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// ORDERS - Comprehensive test data for dashboard
const merchantId = 'testmerchantid'; // Use this merchant ID for testing
const restaurantId = 'RES001';
const restaurantName = 'Pho Ha Noi';

// Generate orders for the last 30 days with various times and ratings
const orders = [];
const now = new Date();
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

// Products for variety
const products = [
    { id: 'PROD001', name: 'Phở Bò Tái', price: 55000 },
    { id: 'PROD002', name: 'Phở Gà', price: 50000 },
    { id: 'PROD003', name: 'Bún Chả', price: 60000 },
    { id: 'PROD004', name: 'Bún Bò Huế', price: 65000 },
    { id: 'PROD005', name: 'Cơm Tấm Sườn', price: 45000 },
    { id: 'PROD006', name: 'Bánh Mì Thịt', price: 25000 },
    { id: 'PROD007', name: 'Gỏi Cuốn', price: 30000 },
    { id: 'PROD008', name: 'Chả Giò', price: 35000 },
];

const statuses = ['completed', 'completed', 'completed', 'completed', 'pending', 'confirmed', 'preparing', 'ready', 'cancelled'];
const ratings = [5, 5, 5, 4, 4, 4, 3, 2, 1, null, null]; // More 5-star ratings

// Generate 100 orders
for (let i = 0; i < 100; i++) {
    const orderDate = randomDate(thirtyDaysAgo, now);
    const hour = orderDate.getHours();

    // Randomly select 1-3 products
    const numProducts = Math.floor(Math.random() * 3) + 1;
    const selectedProducts = [];
    let totalAmount = 0;

    for (let j = 0; j < numProducts; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const subtotal = product.price * quantity;
        totalAmount += subtotal;

        selectedProducts.push({
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            price: product.price,
            imageURL: `https://res.cloudinary.com/demo/image/upload/${product.id}.jpg`,
        });
    }

    const deliveryFee = Math.floor(Math.random() * 20000) + 10000;
    const tax = Math.floor(totalAmount * 0.1);
    const discount = i % 10 === 0 ? Math.floor(totalAmount * 0.1) : 0;
    const finalAmount = totalAmount + deliveryFee + tax - discount;

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const rating = status === 'completed' ? ratings[Math.floor(Math.random() * ratings.length)] : null;

    orders.push({
        _id: ObjectId(),
        orderId: `ORD-${orderDate.getFullYear()}${String(orderDate.getMonth() + 1).padStart(2, '0')}${String(orderDate.getDate()).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
        slug: `ord-${orderDate.getFullYear()}${String(orderDate.getMonth() + 1).padStart(2, '0')}${String(orderDate.getDate()).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
        userId: `user_${Math.floor(Math.random() * 20) + 1}`,
        restaurantId: restaurantId,
        restaurantName: restaurantName,
        merchantId: merchantId,
        items: selectedProducts,
        totalAmount: totalAmount,
        deliveryFee: deliveryFee,
        tax: tax,
        discount: discount,
        finalAmount: finalAmount,
        deliveryAddress: {
            street: `${Math.floor(Math.random() * 999) + 1} Nguyen Hue`,
            city: 'Ho Chi Minh',
            state: 'Vietnam',
            zipCode: '700000',
        },
        paymentMethod: 'card',
        paymentStatus: status === 'completed' ? 'paid' : status === 'cancelled' ? 'refunded' : 'processing',
        status: status,
        orderNote: i % 5 === 0 ? 'Ít rau, thêm hành' : '',
        rating: rating,
        review: rating ? (rating >= 4 ? 'Món ăn rất ngon!' : rating === 3 ? 'Tạm ổn' : 'Không ngon lắm') : null,
        estimatedDeliveryTime: new Date(orderDate.getTime() + 30 * 60 * 1000),
        actualDeliveryTime: status === 'completed' ? new Date(orderDate.getTime() + Math.random() * 60 * 60 * 1000) : null,
        createdAt: orderDate,
        updatedAt: new Date(orderDate.getTime() + Math.random() * 60 * 60 * 1000),
    });
}

db.orders.insertMany(orders);

print(`Inserted ${orders.length} orders for merchant: ${merchantId}`);
print(`   Restaurant: ${restaurantName} (${restaurantId})`);

// CARTS - Sample cart data
db.carts.insertMany([
    {
        _id: ObjectId(),
        userId: 'user_test_1',
        restaurants: [
            {
                restaurantId: restaurantId,
                restaurantName: restaurantName,
                items: [
                    {
                        productId: 'PROD001',
                        productName: 'Phở Bò Tái',
                        quantity: 2,
                        price: 55000,
                        imageURL: 'https://res.cloudinary.com/demo/image/upload/PROD001.jpg',
                    },
                    {
                        productId: 'PROD007',
                        productName: 'Gỏi Cuốn',
                        quantity: 1,
                        price: 30000,
                        imageURL: 'https://res.cloudinary.com/demo/image/upload/PROD007.jpg',
                    },
                ],
                subtotal: 140000,
            },
        ],
        totalAmount: 140000,
        updatedAt: new Date(),
    },
]);

print('Inserted sample cart data');
print('Order database seeded successfully!');

// ===========================================
// BLOG DATABASE
// ===========================================
db = db.getSiblingDB('blog_db');

// Drop old data
db.blogs.drop();
db.comments.drop();

print('Seeding blog database...');

// BLOGS
db.blogs.insertMany([
    {
        _id: ObjectId(),
        title: 'Top 10 Quán Phở Ngon Nhất Sài Gòn',
        slug: 'top-10-quan-pho-ngon-nhat-sai-gon',
        content:
            '# Top 10 Quán Phở Ngon Nhất Sài Gòn 2026\n\nPhở là món ăn không thể thiếu trong ẩm thực Việt Nam. Hôm nay chúng ta sẽ cùng khám phá 10 quán phở ngon nhất Sài Gòn!\n\n## 1. Phở Hà Nội - Nguyễn Huệ\nNước dùng đậm đà, thịt bò tươi ngon. Đây là địa chỉ yêu thích của nhiều người sành ăn.\n\n## 2. Phở Lệ - Võ Thị Sáu\nPhở gia truyền hơn 30 năm, nổi tiếng với nước dùng trong và ngọt thanh.\n\n## 3. Phở Hòa Pasteur\nThương hiệu lâu đời, phục vụ từ 6h sáng.\n\n*Hãy thử và cho chúng tôi biết ý kiến của bạn nhé!*',
        excerpt: 'Khám phá 10 quán phở ngon nhất Sài Gòn 2026, từ phở truyền thống đến phở fusion hiện đại.',
        coverImage: 'https://res.cloudinary.com/demo/image/upload/pho-cover.jpg',
        authorId: 'testuserid',
        authorName: 'Test User',
        category: 'Ẩm thực',
        tags: ['phở', 'sài gòn', 'ẩm thực việt', 'top 10'],
        views: 1520,
        likes: ['user_gen_01', 'user_gen_02', 'user_gen_03', 'user_gen_04', 'user_gen_05'],
        likesCount: 5,
        commentsCount: 3,
        status: 'published',
        createdAt: new Date('2026-01-01T08:00:00Z'),
        updatedAt: new Date('2026-01-01T08:00:00Z'),
        publishedAt: new Date('2026-01-01T08:00:00Z'),
    },
    {
        _id: ObjectId(),
        title: 'Công Thức Nấu Phở Bò Tại Nhà',
        slug: 'cong-thuc-nau-pho-bo-tai-nha',
        content:
            '# Công Thức Nấu Phở Bò Tại Nhà\n\n## Nguyên liệu\n\n### Nước dùng:\n- 2kg xương bò\n- 500g thịt bò bắp\n- 2 củ hành tây\n- 1 củ gừng\n- Hoa hồi, quế, thảo quả\n\n### Bánh phở và rau:\n- 500g bánh phở tươi\n- Rau mùi, hành lá, giá đỗ\n\n## Cách làm\n\n1. **Chần xương**: Đun sôi nước, cho xương vào chần 5 phút rồi đổ bỏ nước.\n2. **Nướng hành gừng**: Nướng trực tiếp trên bếp đến khi thơm.\n3. **Nấu nước dùng**: Cho xương, thịt, hành gừng và gia vị vào nồi. Nấu 6-8 tiếng.\n4. **Trụng bánh phở**: Cho bánh phở vào nước sôi 10 giây.\n5. **Hoàn thành**: Xếp phở vào tô, thêm thịt, rau và chan nước dùng.\n\nChúc các bạn thành công!',
        excerpt: 'Hướng dẫn chi tiết cách nấu phở bò chuẩn vị tại nhà với công thức gia truyền.',
        coverImage: 'https://res.cloudinary.com/demo/image/upload/pho-recipe.jpg',
        authorId: merchantId,
        authorName: 'Test Merchant',
        category: 'Công thức',
        tags: ['phở', 'công thức', 'nấu ăn', 'việt nam'],
        views: 2340,
        likes: ['testuserid', 'user_gen_01', 'user_gen_02', 'user_gen_03', 'user_gen_04', 'user_gen_05', 'user_gen_06'],
        likesCount: 7,
        commentsCount: 5,
        status: 'published',
        createdAt: new Date('2026-01-05T10:00:00Z'),
        updatedAt: new Date('2026-01-05T10:00:00Z'),
        publishedAt: new Date('2026-01-05T10:00:00Z'),
    },
]);

print('Blog database seeded successfully!');
print('\n========================================');
print('All MongoDB databases seeded!');
print('========================================');
print('\nDASHBOARD TESTING INFO:');
print(`   Merchant ID: ${merchantId}`);
print(`   Restaurant ID: ${restaurantId}`);
print(`   Restaurant Name: ${restaurantName}`);
print(`   Total Orders: ${orders.length}`);
print('\n POSTMAN TESTING ENDPOINTS:');
print('   GET http://localhost:8080/api/dashboard/merchant/testmerchantid/restaurant');
print('   GET http://localhost:8080/api/merchant/testmerchantid/dashboard/overview');
print('   GET http://localhost:8080/api/merchant/testmerchantid/dashboard/revenue');
print('   GET http://localhost:8080/api/merchant/testmerchantid/dashboard/ratings');
print('   GET http://localhost:8080/api/merchant/testmerchantid/dashboard/hourly');
print('   GET http://localhost:8080/api/merchant/testmerchantid/dashboard/time-analytics');
print('   GET http://localhost:8080/api/merchant/testmerchantid/dashboard/products/top');
print('   GET http://localhost:8080/api/merchant/testmerchantid/dashboard/orders/status');
print('   GET http://localhost:8080/api/merchant/testmerchantid/dashboard/revenue/trend');
print('\nRemember to add Authorization header with JWT token!');
print('========================================\n');
