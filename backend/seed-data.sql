-- ============================================
-- CHAT SERVICE
-- ============================================
USE `chat-service`;

INSERT INTO chat_rooms (id, user1_id, user2_id, last_message) VALUES
('ROOM001', 'testuserid', 'testmerchantid', 'Hello, I would like to order food'),
('ROOM002', 'user_gen_01', 'testmerchantid', 'Is the restaurant still open?'),
('ROOM003', 'user_gen_02', 'testmerchantid', 'The food was delicious! Thank you!'),
('ROOM004', 'user_gen_03', 'testmerchantid', 'Can I get a refund for my order?'),
('ROOM005', 'user_gen_04', 'testmerchantid', 'Do you have vegetarian options?');

INSERT INTO messages (id, sender_id, receiver_id, content, room_id, `is_read`) VALUES
('MSG001', 'testuserid', 'testmerchantid', 'Hello, I would like to order food', 'ROOM001', true),
('MSG002', 'testmerchantid', 'testuserid', 'Hello! What would you like to order?', 'ROOM001', true),
('MSG003', 'testuserid', 'testmerchantid', 'I would like 1 Classic Burger size L', 'ROOM001', false),
('MSG004', 'user_gen_01', 'testmerchantid', 'Is the restaurant still open?', 'ROOM002', true),
('MSG005', 'testmerchantid', 'user_gen_01', 'Yes, we are open until 10 PM', 'ROOM002', false),
('MSG006', 'user_gen_02', 'testmerchantid', 'The food was delicious! Thank you!', 'ROOM003', true),
('MSG007', 'testmerchantid', 'user_gen_02', 'Thank you for your kind words! We hope to see you again soon!', 'ROOM003', true),
('MSG008', 'user_gen_03', 'testmerchantid', 'My order arrived cold. Can I get a refund?', 'ROOM004', true),
('MSG009', 'testmerchantid', 'user_gen_03', 'We sincerely apologize. We will process a full refund immediately.', 'ROOM004', true),
('MSG010', 'user_gen_03', 'testmerchantid', 'Can I get a refund for my order?', 'ROOM004', false),
('MSG011', 'user_gen_04', 'testmerchantid', 'Do you have vegetarian options?', 'ROOM005', true),
('MSG012', 'testmerchantid', 'user_gen_04', 'Yes! We have Margherita Pizza, French Fries, and Cheese Balls.', 'ROOM005', true),
('MSG013', 'user_gen_04', 'testmerchantid', 'Great! I will order the pizza and cheese balls.', 'ROOM005', false),
('MSG014', 'testuserid', 'testmerchantid', 'How long will delivery take?', 'ROOM001', true),
('MSG015', 'testmerchantid', 'testuserid', 'Approximately 30-40 minutes', 'ROOM001', false);
