-- ============================================
-- CHAT SERVICE
-- ============================================
USE `chat-service`;

INSERT INTO chat_rooms (id, user1_id, user2_id, last_message) VALUES
('ROOM001', 'testuserid', 'testmerchantid', 'Xin chao, toi muon dat mon'),
('ROOM002', 'user_gen_01', 'testmerchantid', 'Nha hang con mo cua khong?');

INSERT INTO messages (id, sender_id, receiver_id, content, room_id, `is_read`) VALUES
('MSG001', 'testuserid', 'testmerchantid', 'Xin chao, toi muon dat mon', 'ROOM001', true),
('MSG002', 'testmerchantid', 'testuserid', 'Da chao anh/chi, anh/chi muon dat mon gi a?', 'ROOM001', true),
('MSG003', 'testuserid', 'testmerchantid', 'Cho toi 1 phan Pho Bo Tai size L', 'ROOM001', false),
('MSG004', 'user_gen_01', 'testmerchantid', 'Nha hang con mo cua khong?', 'ROOM002', true),
('MSG005', 'testmerchantid', 'user_gen_01', 'Da nha hang mo cua den 22h a', 'ROOM002', false);
