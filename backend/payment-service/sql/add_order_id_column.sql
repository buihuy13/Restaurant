-- Add missing order_id column and index to payments table
-- WARNING: replace `your_database_name` with the actual payments database name if needed.

-- If you know the DB name, you can add: USE your_database_name;

ALTER TABLE `payments` ADD COLUMN IF NOT EXISTS `order_id` VARCHAR(100) NULL;
ALTER TABLE `payments` ADD INDEX `payments_order_id` (`order_id`);

-- Optionally set NOT NULL if you can provide defaults for existing rows:
-- ALTER TABLE `payments` MODIFY COLUMN `order_id` VARCHAR(100) NOT NULL;
