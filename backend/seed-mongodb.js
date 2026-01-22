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

// REAL USER POOL from main.sql
const userIds = [
    { id: 'testuserid', name: 'Test User' },
    { id: 'testadminid', name: 'Test Admin' },
    { id: 'testmerchantid', name: 'Test Merchant' },
    { id: 'merchant_seafood', name: 'Ocean Breeze Merchant' },
    { id: 'merchant_coffee', name: 'Coffee Culture Owner' },
    { id: 'merchant_dessert', name: 'Sweet Treats Manager' },
    { id: 'merchant_002', name: 'Pho Hanoi Owner' },
    { id: 'merchant_003', name: 'Pizza Hut Manager' },
    { id: 'merchant_004', name: 'BBQ House Owner' },
    { id: 'merchant_005', name: 'Sushi Tokyo Manager' },
    { id: 'merchant_006', name: 'Bubble Tea Owner' },
    { id: 'merchant_007', name: 'Saigon Street Food Owner' },
    { id: 'merchant_008', name: 'Banh Mi Express Owner' },
    { id: 'merchant_009', name: 'Burger House Owner' },
    { id: 'merchant_010', name: 'Taco Bell Manager' },
    { id: 'merchant_011', name: 'Fried Chicken King' },
    { id: 'merchant_012', name: 'Healthy Bowl Owner' },
    { id: 'merchant_016', name: 'Merchant 016' },
    { id: 'merchant_017', name: 'Merchant 017' },
    { id: 'merchant_018', name: 'Merchant 018' },
    { id: 'merchant_019', name: 'Merchant 019' },
    { id: 'merchant_020', name: 'Merchant 020' },
    { id: 'merchant_021', name: 'Merchant 021' },
    { id: 'merchant_022', name: 'Merchant 022' },
    { id: 'merchant_023', name: 'Merchant 023' },
    { id: 'merchant_024', name: 'Merchant 024' },
    { id: 'merchant_025', name: 'Merchant 025' },
    { id: 'merchant_026', name: 'Merchant 026' },
    { id: 'merchant_027', name: 'Merchant 027' },
    { id: 'merchant_028', name: 'Merchant 028' },
    { id: 'merchant_029', name: 'Merchant 029' },
    { id: 'merchant_030', name: 'Merchant 030' }
];

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
    { id: 'PROD007', name: 'Special Pho', price: 65000, image: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769053123/pho-mon-an-truyen-thong-viet-nam-noi-tieng-the-gioi_jdgrzs.jpg' },
    { id: 'PROD008', name: 'Bun Bo Hue', price: 75000, image: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769053123/pho-mon-an-truyen-thong-viet-nam-noi-tieng-the-gioi_jdgrzs.jpg' },
    { id: 'PROD009', name: 'Special Fried Rice', price: 55000, image: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769053016/download_kcznof.jpg' },
    { id: 'PROD010', name: 'Banh Mi Dac Biet', price: 35000, image: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769053368/banh_mi_man_3051eb6d27_cenvbj.webp' },
    { id: 'PROD011', name: 'Vietnamese Milk Coffee', price: 25000, image: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769053084/download_aivrp9.jpg' },
    { id: 'PROD012', name: 'Sushi Combo Set', price: 185000, image: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769053184/download_dzh6wo.jpg' },
    { id: 'PROD013', name: 'Salmon Nigiri', price: 45000, image: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769053212/sushi-nhat-ban-jvb_gbpk6o.jpg' },
    { id: 'PROD014', name: 'Sushi Roll Platter', price: 125000, image: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769053209/sushi_480x480_hrj5mg.webp' },
    { id: 'PROD015', name: 'Tonkotsu Ramen', price: 60000, image: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769055134/download_sjsrvl.jpg' },
    { id: 'PROD019', name: 'Special Bun Dau Mam Tom', price: 95000, image: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769053161/mon-an-viet-ngon-8_hxwsqq.jpg' },
    { id: 'PROD017', name: 'Grilled Pork Banh Mi', price: 40000, image: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769053368/banh_mi_man_3051eb6d27_cenvbj.webp' },
    { id: 'PROD018', name: 'Vietnamese Sandwich Special', price: 45000, image: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769053354/download_apkwfb.jpg' },
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
        userId: userIds[Math.floor(Math.random() * userIds.length)].id,
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
        coverImage: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769053016/download_kcznof.jpg',
        author: {
            userId: 'testuserid',
            name: 'Test User',
        },
        category: 'review',
        tags: ['burgers', 'ho chi minh', 'fast food', 'top 10'],
        views: 1520,
        likes: ['testadminid', 'merchant_seafood', 'merchant_coffee', 'merchant_002', 'merchant_003'],
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
        likes: ['testuserid', 'merchant_002', 'merchant_003', 'merchant_004', 'merchant_005', 'merchant_006', 'merchant_007'],
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
        likes: ['merchant_seafood', 'merchant_coffee', 'merchant_004', 'merchant_005'],
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
        likes: ['testuserid', 'testadminid', 'merchant_005'],
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
        likes: ['merchant_008', 'merchant_009', 'merchant_010', 'merchant_011', 'merchant_012', 'merchant_016', 'merchant_017', 'merchant_018'],
        likesCount: 8,
        commentsCount: 6,
        status: 'published',
        createdAt: new Date('2026-01-15T09:00:00Z'),
        updatedAt: new Date('2026-01-15T09:00:00Z'),
        publishedAt: new Date('2026-01-15T09:00:00Z'),
    },
    {
        _id: ObjectId(),
        title: 'Vietnamese Coffee Culture: A Deep Dive',
        slug: 'vietnamese-coffee-culture-deep-dive',
        content:
            '# Vietnamese Coffee Culture: A Deep Dive\n\n## The Rich History of Vietnamese Coffee\n\nVietnam is the second-largest coffee producer in the world, and coffee culture runs deep in Vietnamese society.\n\n## Traditional Vietnamese Coffee\n\n### Cà Phê Sữa Đá (Iced Milk Coffee)\nThe most popular Vietnamese coffee drink. Strong dark roast coffee dripped through a phin filter, mixed with sweetened condensed milk and served over ice.\n\n### Cà Phê Đen (Black Coffee)\nPure Vietnamese coffee, no sugar, no milk. For true coffee lovers who appreciate the bold, robust flavor.\n\n### Cà Phê Trứng (Egg Coffee)\nA Hanoi specialty! Whipped egg yolk with sugar and condensed milk creates a creamy, custard-like topping.\n\n## Coffee Shop Culture\n\nVietnamese coffee shops are social hubs where people gather to chat, work, or simply watch the world go by.\n\n## How to Make Vietnamese Iced Coffee at Home\n\n1. Use Vietnamese ground coffee (Trung Nguyen or Highlands)\n2. Add 2-3 tablespoons to your phin filter\n3. Pour hot water and let it drip (4-5 minutes)\n4. Add 2 tablespoons sweetened condensed milk\n5. Stir and pour over ice\n\n*Enjoy your authentic Vietnamese coffee!*',
        excerpt: 'Explore the rich tradition of Vietnamese coffee culture, from traditional brewing methods to modern café society.',
        coverImage: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768640718/iced-coffee_xsym2r.jpg',
        author: {
            userId: 'testuserid',
            name: 'Test User',
        },
        category: 'tips',
        tags: ['coffee', 'vietnamese', 'culture', 'beverages'],
        views: 3200,
        likes: ['merchant_019', 'merchant_020', 'merchant_021', 'merchant_022', 'merchant_023', 'merchant_024', 'merchant_025', 'merchant_026', 'merchant_027', 'merchant_028'],
        likesCount: 10,
        commentsCount: 8,
        status: 'published',
        createdAt: new Date('2026-01-16T11:00:00Z'),
        updatedAt: new Date('2026-01-16T11:00:00Z'),
        publishedAt: new Date('2026-01-16T11:00:00Z'),
    },
    {
        _id: ObjectId(),
        title: 'Korean BBQ at Home: Complete Guide',
        slug: 'korean-bbq-at-home-complete-guide',
        content:
            '# Korean BBQ at Home: Complete Guide\n\n## Why Korean BBQ is So Special\n\nKorean BBQ (Gogi-gui) is more than just grilling meat—it\'s a social dining experience that brings people together.\n\n## Essential Equipment\n\n- Portable gas or charcoal grill\n- Long metal tongs\n- Kitchen scissors for cutting meat\n- Small dishes for banchan (side dishes)\n\n## Best Cuts of Meat\n\n### Beef\n- **Bulgogi**: Thinly sliced marinated beef\n- **Galbi**: Short ribs, sweet and savory\n- **Chadolbaegi**: Thin beef brisket\n\n### Pork\n- **Samgyeopsal**: Pork belly, the most popular\n- **Moksal**: Pork neck, tender and juicy\n\n## Marinades and Sauces\n\n### Classic Bulgogi Marinade\n- Soy sauce, sugar, sesame oil\n- Garlic, ginger, pear juice\n- Black pepper, green onions\n\n### Dipping Sauces\n- Ssamjang (fermented bean paste)\n- Gochujang (red chili paste)\n- Sesame oil with salt and pepper\n\n## Banchan (Side Dishes)\n\n- Kimchi (fermented cabbage)\n- Pickled radish\n- Bean sprouts\n- Lettuce leaves for wrapping\n\n## Grilling Tips\n\n1. Don\'t overcrowd the grill\n2. Cook pork belly until crispy\n3. Marinated meats cook faster\n4. Cut meat with scissors while grilling\n\n*Enjoy your Korean BBQ feast!*',
        excerpt: 'Learn how to host an authentic Korean BBQ at home with this comprehensive guide to meats, marinades, and techniques.',
        coverImage: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635215/garan_oak9ge.jpg',
        author: {
            userId: merchantId,
            name: 'Test Merchant',
        },
        category: 'recipe',
        tags: ['korean bbq', 'grilling', 'asian cuisine', 'entertaining'],
        views: 2850,
        likes: ['testuserid', 'testadminid', 'merchant_029', 'merchant_030', 'merchant_seafood', 'merchant_coffee', 'merchant_dessert'],
        likesCount: 7,
        commentsCount: 5,
        status: 'published',
        createdAt: new Date('2026-01-17T13:30:00Z'),
        updatedAt: new Date('2026-01-17T13:30:00Z'),
        publishedAt: new Date('2026-01-17T13:30:00Z'),
    },
    {
        _id: ObjectId(),
        title: 'The Best Pho Restaurants in Hanoi',
        slug: 'best-pho-restaurants-hanoi',
        content:
            '# The Best Pho Restaurants in Hanoi\n\n## Introduction to Pho\n\nPho is Vietnam\'s national dish—a fragrant beef noodle soup that has captured hearts worldwide.\n\n## Top 5 Pho Restaurants in Hanoi\n\n### 1. Phở Gia Truyền Bát Đàn\n**Location**: 49 Bat Dan Street, Old Quarter\n**Specialty**: Traditional beef pho with rich, clear broth\n**Price**: 50,000 - 70,000 VND\n\nThis family-run restaurant has been serving pho for over 70 years. The secret is in their slow-cooked bone broth.\n\n### 2. Phở Thìn Lò Đúc\n**Location**: 13 Lo Duc Street\n**Specialty**: Stir-fried beef pho\n**Price**: 60,000 - 80,000 VND\n\nUnique style where beef is stir-fried before being added to the soup.\n\n### 3. Phở 10 Lý Quốc Sư\n**Location**: 10 Ly Quoc Su Street\n**Specialty**: Chicken pho (Pho Ga)\n**Price**: 45,000 - 65,000 VND\n\nPerfect for those who prefer a lighter, chicken-based broth.\n\n### 4. Phở Suong\n**Location**: 24B Trung Yen Lane\n**Specialty**: Southern-style pho with herbs\n**Price**: 55,000 - 75,000 VND\n\nMore herbs and sweeter broth, Southern Vietnam style.\n\n### 5. Phở Vui\n**Location**: 90 Hang Trong Street\n**Specialty**: Late-night pho\n**Price**: 50,000 - 70,000 VND\n\nOpen until 2 AM, perfect for late-night cravings.\n\n## What Makes Great Pho?\n\n- **Broth**: Clear, aromatic, simmered for hours\n- **Noodles**: Fresh rice noodles, soft but not mushy\n- **Beef**: Thinly sliced, tender\n- **Herbs**: Fresh basil, cilantro, lime, chili\n\n*Visit these spots and experience authentic Hanoi pho!*',
        excerpt: 'Discover the top 5 pho restaurants in Hanoi, from traditional family recipes to modern interpretations of Vietnam\'s iconic dish.',
        coverImage: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635341/gasot_opwrcw.jpg',
        author: {
            userId: 'testuserid',
            name: 'Test User',
        },
        category: 'review',
        tags: ['pho', 'hanoi', 'vietnamese food', 'restaurants'],
        views: 4100,
        likes: ['testuserid', 'testadminid', 'merchant_seafood', 'merchant_coffee', 'merchant_dessert', 'merchant_002', 'merchant_003', 'merchant_004', 'merchant_005', 'merchant_010', 'merchant_011', 'merchant_012'],
        likesCount: 12,
        commentsCount: 10,
        status: 'published',
        createdAt: new Date('2026-01-18T10:00:00Z'),
        updatedAt: new Date('2026-01-18T10:00:00Z'),
        publishedAt: new Date('2026-01-18T10:00:00Z'),
    },
    {
        _id: ObjectId(),
        title: 'Burrito vs Taco: What\'s the Difference?',
        slug: 'burrito-vs-taco-whats-the-difference',
        content:
            '# Burrito vs Taco: What\'s the Difference?\n\n## Introduction\n\nBoth burritos and tacos are beloved Mexican dishes, but they\'re quite different in construction and eating experience.\n\n## The Taco\n\n### Characteristics\n- **Tortilla**: Small corn or flour tortilla\n- **Size**: Bite-sized, typically 4-6 inches\n- **Folding**: Folded in half, open on top\n- **Eating**: Eaten with hands, often messy\n\n### Common Fillings\n- Carne asada (grilled beef)\n- Al pastor (marinated pork)\n- Carnitas (slow-cooked pork)\n- Simple toppings: onions, cilantro, salsa\n\n## The Burrito\n\n### Characteristics\n- **Tortilla**: Large flour tortilla (10-12 inches)\n- **Size**: Substantial, meal-sized\n- **Folding**: Completely wrapped, sealed\n- **Eating**: Can be eaten with hands or fork\n\n### Common Fillings\n- Rice and beans (essential)\n- Meat (beef, chicken, pork)\n- Cheese, sour cream, guacamole\n- Lettuce, tomatoes, salsa\n- Everything wrapped together\n\n## Regional Variations\n\n### Mission-Style Burrito (San Francisco)\n- Extra large\n- Steamed tortilla\n- Loaded with ingredients\n\n### Breakfast Burrito\n- Eggs, bacon, potatoes\n- Popular in American Southwest\n\n### Street Tacos (Mexico)\n- Authentic, simple\n- Double corn tortillas\n- Minimal toppings\n\n## Which One to Choose?\n\n**Choose Tacos if you want:**\n- Light meal or snack\n- Variety (order multiple types)\n- Authentic Mexican experience\n\n**Choose Burrito if you want:**\n- Filling, complete meal\n- Less messy eating\n- All flavors in one bite\n\n## Conclusion\n\nBoth are delicious! Why not try both and decide for yourself?\n\n*¡Buen provecho!*',
        excerpt: 'Confused about the difference between burritos and tacos? This guide breaks down everything you need to know about these Mexican favorites.',
        coverImage: 'https://res.cloudinary.com/djogch5t0/image/upload/v1768635268/buritos_b3kdr9.jpg',
        author: {
            userId: merchantId,
            name: 'Test Merchant',
        },
        category: 'tips',
        tags: ['burrito', 'taco', 'mexican food', 'food guide'],
        views: 2650,
        likes: ['testadminid', 'merchant_seafood', 'merchant_coffee', 'merchant_010', 'merchant_011'],
        likesCount: 5,
        commentsCount: 7,
        status: 'published',
        createdAt: new Date('2026-01-19T15:00:00Z'),
        updatedAt: new Date('2026-01-19T15:00:00Z'),
        publishedAt: new Date('2026-01-19T15:00:00Z'),
    },
    {
        _id: ObjectId(),
        title: 'Food Photography Tips for Instagram',
        slug: 'food-photography-tips-instagram',
        content:
            '# Food Photography Tips for Instagram\n\n## Why Food Photography Matters\n\nIn the age of social media, great food photos can make or break a restaurant\'s reputation. Here\'s how to take stunning food photos.\n\n## Essential Equipment\n\n### You Don\'t Need Expensive Gear\n- Modern smartphone cameras are excellent\n- Natural light is your best friend\n- Simple props enhance the shot\n\n## Lighting Tips\n\n### Natural Light is Best\n- Shoot near windows\n- Avoid direct sunlight (too harsh)\n- Overcast days provide soft, even light\n- Golden hour (sunrise/sunset) is magical\n\n### Avoid Flash\n- Creates harsh shadows\n- Unnatural colors\n- Makes food look unappetizing\n\n## Composition Techniques\n\n### Rule of Thirds\n- Divide frame into 9 equal parts\n- Place subject at intersection points\n- Creates balanced, interesting photos\n\n### Angles to Try\n\n**Overhead (Flat Lay)**\n- Perfect for: Pizza, bowls, platters\n- Shows entire dish and arrangement\n\n**45-Degree Angle**\n- Most versatile angle\n- Good for: Burgers, sandwiches, drinks\n- Shows height and layers\n\n**Eye Level**\n- Best for: Tall items, burgers, cakes\n- Creates intimate, inviting feel\n\n## Styling Tips\n\n### Keep It Simple\n- Remove clutter from background\n- Use neutral plates and surfaces\n- Add one or two props (napkin, utensils)\n\n### Add Context\n- Show hands holding food\n- Include drinks in the frame\n- Add fresh ingredients as props\n\n### Colors Matter\n- Complementary colors pop\n- Green herbs add freshness\n- White plates make colors vibrant\n\n## Editing Tips\n\n### Basic Adjustments\n1. **Brightness**: Slightly increase\n2. **Contrast**: Moderate boost\n3. **Saturation**: Subtle enhancement\n4. **Warmth**: Add slight warmth\n5. **Sharpness**: Light sharpening\n\n### Apps to Use\n- Lightroom Mobile (professional)\n- VSCO (filters)\n- Snapseed (free, powerful)\n- Instagram built-in tools\n\n## Common Mistakes to Avoid\n\n❌ Over-editing (unnatural colors)\n❌ Too many props (cluttered)\n❌ Poor lighting (dark, yellow)\n❌ Messy presentation\n❌ Using flash\n\n## Pro Tips\n\n✅ Shoot from multiple angles\n✅ Take photos before eating\n✅ Clean plate edges\n✅ Add steam for hot dishes\n✅ Show texture and details\n\n## Conclusion\n\nGreat food photography is about practice. Experiment with different angles, lighting, and compositions to find your style!\n\n*Happy shooting! 📸*',
        excerpt: 'Master the art of food photography with these professional tips for creating Instagram-worthy food photos using just your smartphone.',
        coverImage: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769053064/photo_fpgus1.jpg',
        author: {
            userId: 'testuserid',
            name: 'Test User',
        },
        category: 'tips',
        tags: ['photography', 'instagram', 'social media', 'food styling'],
        views: 5200,
        likes: ['merchant_002', 'merchant_003', 'merchant_004', 'merchant_005', 'merchant_006', 'merchant_007', 'merchant_008', 'merchant_009', 'merchant_010', 'merchant_011', 'merchant_012', 'merchant_016', 'merchant_017', 'merchant_018', 'merchant_019'],
        likesCount: 15,
        commentsCount: 12,
        status: 'published',
        createdAt: new Date('2026-01-20T14:00:00Z'),
        updatedAt: new Date('2026-01-20T14:00:00Z'),
        publishedAt: new Date('2026-01-20T14:00:00Z'),
    },
    {
        _id: ObjectId(),
        title: 'Bibimbap: The Perfect Korean Rice Bowl',
        slug: 'bibimbap-perfect-korean-rice-bowl',
        content:
            '# Bibimbap: The Perfect Korean Rice Bowl\n\n## What is Bibimbap?\n\nBibimbap (비빔밥) literally means "mixed rice" in Korean. It\'s a colorful bowl of rice topped with seasoned vegetables, meat, a fried egg, and gochujang (Korean chili paste).\n\n## The Art of Bibimbap\n\n### Traditional Ingredients\n\n**Vegetables (Namul)**:\n- Spinach (blanched and seasoned)\n- Bean sprouts\n- Carrots (julienned)\n- Zucchini\n- Mushrooms\n- Fernbrake (gosari)\n\n**Protein**:\n- Beef bulgogi (most common)\n- Tofu (vegetarian option)\n- Chicken\n\n**Essential Toppings**:\n- Fried egg (sunny side up)\n- Gochujang (red chili paste)\n- Sesame oil\n- Toasted sesame seeds\n\n## Dolsot Bibimbap\n\nThe most popular version is **Dolsot Bibimbap** - served in a hot stone bowl. The rice at the bottom gets crispy and creates a delicious crust called "nurungji".\n\n### Why Stone Bowl?\n- Keeps food hot longer\n- Creates crispy rice crust\n- Better mixing and flavor distribution\n- Authentic presentation\n\n## How to Eat Bibimbap\n\n1. **Don\'t mix immediately**: Admire the beautiful arrangement first!\n2. **Add gochujang**: Start with a small amount, you can always add more\n3. **Drizzle sesame oil**: Adds nutty flavor and helps mixing\n4. **Mix thoroughly**: Use your spoon to mix everything together\n5. **Enjoy**: The combination of flavors and textures is amazing!\n\n## Health Benefits\n\n- **Balanced nutrition**: Carbs, protein, and vegetables in one bowl\n- **Customizable**: Easy to make vegetarian or vegan\n- **Portion controlled**: One bowl is a complete meal\n- **Colorful vegetables**: Rich in vitamins and minerals\n\n## Making Bibimbap at Home\n\n### Quick Version\n1. Cook short-grain rice\n2. Prepare vegetables (can use pre-cut)\n3. Cook protein of choice\n4. Fry an egg\n5. Assemble in a bowl\n6. Add gochujang and sesame oil\n7. Mix and enjoy!\n\n### Pro Tips\n- Use a cast iron skillet if you don\'t have a stone bowl\n- Season each vegetable separately for authentic taste\n- Let rice sit in hot bowl for crispy bottom\n- Don\'t skip the sesame oil - it\'s essential!\n\n*Bibimbap is comfort food at its finest! 🍚*',
        excerpt: 'Discover the art of making perfect bibimbap, Korea\'s iconic mixed rice bowl with vegetables, meat, and gochujang.',
        coverImage: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769003940/Dolsot-bibimbap_ezbbug.jpg',
        author: {
            userId: 'testuserid',
            name: 'Test User',
        },
        category: 'recipe',
        tags: ['bibimbap', 'korean food', 'rice bowl', 'healthy'],
        views: 3800,
        likes: ['merchant_020', 'merchant_021', 'merchant_022', 'merchant_023', 'merchant_024', 'merchant_025', 'merchant_026', 'merchant_027', 'merchant_028'],
        likesCount: 9,
        commentsCount: 6,
        status: 'published',
        createdAt: new Date('2026-01-21T09:00:00Z'),
        updatedAt: new Date('2026-01-21T09:00:00Z'),
        publishedAt: new Date('2026-01-21T09:00:00Z'),
    },
    {
        _id: ObjectId(),
        title: 'The Ultimate Guide to Japanese Ramen',
        slug: 'ultimate-guide-japanese-ramen',
        content:
            '# The Ultimate Guide to Japanese Ramen\n\n## Introduction to Ramen\n\nRamen is Japan\'s most beloved comfort food - a bowl of noodles in flavorful broth, topped with various ingredients. What started as Chinese-inspired noodles has evolved into a uniquely Japanese culinary art.\n\n## Types of Ramen Broth\n\n### 1. Tonkotsu (豚骨)\n**The King of Ramen Broths**\n- Made from pork bones simmered for 12-18 hours\n- Creamy, rich, milky white color\n- Originated in Fukuoka (Hakata style)\n- Most popular worldwide\n\n### 2. Shoyu (醤油)\n**Soy Sauce Based**\n- Clear brown broth\n- Soy sauce flavor base\n- Light but flavorful\n- Tokyo\'s signature style\n\n### 3. Miso (味噌)\n**Fermented Soybean Paste**\n- Rich, hearty, slightly sweet\n- Originated in Hokkaido\n- Perfect for cold weather\n- Often served with corn and butter\n\n### 4. Shio (塩)\n**Salt Based**\n- Lightest and clearest broth\n- Delicate chicken or seafood base\n- Allows noodle flavor to shine\n\n## Essential Ramen Components\n\n### The Noodles\n- **Thickness**: Thin, medium, or thick\n- **Texture**: Firm (katamen) to soft (yawarakamen)\n- **Shape**: Straight or wavy\n- Made with wheat flour and kansui (alkaline water)\n\n### Common Toppings\n\n**Chashu (叉焼)**\n- Braised pork belly\n- Melt-in-your-mouth tender\n- Often torched for extra flavor\n\n**Ajitsuke Tamago (味付け卵)**\n- Marinated soft-boiled egg\n- Jammy yolk is essential\n- Marinated in soy sauce and mirin\n\n**Menma (メンマ)**\n- Fermented bamboo shoots\n- Adds crunch and umami\n\n**Nori (海苔)**\n- Dried seaweed sheets\n- Adds ocean flavor\n\n**Negi (ネギ)**\n- Green onions\n- Fresh, sharp flavor\n\n**Kikurage (キクラゲ)**\n- Wood ear mushrooms\n- Crunchy texture\n\n## Regional Ramen Styles\n\n### Hakata Ramen (Fukuoka)\n- Tonkotsu broth\n- Thin, straight noodles\n- Minimal toppings\n- Can order "kaedama" (noodle refill)\n\n### Sapporo Ramen (Hokkaido)\n- Miso broth\n- Thick, wavy noodles\n- Topped with corn and butter\n- Rich and hearty\n\n### Tokyo Ramen\n- Shoyu broth\n- Medium-thick curly noodles\n- Classic toppings\n\n### Kitakata Ramen (Fukushima)\n- Light soy sauce broth\n- Flat, wide noodles\n- Simple and elegant\n\n## Ramen Etiquette\n\n### Do\'s:\n✅ Slurp your noodles (shows appreciation)\n✅ Eat quickly while hot\n✅ Drink the broth directly from bowl\n✅ Use the spoon for toppings\n\n### Don\'ts:\n❌ Don\'t let noodles sit too long (they get soggy)\n❌ Don\'t blow on noodles (slurp to cool)\n❌ Don\'t leave broth unfinished (it\'s the soul of ramen)\n\n## Making Ramen at Home\n\n### Beginner Tips\n1. Start with instant ramen, upgrade with fresh toppings\n2. Buy fresh ramen noodles from Asian markets\n3. Make tare (seasoning base) in advance\n4. Prep all toppings before cooking noodles\n5. Serve immediately in pre-warmed bowls\n\n### Advanced: Making Tonkotsu Broth\n1. Blanch pork bones to remove impurities\n2. Simmer bones at rolling boil for 12+ hours\n3. Add aromatics (ginger, garlic, green onion)\n4. Strain and season with tare\n5. Emulsify by maintaining high heat\n\n## Best Ramen Shops to Try\n\n- **Ichiran**: Famous tonkotsu chain, solo dining booths\n- **Ippudo**: International chain, consistent quality\n- **Tsuta**: First Michelin-starred ramen shop\n- **Afuri**: Yuzu-infused light ramen\n\n*Ramen is more than food - it\'s an experience! 🍜*',
        excerpt: 'Master the art of Japanese ramen with this comprehensive guide covering broth types, noodles, toppings, and regional styles.',
        coverImage: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1766017787/eoxnxltgruqiyf6ailvl.jpg',
        author: {
            userId: merchantId,
            name: 'Test Merchant',
        },
        category: 'recipe',
        tags: ['ramen', 'japanese food', 'noodles', 'comfort food'],
        views: 6200,
        likes: ['testuserid'],
        likesCount: 18,
        commentsCount: 14,
        status: 'published',
        createdAt: new Date('2026-01-21T11:00:00Z'),
        updatedAt: new Date('2026-01-21T11:00:00Z'),
        publishedAt: new Date('2026-01-21T11:00:00Z'),
    },
    {
        _id: ObjectId(),
        title: 'Japanese Curry Rice: Comfort Food for the Whole Family',
        slug: 'japanese-curry-rice-comfort-food-family',
        content:
            '# Japanese Curry Rice: Comfort Food for the Whole Family\n\n## What is Japanese Curry?\n\nJapanese curry (カレーライス, karē raisu) is different from Indian or Thai curry. It\'s sweeter, milder, and thicker - perfect for kids and adults alike. It\'s one of Japan\'s most popular home-cooked meals.\n\n## History of Japanese Curry\n\nIntroduced to Japan by the British Navy in the late 1800s, curry was adapted to Japanese tastes:\n- Made sweeter and less spicy\n- Thickened with roux\n- Served with rice instead of naan\n- Became a staple comfort food\n\n## Types of Japanese Curry\n\n### Katsu Curry\n- Curry rice topped with tonkatsu (breaded pork cutlet)\n- Most popular variation\n- Crispy meets creamy\n\n### Chicken Curry\n- Tender chicken pieces\n- Family-friendly\n- Most common home-cooked version\n\n### Beef Curry\n- Rich and hearty\n- Often with potatoes and carrots\n\n### Vegetable Curry\n- Packed with seasonal vegetables\n- Healthy option\n- Can be vegan\n\n### Seafood Curry\n- Shrimp, squid, or mixed seafood\n- Lighter flavor\n\n## Essential Ingredients\n\n### The Curry Roux\nMost Japanese households use store-bought curry roux blocks:\n- **S\u0026B Golden Curry**: Most popular brand\n- **Vermont Curry**: Sweeter, kid-friendly\n- **Java Curry**: Spicier option\n- **Kokumaro**: Rich and flavorful\n\nAvailable in mild, medium, and hot levels.\n\n### Common Vegetables\n- Potatoes (cut into chunks)\n- Carrots (cut into chunks)\n- Onions (sliced)\n- Sometimes: mushrooms, bell peppers, peas\n\n### Protein Options\n- Chicken thighs (most common)\n- Pork (shoulder or belly)\n- Beef (chuck or stew meat)\n- Tofu (vegetarian)\n\n## How to Make Japanese Curry\n\n### Basic Recipe (Serves 4-6)\n\n**Ingredients**:\n- 500g protein of choice\n- 2 large potatoes\n- 2 carrots\n- 1 large onion\n- 1 box curry roux (usually 8-12 cubes)\n- 800ml water\n- 2 tbsp oil\n\n**Instructions**:\n\n1. **Prep ingredients**\n   - Cut protein into bite-sized pieces\n   - Peel and chunk potatoes and carrots\n   - Slice onions\n\n2. **Sauté**\n   - Heat oil in large pot\n   - Cook protein until browned\n   - Add onions, cook until soft\n\n3. **Simmer**\n   - Add water and bring to boil\n   - Add potatoes and carrots\n   - Simmer 15-20 minutes until vegetables tender\n\n4. **Add roux**\n   - Turn off heat\n   - Break curry roux into pieces\n   - Stir until completely dissolved\n\n5. **Final simmer**\n   - Return to low heat\n   - Simmer 5-10 minutes, stirring\n   - Curry will thicken\n\n6. **Serve**\n   - Serve over steamed white rice\n   - Optional: fukujinzuke (pickled vegetables) on side\n\n## Tips for Perfect Curry\n\n### Make it Richer\n- Add grated apple for sweetness\n- Use chicken stock instead of water\n- Add a tablespoon of butter\n- Mix in some ketchup or Worcestershire sauce\n- Grate in some chocolate (secret ingredient!)\n\n### Adjust Thickness\n- **Too thick**: Add more water\n- **Too thin**: Simmer longer or add more roux\n- **Perfect**: Coats the back of a spoon\n\n### Storage Tips\n- Tastes better the next day!\n- Store in refrigerator up to 3 days\n- Freezes well for up to 1 month\n- Reheat gently, add water if needed\n\n## Serving Suggestions\n\n### Traditional\n- Serve over white rice\n- Rice on one side, curry on other\n- Fukujinzuke pickles on side\n\n### Modern Variations\n- **Curry Udon**: Serve over thick udon noodles\n- **Curry Bread**: Stuff in bread and deep fry\n- **Curry Doria**: Baked rice gratin with curry\n- **Curry Croquette**: Mashed potato curry croquettes\n\n## Why Kids Love It\n\n✅ Mild and not too spicy\n✅ Sweet flavor profile\n✅ Familiar vegetables\n✅ Fun to eat with rice\n✅ Customizable spice level\n\n## Nutritional Benefits\n\n- **Complete meal**: Protein, carbs, vegetables\n- **Turmeric**: Anti-inflammatory properties\n- **Vegetables**: Vitamins and fiber\n- **Customizable**: Can make healthier versions\n\n*Japanese curry is the ultimate comfort food - warm, filling, and delicious! 🍛*',
        excerpt: 'Learn how to make authentic Japanese curry rice, a sweet and mild comfort food that\'s perfect for the whole family.',
        coverImage: 'https://res.cloudinary.com/djalvvgd0/image/upload/v1769004065/doi-gio-cho-ca-gia-dinh-voi-mon-com-ca-ri-kieu-nhat-ban-tre-em-cung-an-duoc-202007231448514435_vwfjfn.jpg',
        author: {
            userId: 'testuserid',
            name: 'Test User',
        },
        category: 'recipe',
        tags: ['japanese curry', 'curry rice', 'family meal', 'comfort food'],
        views: 4500,
        likes: ['merchant_seafood', 'merchant_coffee', 'merchant_dessert', 'merchant_002', 'merchant_003', 'merchant_004', 'merchant_005', 'merchant_006', 'merchant_007', 'merchant_008', 'merchant_009'],
        likesCount: 11,
        commentsCount: 9,
        status: 'published',
        createdAt: new Date('2026-01-21T13:00:00Z'),
        updatedAt: new Date('2026-01-21T13:00:00Z'),
        publishedAt: new Date('2026-01-21T13:00:00Z'),
    },
]);

// COMMENTS - Comprehensive comment data for all blogs
const blogIds = db.blogs.find({}, { _id: 1, slug: 1 }).toArray();

const comments = [];

// Helper to create comment
function createComment(blogId, userId, userName, content, createdDate, parentId = null) {
    return {
        _id: ObjectId(),
        blogId: blogId,
        userId: userId,
        userName: userName,
        userAvatar: `https://ui-avatars.com/api/?name=${userName.replace(' ', '+')}&background=random`,
        content: content,
        parentId: parentId,
        likes: [],
        likesCount: Math.floor(Math.random() * 10),
        createdAt: createdDate,
        updatedAt: createdDate,
    };
}

// Comments for Blog 1: Top 10 Best Burgers
const blog1 = db.blogs.findOne({ slug: 'top-10-best-burgers-ho-chi-minh-city' });
if (blog1) {
    comments.push(
        createComment(blog1._id, 'testadminid', 'Test Admin', 'Great list! I\'ve tried The Gourmet Kitchen and it\'s amazing! 🍔', new Date('2026-01-02T10:30:00Z')),
        createComment(blog1._id, 'merchant_002', 'Pho Hanoi Owner', 'You should add Burger Bros to this list, their bacon burger is incredible!', new Date('2026-01-03T14:20:00Z')),
        createComment(blog1._id, 'testuserid', 'Test User', 'Thanks for the suggestion! I\'ll check them out for the next update.', new Date('2026-01-03T15:00:00Z'), null),
        createComment(blog1._id, 'merchant_003', 'Mike Chen', 'The photos look delicious! Definitely visiting this weekend.', new Date('2026-01-04T09:15:00Z')),
        createComment(blog1._id, 'merchant_004', 'Emily Davis', 'Which one has the best vegetarian options?', new Date('2026-01-05T11:45:00Z')),
    );
}

// Comments for Blog 2: How to Make Pizza
const blog2 = db.blogs.findOne({ slug: 'how-to-make-authentic-italian-pizza-at-home' });
if (blog2) {
    comments.push(
        createComment(blog2._id, 'testadminid', 'John Smith', 'I tried this recipe and it turned out perfect! The dough was so good.', new Date('2026-01-06T16:30:00Z')),
        createComment(blog2._id, 'merchant_005', 'Lisa Wong', 'Can I use bread flour instead of all-purpose flour?', new Date('2026-01-07T10:00:00Z')),
        createComment(blog2._id, merchantId, 'Test Merchant', 'Yes! Bread flour will make it even chewier and more authentic.', new Date('2026-01-07T10:30:00Z'), null),
        createComment(blog2._id, 'merchant_seafood', 'David Lee', 'What temperature should the oven be for best results?', new Date('2026-01-08T12:00:00Z')),
        createComment(blog2._id, merchantId, 'Test Merchant', 'As hot as possible! 475°F minimum, but if your oven goes to 500°F, even better.', new Date('2026-01-08T12:15:00Z'), null),
        createComment(blog2._id, 'merchant_coffee', 'Anna Martinez', 'Made this for my family, everyone loved it! Thank you! 🍕', new Date('2026-01-09T18:45:00Z')),
        createComment(blog2._id, 'merchant_dessert', 'Tom Wilson', 'The step-by-step instructions are very clear. Great guide!', new Date('2026-01-10T08:20:00Z')),
    );
}

// Comments for Blog 3: Fried Chicken Guide
const blog3 = db.blogs.findOne({ slug: 'ultimate-guide-perfect-fried-chicken' });
if (blog3) {
    comments.push(
        createComment(blog3._id, 'merchant_002', 'Sarah Johnson', 'The double dredge technique really works! Crispiest chicken ever!', new Date('2026-01-11T13:00:00Z')),
        createComment(blog3._id, 'merchant_003', 'Chris Brown', 'How long should I fry each piece?', new Date('2026-01-12T09:30:00Z')),
        createComment(blog3._id, 'testuserid', 'Test User', 'About 12-15 minutes, until internal temp reaches 165°F. Use a thermometer!', new Date('2026-01-12T10:00:00Z'), null),
        createComment(blog3._id, 'merchant_004', 'Jessica Taylor', 'Can I use an air fryer instead?', new Date('2026-01-13T14:45:00Z')),
    );
}

// Comments for Blog 4: Tacos Guide
const blog4 = db.blogs.findOne({ slug: 'tacos-101-beginners-guide-mexican-street-food' });
if (blog4) {
    comments.push(
        createComment(blog4._id, 'merchant_003', 'Mike Chen', 'Finally understand the difference between all the taco types! Thanks!', new Date('2026-01-13T11:00:00Z')),
        createComment(blog4._id, 'merchant_005', 'Maria Garcia', 'As a Mexican, I approve this guide! Very authentic. 🌮', new Date('2026-01-14T10:15:00Z')),
        createComment(blog4._id, merchantId, 'Test Merchant', 'Thank you! I learned from my Mexican friends in California.', new Date('2026-01-14T11:00:00Z'), null),
        createComment(blog4._id, 'merchant_seafood', 'Robert Kim', 'Where can I buy good corn tortillas in HCMC?', new Date('2026-01-14T15:30:00Z')),
        createComment(blog4._id, 'merchant_coffee', 'Nina Patel', 'The al pastor recipe is spot on! Made it last night.', new Date('2026-01-15T09:20:00Z')),
    );
}

// Comments for Blog 5: Healthy Eating
const blog5 = db.blogs.findOne({ slug: '5-healthy-eating-habits-better-lifestyle' });
if (blog5) {
    comments.push(
        createComment(blog5._id, 'merchant_004', 'Emily Davis', 'I\'ve started meal planning and it\'s changed my life!', new Date('2026-01-16T08:00:00Z')),
        createComment(blog5._id, 'merchant_seafood', 'Kevin Zhang', 'Great tips! I\'m starting with habit #1 this week.', new Date('2026-01-16T12:30:00Z')),
        createComment(blog5._id, 'merchant_coffee', 'Sophie Anderson', 'The portion control tip is so helpful. Using smaller plates now!', new Date('2026-01-17T10:00:00Z')),
        createComment(blog5._id, 'testuserid', 'Test User', 'That\'s wonderful! Small changes make a big difference.', new Date('2026-01-17T11:00:00Z'), null),
        createComment(blog5._id, 'merchant_dessert', 'James Miller', 'Any tips for staying hydrated? I always forget to drink water.', new Date('2026-01-18T14:20:00Z')),
        createComment(blog5._id, 'testuserid', 'Test User', 'Try setting phone reminders every 2 hours, or get a water bottle with time markers!', new Date('2026-01-18T14:45:00Z'), null),
        createComment(blog5._id, 'merchant_002', 'Rachel Green', 'Love this article! Sharing with my friends.', new Date('2026-01-19T09:30:00Z')),
    );
}

// Comments for Blog 6: Vietnamese Coffee
const blog6 = db.blogs.findOne({ slug: 'vietnamese-coffee-culture-deep-dive' });
if (blog6) {
    comments.push(
        createComment(blog6._id, 'merchant_005', 'Lisa Wong', 'Vietnamese coffee is the best! I drink it every morning. ☕', new Date('2026-01-17T08:30:00Z')),
        createComment(blog6._id, 'merchant_002', 'Daniel Nguyen', 'Egg coffee is amazing! Everyone should try it at least once.', new Date('2026-01-17T10:15:00Z')),
        createComment(blog6._id, 'merchant_seafood', 'David Lee', 'Where can I buy a phin filter?', new Date('2026-01-17T14:00:00Z')),
        createComment(blog6._id, 'testuserid', 'Test User', 'You can find them at any Vietnamese grocery store or online!', new Date('2026-01-17T14:30:00Z'), null),
        createComment(blog6._id, 'testadminid', 'Amanda Clark', 'I visited Vietnam last year and fell in love with the coffee culture!', new Date('2026-01-18T09:00:00Z')),
        createComment(blog6._id, 'merchant_003', 'Peter Tran', 'Trung Nguyen coffee is the best brand! 👍', new Date('2026-01-18T16:45:00Z')),
        createComment(blog6._id, 'merchant_coffee', 'Anna Martinez', 'The condensed milk makes it so sweet and creamy. Love it!', new Date('2026-01-19T11:20:00Z')),
        createComment(blog6._id, 'merchant_dessert', 'Tom Wilson', 'Great article! Very informative about Vietnamese coffee history.', new Date('2026-01-20T08:00:00Z')),
    );
}

// Comments for Blog 7: Korean BBQ
const blog7 = db.blogs.findOne({ slug: 'korean-bbq-at-home-complete-guide' });
if (blog7) {
    comments.push(
        createComment(blog7._id, 'merchant_003', 'Chris Brown', 'Samgyeopsal is my favorite! This guide is perfect.', new Date('2026-01-18T12:00:00Z')),
        createComment(blog7._id, 'merchant_004', 'Jessica Taylor', 'Can I use a regular grill instead of a Korean BBQ grill?', new Date('2026-01-18T15:30:00Z')),
        createComment(blog7._id, merchantId, 'Test Merchant', 'Yes! Any grill works. The key is high heat and thin slices.', new Date('2026-01-18T16:00:00Z'), null),
        createComment(blog7._id, 'merchant_005', 'Maria Garcia', 'The marinade recipe is delicious! Used it for bulgogi.', new Date('2026-01-19T10:45:00Z')),
        createComment(blog7._id, 'testadminid', 'Robert Kim', 'Don\'t forget the soju! 🍶 Perfect pairing with Korean BBQ.', new Date('2026-01-19T18:00:00Z')),
    );
}

// Comments for Blog 8: Pho Restaurants
const blog8 = db.blogs.findOne({ slug: 'best-pho-restaurants-hanoi' });
if (blog8) {
    comments.push(
        createComment(blog8._id, 'merchant_010', 'Nina Patel', 'Phở Gia Truyền is incredible! Been there 3 times already.', new Date('2026-01-19T09:00:00Z')),
        createComment(blog8._id, 'merchant_seafood', 'Kevin Zhang', 'I prefer Phở Thìn, the stir-fried beef is unique!', new Date('2026-01-19T11:30:00Z')),
        createComment(blog8._id, 'merchant_coffee', 'Sophie Anderson', 'What\'s the best time to visit to avoid crowds?', new Date('2026-01-19T14:00:00Z')),
        createComment(blog8._id, 'testuserid', 'Test User', 'Early morning (7-8 AM) or mid-afternoon (2-3 PM) are usually quieter.', new Date('2026-01-19T14:30:00Z'), null),
        createComment(blog8._id, 'merchant_dessert', 'James Miller', 'Phở 10 has the best chicken pho I\'ve ever had!', new Date('2026-01-20T08:45:00Z')),
        createComment(blog8._id, 'merchant_002', 'Rachel Green', 'Great list! I\'m visiting Hanoi next month, will try all of these! 🍜', new Date('2026-01-20T10:15:00Z')),
        createComment(blog8._id, 'merchant_003', 'Daniel Nguyen', 'Phở Vui is perfect for late night cravings after drinking!', new Date('2026-01-20T16:30:00Z')),
        createComment(blog8._id, 'merchant_004', 'Amanda Clark', 'The photos are making me hungry! 😋', new Date('2026-01-20T18:00:00Z')),
        createComment(blog8._id, 'merchant_005', 'Peter Tran', 'As a Hanoian, I approve this list! All authentic places.', new Date('2026-01-21T09:00:00Z')),
        createComment(blog8._id, 'testuserid', 'Test User', 'Thank you! I spent weeks researching and tasting to make this list.', new Date('2026-01-21T10:00:00Z'), null),
    );
}

// Comments for Blog 9: Burrito vs Taco
const blog9 = db.blogs.findOne({ slug: 'burrito-vs-taco-whats-the-difference' });
if (blog9) {
    comments.push(
        createComment(blog9._id, 'testadminid', 'John Smith', 'I always wondered about this! Great explanation.', new Date('2026-01-20T09:00:00Z')),
        createComment(blog9._id, 'merchant_002', 'Sarah Johnson', 'Team burrito all the way! More filling and less messy. 🌯', new Date('2026-01-20T11:30:00Z')),
        createComment(blog9._id, 'merchant_003', 'Mike Chen', 'Tacos are better! You can try different flavors in one meal.', new Date('2026-01-20T13:00:00Z')),
        createComment(blog9._id, merchantId, 'Test Merchant', 'Both have their place! I love tacos for lunch, burritos for dinner.', new Date('2026-01-20T13:30:00Z'), null),
        createComment(blog9._id, 'merchant_004', 'Emily Davis', 'The Mission-style burrito sounds amazing!', new Date('2026-01-20T15:45:00Z')),
        createComment(blog9._id, 'merchant_005', 'Lisa Wong', 'Breakfast burritos are the best invention ever!', new Date('2026-01-21T07:30:00Z')),
        createComment(blog9._id, 'testuserid', 'David Lee', 'Street tacos in Mexico City changed my life. So simple, so good.', new Date('2026-01-21T12:00:00Z')),
    );
}

// Comments for Blog 10: Food Photography
const blog10 = db.blogs.findOne({ slug: 'food-photography-tips-instagram' });
if (blog10) {
    comments.push(
        createComment(blog10._id, 'merchant_seafood', 'Anna Martinez', 'These tips are gold! My Instagram photos look so much better now! 📸', new Date('2026-01-21T08:00:00Z')),
        createComment(blog10._id, 'merchant_coffee', 'Tom Wilson', 'The 45-degree angle tip really works! Thanks!', new Date('2026-01-21T09:30:00Z')),
        createComment(blog10._id, 'merchant_dessert', 'Chris Brown', 'What\'s the best editing app for beginners?', new Date('2026-01-21T10:15:00Z')),
        createComment(blog10._id, 'testuserid', 'Test User', 'Start with Snapseed - it\'s free and very powerful!', new Date('2026-01-21T10:30:00Z'), null),
        createComment(blog10._id, 'testadminid', 'Jessica Taylor', 'Natural light makes such a huge difference! Never using flash again.', new Date('2026-01-21T11:00:00Z')),
        createComment(blog10._id, 'merchant_002', 'Maria Garcia', 'The rule of thirds changed my photography game!', new Date('2026-01-21T12:30:00Z')),
        createComment(blog10._id, 'merchant_003', 'Robert Kim', 'Can you do a tutorial on video editing for food content?', new Date('2026-01-21T13:00:00Z')),
        createComment(blog10._id, 'testuserid', 'Test User', 'Great idea! I\'ll work on a video editing guide next.', new Date('2026-01-21T13:15:00Z'), null),
        createComment(blog10._id, 'merchant_004', 'Nina Patel', 'My restaurant\'s Instagram engagement doubled after following these tips!', new Date('2026-01-21T14:00:00Z')),
        createComment(blog10._id, 'merchant_005', 'Kevin Zhang', 'The overhead shot tip is perfect for bowl dishes!', new Date('2026-01-21T15:30:00Z')),
        createComment(blog10._id, 'testadminid', 'Sophie Anderson', 'Bookmarking this! Will refer back when posting food pics.', new Date('2026-01-21T16:45:00Z')),
        createComment(blog10._id, 'testuserid', 'James Miller', 'Very comprehensive guide! Thank you for sharing your knowledge.', new Date('2026-01-21T18:00:00Z')),
    );
}

// Insert all comments
if (comments.length > 0) {
    db.comments.insertMany(comments);
    print(`Inserted ${comments.length} comments across all blog posts`);
}

print('Blog database seeded successfully with blogs and comments!');
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
