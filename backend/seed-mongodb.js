// ============================================
// MONGODB SEED DATA FOR RESTAURANT PROJECT
// Run with mongosh or MongoDB Compass
// ============================================

// ===========================================
// ORDER DATABASE
// ===========================================
db = db.getSiblingDB('order_db');

// Drop old data
db.orders.drop();
db.carts.drop();
db.grouporders.drop();

// ORDERS
db.orders.insertMany([
    {
        _id: ObjectId(),
        orderId: "ORD-20260107-001",
        slug: "ord-20260107-001",
        userId: "testuserid",
        restaurantId: "RES001",
        restaurantName: "Pho Ha Noi",
        items: [
            {
                productId: "PROD001",
                productName: "Pho Bo Tai",
                sizeId: "L",
                sizeName: "Lon",
                quantity: 2,
                price: 55000,
                subtotal: 110000
            },
            {
                productId: "PROD003",
                productName: "Pho Ga",
                sizeId: "M",
                sizeName: "Vua",
                quantity: 1,
                price: 40000,
                subtotal: 40000
            }
        ],
        totalAmount: 150000,
        shippingFee: 15000,
        grandTotal: 165000,
        deliveryAddress: {
            location: "123 Ly Thuong Kiet, Q10, TP.HCM",
            longitude: 106.660172,
            latitude: 10.770833
        },
        paymentMethod: "card",
        paymentStatus: "completed",
        status: "delivered",
        note: "It rau, them hanh",
        createdAt: new Date("2026-01-05T10:30:00Z"),
        updatedAt: new Date("2026-01-05T11:15:00Z"),
        deliveredAt: new Date("2026-01-05T11:15:00Z")
    },
    {
        _id: ObjectId(),
        orderId: "ORD-20260107-002",
        slug: "ord-20260107-002",
        userId: "user_gen_01",
        restaurantId: "RES002",
        restaurantName: "Bun Cha Obama",
        items: [
            {
                productId: "PROD004",
                productName: "Bun Cha Dac Biet",
                sizeId: "L",
                sizeName: "Lon",
                quantity: 1,
                price: 65000,
                subtotal: 65000
            },
            {
                productId: "PROD006",
                productName: "Nem Ran",
                sizeId: "M",
                sizeName: "Vua",
                quantity: 2,
                price: 30000,
                subtotal: 60000
            }
        ],
        totalAmount: 125000,
        shippingFee: 20000,
        grandTotal: 145000,
        deliveryAddress: {
            location: "456 Nguyen Dinh Chieu, Q3, TP.HCM",
            longitude: 106.686389,
            latitude: 10.779444
        },
        paymentMethod: "cash",
        paymentStatus: "completed",
        status: "delivered",
        note: "",
        createdAt: new Date("2026-01-06T12:00:00Z"),
        updatedAt: new Date("2026-01-06T12:45:00Z"),
        deliveredAt: new Date("2026-01-06T12:45:00Z")
    },
    {
        _id: ObjectId(),
        orderId: "ORD-20260107-003",
        slug: "ord-20260107-003",
        userId: "user_gen_02",
        restaurantId: "RES003",
        restaurantName: "Pizza Hut Express",
        items: [
            {
                productId: "PROD007",
                productName: "Pizza Pepperoni",
                sizeId: "L",
                sizeName: "Lon",
                quantity: 1,
                price: 220000,
                subtotal: 220000
            }
        ],
        totalAmount: 220000,
        shippingFee: 25000,
        grandTotal: 245000,
        deliveryAddress: {
            location: "789 Dien Bien Phu, Binh Thanh, TP.HCM",
            longitude: 106.710556,
            latitude: 10.801667
        },
        paymentMethod: "card",
        paymentStatus: "pending",
        status: "preparing",
        note: "Extra cheese",
        createdAt: new Date("2026-01-07T09:00:00Z"),
        updatedAt: new Date("2026-01-07T09:15:00Z")
    },
    {
        _id: ObjectId(),
        orderId: "ORD-20260107-004",
        slug: "ord-20260107-004",
        userId: "testuserid",
        restaurantId: "RES005",
        restaurantName: "Sushi Tokyo",
        items: [
            {
                productId: "PROD013",
                productName: "Sushi Ca Hoi",
                sizeId: "L",
                sizeName: "Lon",
                quantity: 2,
                price: 180000,
                subtotal: 360000
            },
            {
                productId: "PROD014",
                productName: "Sashimi Tong Hop",
                sizeId: "M",
                sizeName: "Vua",
                quantity: 1,
                price: 250000,
                subtotal: 250000
            }
        ],
        totalAmount: 610000,
        shippingFee: 30000,
        grandTotal: 640000,
        deliveryAddress: {
            location: "123 Ly Thuong Kiet, Q10, TP.HCM",
            longitude: 106.660172,
            latitude: 10.770833
        },
        paymentMethod: "wallet",
        paymentStatus: "pending",
        status: "pending",
        note: "Giao gio an trua",
        createdAt: new Date("2026-01-07T10:30:00Z"),
        updatedAt: new Date("2026-01-07T10:30:00Z")
    }
]);

