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
const restaurantName = 'The Gourmet Kitchen';

// Generate orders for the last 30 days with various times and ratings
const orders = [];
const now = new Date();
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

// Products for variety with Cloudinary images
const products = [
    { id: 'PROD001', name: 'Classic Burger', price: 55000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg' },
    { id: 'PROD002', name: 'Margherita Pizza', price: 85000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg' },
    { id: 'PROD003', name: 'Fried Chicken', price: 65000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg' },
    { id: 'PROD004', name: 'Beef Tacos', price: 48000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635233/tacos_g0bqyg.jpg' },
    { id: 'PROD005', name: 'Chicken Burrito', price: 52000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635268/buritos_b3kdr9.jpg' },
    { id: 'PROD006', name: 'French Fries', price: 25000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635297/khoaitaychien_n8njn6.jpg' },
    { id: 'PROD007', name: 'Cheese Balls', price: 35000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635314/cheeseball_pibzk3.jpg' },
    { id: 'PROD008', name: 'Grilled Duck', price: 95000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635330/daga_abs1zd.jpg' },
    { id: 'PROD009', name: 'Soy Sauce Chicken', price: 75000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635341/gasot_opwrcw.jpg' },
    { id: 'PROD010', name: 'Coca Cola', price: 15000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640626/cocacola_vyo2mu.jpg' },
    { id: 'PROD011', name: 'Orange Juice', price: 20000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640680/orange-juice_qynanv.jpg' },
    { id: 'PROD012', name: 'Iced Coffee', price: 25000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640718/iced-coffee_xsym2r.jpg' },
    { id: 'PROD013', name: 'Chocolate Cake', price: 45000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640718/iced-coffee_xsym2r.jpg' },
    { id: 'PROD014', name: 'Ice Cream Sundae', price: 35000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635314/cheeseball_pibzk3.jpg' },
    { id: 'PROD015', name: 'Apple Pie', price: 40000, image: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640680/orange-juice_qynanv.jpg' },
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
            imageURL: product.image,
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
            street: `${Math.floor(Math.random() * 999) + 1} Main Street`,
            city: 'Ho Chi Minh',
            state: 'Vietnam',
            zipCode: '700000',
        },
        paymentMethod: 'card',
        paymentStatus: status === 'completed' ? 'paid' : status === 'cancelled' ? 'refunded' : 'processing',
        status: status,
        orderNote: i % 5 === 0 ? 'Less vegetables, extra sauce' : '',
        rating: rating,
        review: rating ? (rating >= 4 ? 'Delicious food!' : rating === 3 ? 'It was okay' : 'Not great') : null,
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
                        productName: 'Classic Burger',
                        quantity: 2,
                        price: 55000,
                        imageURL: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg',
                    },
                    {
                        productId: 'PROD002',
                        productName: 'Margherita Pizza',
                        quantity: 1,
                        price: 85000,
                        imageURL: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg',
                    },
                ],
                subtotal: 195000,
            },
        ],
        totalAmount: 195000,
        updatedAt: new Date(),
    },
    {
        _id: ObjectId(),
        userId: 'user_test_2',
        restaurants: [
            {
                restaurantId: restaurantId,
                restaurantName: restaurantName,
                items: [
                    {
                        productId: 'PROD003',
                        productName: 'Fried Chicken',
                        quantity: 3,
                        price: 65000,
                        imageURL: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg',
                    },
                    {
                        productId: 'PROD006',
                        productName: 'French Fries',
                        quantity: 2,
                        price: 25000,
                        imageURL: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635297/khoaitaychien_n8njn6.jpg',
                    },
                    {
                        productId: 'PROD010',
                        productName: 'Coca Cola',
                        quantity: 3,
                        price: 15000,
                        imageURL: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640626/cocacola_vyo2mu.jpg',
                    },
                ],
                subtotal: 290000,
            },
        ],
        totalAmount: 290000,
        updatedAt: new Date(),
    },
    {
        _id: ObjectId(),
        userId: 'user_test_3',
        restaurants: [
            {
                restaurantId: restaurantId,
                restaurantName: restaurantName,
                items: [
                    {
                        productId: 'PROD008',
                        productName: 'Grilled Duck',
                        quantity: 1,
                        price: 95000,
                        imageURL: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635330/daga_abs1zd.jpg',
                    },
                    {
                        productId: 'PROD013',
                        productName: 'Chocolate Cake',
                        quantity: 2,
                        price: 45000,
                        imageURL: 'https://res.cloudinary.com/demo/image/upload/chocolate-cake.jpg',
                    },
                    {
                        productId: 'PROD012',
                        productName: 'Iced Coffee',
                        quantity: 1,
                        price: 25000,
                        imageURL: 'https://res.cloudinary.com/demo/image/upload/iced-coffee.jpg',
                    },
                ],
                subtotal: 210000,
            },
        ],
        totalAmount: 210000,
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
        title: 'Top 10 Best Burgers in Ho Chi Minh City',
        slug: 'top-10-best-burgers-ho-chi-minh-city',
        content:
            '# Top 10 Best Burgers in Ho Chi Minh City 2026\n\nBurgers have become one of the most popular fast food items in Vietnam. Today we will explore the 10 best burger joints in Ho Chi Minh City!\n\n## 1. The Gourmet Kitchen - District 1\nJuicy beef patties with fresh ingredients. This is a favorite spot for burger enthusiasts.\n\n## 2. Burger Bros - Pasteur Street\nFamily recipe for over 5 years, famous for their signature sauce and crispy bacon.\n\n## 3. Classic Burger House - Nguyen Hue\nEstablished brand, serving from 10 AM daily.\n\n*Try them out and let us know your thoughts!*',
        excerpt: 'Discover the 10 best burger restaurants in Ho Chi Minh City 2026, from classic burgers to gourmet creations.',
        coverImage: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635125/burger_rrezhv.jpg',
        author: {
            userId: 'testuserid',
            name: 'Test User',
        },
        category: 'review',
        tags: ['burgers', 'ho chi minh', 'fast food', 'top 10'],
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
        title: 'How to Make Authentic Italian Pizza at Home',
        slug: 'how-to-make-authentic-italian-pizza-at-home',
        content:
            '# How to Make Authentic Italian Pizza at Home\n\n## Ingredients\n\n### For the Dough:\n- 500g all-purpose flour\n- 325ml warm water\n- 2 tsp active dry yeast\n- 2 tbsp olive oil\n- 1 tsp salt\n- 1 tsp sugar\n\n### For the Toppings:\n- 200g mozzarella cheese\n- Fresh basil leaves\n- Tomato sauce\n- Olive oil\n\n## Instructions\n\n1. **Make the Dough**: Mix warm water with yeast and sugar. Let it sit for 5 minutes until foamy.\n2. **Knead**: Combine flour, salt, olive oil, and yeast mixture. Knead for 10 minutes until smooth.\n3. **Rise**: Cover and let the dough rise for 1-2 hours until doubled in size.\n4. **Shape**: Roll out the dough into a circle, about 12 inches in diameter.\n5. **Top**: Spread tomato sauce, add mozzarella, and your favorite toppings.\n6. **Bake**: Bake at 475°F (245°C) for 12-15 minutes until the crust is golden.\n\nEnjoy your homemade pizza!',
        excerpt: 'Step-by-step guide to making authentic Italian pizza at home with traditional recipe.',
        coverImage: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635183/pizza_hks2cw.jpg',
        author: {
            userId: merchantId,
            name: 'Test Merchant',
        },
        category: 'recipe',
        tags: ['pizza', 'italian', 'cooking', 'homemade'],
        views: 2340,
        likes: ['testuserid', 'user_gen_01', 'user_gen_02', 'user_gen_03', 'user_gen_04', 'user_gen_05', 'user_gen_06'],
        likesCount: 7,
        commentsCount: 5,
        status: 'published',
        createdAt: new Date('2026-01-05T10:00:00Z'),
        updatedAt: new Date('2026-01-05T10:00:00Z'),
        publishedAt: new Date('2026-01-05T10:00:00Z'),
    },
    {
        _id: ObjectId(),
        title: 'The Ultimate Guide to Perfect Fried Chicken',
        slug: 'ultimate-guide-perfect-fried-chicken',
        content:
            '# The Ultimate Guide to Perfect Fried Chicken\n\n## Why Fried Chicken is So Popular\n\nFried chicken has become a global phenomenon. The crispy exterior and juicy interior make it irresistible!\n\n## Secret to Crispy Coating\n\n1. **Double Dredge**: Coat chicken in flour, then buttermilk, then flour again\n2. **Season Generously**: Use paprika, garlic powder, black pepper, and cayenne\n3. **Rest Before Frying**: Let coated chicken rest for 15 minutes\n4. **Perfect Temperature**: Maintain oil at 350°F (175°C)\n\n## Pro Tips\n\n- Use a thermometer to check internal temperature (165°F/74°C)\n- Don\'t overcrowd the pan\n- Let chicken rest on a wire rack after frying\n\n*Enjoy your crispy, golden fried chicken!*',
        excerpt: 'Master the art of making crispy, juicy fried chicken at home with our comprehensive guide and pro tips.',
        coverImage: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg',
        author: {
            userId: 'testuserid',
            name: 'Test User',
        },
        category: 'recipe',
        tags: ['fried chicken', 'cooking', 'comfort food', 'american'],
        views: 1890,
        likes: ['user_gen_01', 'user_gen_02', 'user_gen_03', 'user_gen_04'],
        likesCount: 4,
        commentsCount: 2,
        status: 'published',
        createdAt: new Date('2026-01-10T14:00:00Z'),
        updatedAt: new Date('2026-01-10T14:00:00Z'),
        publishedAt: new Date('2026-01-10T14:00:00Z'),
    },
    {
        _id: ObjectId(),
        title: 'Tacos 101: A Beginner\'s Guide to Mexican Street Food',
        slug: 'tacos-101-beginners-guide-mexican-street-food',
        content:
            '# Tacos 101: A Beginner\'s Guide\n\n## What Makes a Great Taco?\n\nAuthentic tacos are simple yet flavorful. The key is quality ingredients and proper assembly.\n\n## Essential Components\n\n### Tortillas\n- Corn tortillas are traditional\n- Warm them before serving\n- Use 2 tortillas for extra strength\n\n### Protein Options\n- **Carne Asada**: Grilled beef\n- **Al Pastor**: Marinated pork\n- **Pollo**: Seasoned chicken\n- **Pescado**: Grilled fish\n\n### Toppings\n- Fresh cilantro\n- Diced onions\n- Lime wedges\n- Salsa verde or roja\n\n## Assembly Tips\n\n1. Warm tortillas on a griddle\n2. Add protein in the center\n3. Top with onions and cilantro\n4. Squeeze fresh lime\n5. Add salsa to taste\n\n*¡Buen provecho!*',
        excerpt: 'Learn how to make authentic Mexican tacos at home with this beginner-friendly guide to street food favorites.',
        coverImage: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635233/tacos_g0bqyg.jpg',
        author: {
            userId: merchantId,
            name: 'Test Merchant',
        },
        category: 'review',
        tags: ['tacos', 'mexican food', 'street food', 'guide'],
        views: 1650,
        likes: ['testuserid', 'user_gen_01', 'user_gen_05'],
        likesCount: 3,
        commentsCount: 4,
        status: 'published',
        createdAt: new Date('2026-01-12T16:30:00Z'),
        updatedAt: new Date('2026-01-12T16:30:00Z'),
        publishedAt: new Date('2026-01-12T16:30:00Z'),
    },
    {
        _id: ObjectId(),
        title: '5 Healthy Eating Habits for a Better Lifestyle',
        slug: '5-healthy-eating-habits-better-lifestyle',
        content:
            '# 5 Healthy Eating Habits for a Better Lifestyle\n\n## Introduction\n\nGood nutrition is the foundation of a healthy life. Here are 5 simple habits to improve your diet.\n\n## 1. Eat More Vegetables\n\nAim for at least 5 servings of vegetables daily. They\'re packed with vitamins, minerals, and fiber.\n\n## 2. Choose Whole Grains\n\nReplace white rice and bread with brown rice, quinoa, and whole wheat options.\n\n## 3. Stay Hydrated\n\nDrink 8 glasses of water daily. Limit sugary drinks and sodas.\n\n## 4. Control Portion Sizes\n\nUse smaller plates and listen to your body\'s hunger signals.\n\n## 5. Plan Your Meals\n\nMeal planning helps you make healthier choices and saves money.\n\n## Conclusion\n\nSmall changes lead to big results. Start with one habit and build from there!\n\n*Your health is your wealth.*',
        excerpt: 'Discover 5 simple and effective healthy eating habits that can transform your lifestyle and improve your wellbeing.',
        coverImage: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640680/orange-juice_qynanv.jpg',
        author: {
            userId: 'testuserid',
            name: 'Test User',
        },
        category: 'health',
        tags: ['healthy eating', 'nutrition', 'lifestyle', 'wellness'],
        views: 2100,
        likes: ['user_gen_01', 'user_gen_02', 'user_gen_03', 'user_gen_04', 'user_gen_05', 'user_gen_06', 'user_gen_07', 'user_gen_08'],
        likesCount: 8,
        commentsCount: 6,
        status: 'published',
        createdAt: new Date('2026-01-15T09:00:00Z'),
        updatedAt: new Date('2026-01-15T09:00:00Z'),
        publishedAt: new Date('2026-01-15T09:00:00Z'),
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
