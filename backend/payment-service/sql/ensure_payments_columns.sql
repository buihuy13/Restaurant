-- Ensure payments table has required columns for Sequelize model
-- Adjust DB_NAME if needed

-- Use your DB
-- USE your_database_name;

ALTER TABLE `payments` 
  ADD COLUMN IF NOT EXISTS `payment_id` VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS `order_id` VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS `user_id` VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS `amount` DECIMAL(10,2) NULL,
  ADD COLUMN IF NOT EXISTS `currency` VARCHAR(3) NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS `payment_method` ENUM('card') NULL DEFAULT 'card',
  ADD COLUMN IF NOT EXISTS `payment_gateway` VARCHAR(50) NULL DEFAULT 'stripe',
  ADD COLUMN IF NOT EXISTS `transaction_id` VARCHAR(200) NULL,
  ADD COLUMN IF NOT EXISTS `status` ENUM('pending','processing','completed','failed','refunded') NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS `failure_reason` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `refund_amount` DECIMAL(10,2) NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `refund_reason` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `refund_transaction_id` VARCHAR(200) NULL,
  ADD COLUMN IF NOT EXISTS `metadata` JSON NULL,
  ADD COLUMN IF NOT EXISTS `processed_at` DATETIME NULL,
  ADD COLUMN IF NOT EXISTS `refunded_at` DATETIME NULL,
  ADD COLUMN IF NOT EXISTS `created_at` DATETIME NULL,
  ADD COLUMN IF NOT EXISTS `updated_at` DATETIME NULL;

-- Create indexes if not exist
CREATE INDEX IF NOT EXISTS `payments_order_id` ON `payments` (`order_id`);
CREATE INDEX IF NOT EXISTS `payments_user_id` ON `payments` (`user_id`);
CREATE INDEX IF NOT EXISTS `payments_status` ON `payments` (`status`);
CREATE INDEX IF NOT EXISTS `payments_created_at` ON `payments` (`created_at`);

-- Add unique constraint for payment_id
ALTER TABLE `payments` 
  ADD UNIQUE INDEX IF NOT EXISTS `payments_payment_id_unique` (`payment_id`);