// CARTS
db.carts.insertMany([
    {
        _id: ObjectId(),
        userId: "user_gen_03",
        restaurants: [
            {
                restaurantId: "RES006",
                restaurantName: "Tra Sua Gong Cha",
                items: [
                    {
                        productId: "PROD016",
                        productName: "Tra Sua Truyen Thong",
                        sizeId: "L",
                        sizeName: "Lon",
                        quantity: 2,
                        price: 45000,
                        subtotal: 90000
                    },
                    {
                        productId: "PROD017",
                        productName: "Tra Dao Cam Sa",
                        sizeId: "M",
                        sizeName: "Vua",
                        quantity: 1,
                        price: 40000,
                        subtotal: 40000
                    }
                ],
                subtotal: 130000
            }
        ],
        totalAmount: 130000,
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        userId: "user_gen_04",
        restaurants: [
            {
                restaurantId: "RES007",
                restaurantName: "Com Tam Sai Gon",
                items: [
                    {
                        productId: "PROD019",
                        productName: "Com Tam Suon Bi Cha",
                        sizeId: "L",
                        sizeName: "Lon",
                        quantity: 1,
                        price: 60000,
                        subtotal: 60000
                    }
                ],
                subtotal: 60000
            },
            {
                restaurantId: "RES008",
                restaurantName: "Banh Mi Huynh Hoa",
                items: [
                    {
                        productId: "PROD021",
                        productName: "Banh Mi Dac Biet",
                        sizeId: "M",
                        sizeName: "Vua",
                        quantity: 2,
                        price: 45000,
                        subtotal: 90000
                    }
                ],
                subtotal: 90000
            }
        ],
        totalAmount: 150000,
        updatedAt: new Date()
    }
]);

print("Order database seeded successfully!");

// ===========================================
// BLOG DATABASE
// ===========================================
db = db.getSiblingDB('blog_db');

// Drop old data
db.blogs.drop();
db.comments.drop();

// BLOGS
db.blogs.insertMany([
    {
        _id: ObjectId(),
        title: "Top 10 Quan Pho Ngon Nhat Sai Gon",
        slug: "top-10-quan-pho-ngon-nhat-sai-gon",
        content: "# Top 10 Quan Pho Ngon Nhat Sai Gon 2026\n\nPho la mon an khong the thieu trong am thuc Viet Nam. Hom nay chung ta se cung kham pha 10 quan pho ngon nhat Sai Gon!\n\n## 1. Pho Ha Noi - Nguyen Hue\nNuoc dung dam da, thit bo tuoi ngon. Day la dia chi yeu thich cua nhieu nguoi sanh an.\n\n## 2. Pho Le - Vo Thi Sau\nPho gia truyen hon 30 nam, noi tieng voi nuoc dung trong va ngot thanh.\n\n## 3. Pho Hoa Pasteur\nThuong hieu lau doi, phuc vu tu 6h sang.\n\n*Hay thu va cho chung toi biet y kien cua ban nhe!*",
        excerpt: "Kham pha 10 quan pho ngon nhat Sai Gon 2026, tu pho truyen thong den pho fusion hien dai.",
        coverImage: "https://res.cloudinary.com/demo/image/upload/pho-cover.jpg",
        authorId: "testuserid",
        authorName: "Test User",
        category: "Am thuc",
        tags: ["pho", "sai gon", "am thuc viet", "top 10"],
        views: 1520,
        likes: ["user_gen_01", "user_gen_02", "user_gen_03", "user_gen_04", "user_gen_05"],
        likesCount: 5,
        commentsCount: 3,
        status: "published",
        createdAt: new Date("2026-01-01T08:00:00Z"),
        updatedAt: new Date("2026-01-01T08:00:00Z"),
        publishedAt: new Date("2026-01-01T08:00:00Z")
    },
    {
        _id: ObjectId(),
        title: "Review Sushi Tokyo - Co Dang Tien Khong?",
        slug: "review-sushi-tokyo-co-dang-tien-khong",
        content: "# Review Sushi Tokyo - Co Dang Tien Khong?\n\nHom nay minh se review quan Sushi Tokyo tren duong Hai Ba Trung.\n\n## Khong gian\nQuan trang tri theo phong cach Nhat Ban truyen thong, sach se va thoang mat.\n\n## Chat luong mon an\n- **Sushi ca hoi**: 9/10 - Ca tuoi, tan trong mieng\n- **Sashimi tong hop**: 9.5/10 - Tuyet voi!\n- **Maki roll**: 8/10 - Kha on\n\n## Gia ca\nGia hoi cao nhung xung dang voi chat luong.\n\n## Ket luan\n5/5 - Highly recommended!",
        excerpt: "Review chi tiet quan Sushi Tokyo - tu khong gian, chat luong mon an den gia ca.",
        coverImage: "https://res.cloudinary.com/demo/image/upload/sushi-review.jpg",
        authorId: "user_gen_01",
        authorName: "User 01",
        category: "Review",
        tags: ["sushi", "nhat ban", "review", "hai ba trung"],
        views: 890,
        likes: ["testuserid", "user_gen_02", "user_gen_03"],
        likesCount: 3,
        commentsCount: 2,
        status: "published",
        createdAt: new Date("2026-01-03T14:00:00Z"),
        updatedAt: new Date("2026-01-03T14:00:00Z"),
        publishedAt: new Date("2026-01-03T14:00:00Z")
    },
    {
        _id: ObjectId(),
        title: "Cong Thuc Nau Pho Bo Tai Nha",
        slug: "cong-thuc-nau-pho-bo-tai-nha",
        content: "# Cong Thuc Nau Pho Bo Tai Nha\n\n## Nguyen lieu\n\n### Nuoc dung:\n- 2kg xuong bo\n- 500g thit bo bap\n- 2 cu hanh tay\n- 1 cu gung\n- Hoa hoi, que, thao qua\n\n### Banh pho va rau:\n- 500g banh pho tuoi\n- Rau mui, hanh la, gia do\n\n## Cach lam\n\n1. **Chan xuong**: Dun soi nuoc, cho xuong vao chan 5 phut roi do bo nuoc.\n2. **Nuong hanh gung**: Nuong truc tiep tren bep den khi thom.\n3. **Nau nuoc dung**: Cho xuong, thit, hanh gung va gia vi vao noi. Nau 6-8 tieng.\n4. **Trung banh pho**: Cho banh pho vao nuoc soi 10 giay.\n5. **Hoan thanh**: Xep pho vao to, them thit, rau va chan nuoc dung.\n\nChuc cac ban thanh cong!",
        excerpt: "Huong dan chi tiet cach nau pho bo chuan vi tai nha voi cong thuc gia truyen.",
        coverImage: "https://res.cloudinary.com/demo/image/upload/pho-recipe.jpg",
        authorId: "testmerchantid",
        authorName: "Test Merchant",
        category: "Cong thuc",
        tags: ["pho", "cong thuc", "nau an", "viet nam"],
        views: 2340,
        likes: ["testuserid", "user_gen_01", "user_gen_02", "user_gen_03", "user_gen_04", "user_gen_05", "user_gen_06"],
        likesCount: 7,
        commentsCount: 5,
        status: "published",
        createdAt: new Date("2026-01-05T10:00:00Z"),
        updatedAt: new Date("2026-01-05T10:00:00Z"),
        publishedAt: new Date("2026-01-05T10:00:00Z")
    }
]);

// Get blog IDs for comments
const blogs = db.blogs.find().toArray();

// COMMENTS
db.comments.insertMany([
    {
        _id: ObjectId(),
        blogId: blogs[0]._id,
        content: "Bai viet rat hay! Minh da thu Pho Ha Noi va rat ngon!",
        authorId: "user_gen_01",
        authorName: "User 01",
        likes: ["testuserid", "user_gen_02"],
        likesCount: 2,
        parentId: null,
        createdAt: new Date("2026-01-02T09:00:00Z"),
        updatedAt: new Date("2026-01-02T09:00:00Z")
    },
    {
        _id: ObjectId(),
        blogId: blogs[0]._id,
        content: "Con thieu Pho Thin nha ban!",
        authorId: "user_gen_02",
        authorName: "User 02",
        likes: [],
        likesCount: 0,
        parentId: null,
        createdAt: new Date("2026-01-02T10:30:00Z"),
        updatedAt: new Date("2026-01-02T10:30:00Z")
    },
    {
        _id: ObjectId(),
        blogId: blogs[1]._id,
        content: "Gia bao nhieu vay ban?",
        authorId: "user_gen_03",
        authorName: "User 03",
        likes: [],
        likesCount: 0,
        parentId: null,
        createdAt: new Date("2026-01-04T08:00:00Z"),
        updatedAt: new Date("2026-01-04T08:00:00Z")
    },
    {
        _id: ObjectId(),
        blogId: blogs[2]._id,
        content: "Cam on cong thuc! Minh se thu lam cuoi tuan nay.",
        authorId: "user_gen_04",
        authorName: "User 04",
        likes: ["testmerchantid"],
        likesCount: 1,
        parentId: null,
        createdAt: new Date("2026-01-06T15:00:00Z"),
        updatedAt: new Date("2026-01-06T15:00:00Z")
    },
    {
        _id: ObjectId(),
        blogId: blogs[2]._id,
        content: "Nau bao lau thi duoc a?",
        authorId: "user_gen_05",
        authorName: "User 05",
        likes: [],
        likesCount: 0,
        parentId: null,
        createdAt: new Date("2026-01-06T16:00:00Z"),
        updatedAt: new Date("2026-01-06T16:00:00Z")
    }
]);

print("Blog database seeded successfully!");
print("All MongoDB databases seeded!");
