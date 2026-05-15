CREATE DATABASE IF NOT EXISTS `rtx_jewelry`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `rtx_jewelry`;

CREATE TABLE IF NOT EXISTS `products` (
  `id` varchar(120) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(120) NOT NULL DEFAULT 'Jewelry',
  `description` text NOT NULL,
  `price` varchar(80) NOT NULL DEFAULT '',
  `weight` varchar(80) NOT NULL DEFAULT '',
  `material` varchar(120) NOT NULL DEFAULT '',
  `image_url` mediumtext NULL,
  `images` longtext NULL,
  `availability` varchar(120) NOT NULL DEFAULT 'Available for inquiry',
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `offers` (
  `id` varchar(120) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `discount` varchar(120) NOT NULL DEFAULT '',
  `code` varchar(80) NOT NULL DEFAULT '',
  `valid_from` varchar(120) NOT NULL DEFAULT '',
  `valid_until` varchar(120) NOT NULL DEFAULT '',
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `feedback` (
  `id` varchar(120) NOT NULL,
  `customer_name` varchar(160) NOT NULL,
  `message` text NOT NULL,
  `rating` tinyint unsigned NOT NULL DEFAULT 5,
  `created_at_text` varchar(120) NOT NULL DEFAULT 'Recently',
  `status` varchar(40) NOT NULL DEFAULT 'Pending',
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` varchar(120) NOT NULL,
  `customer_name` varchar(160) NOT NULL,
  `phone` varchar(40) NOT NULL DEFAULT '',
  `email` varchar(180) NOT NULL DEFAULT '',
  `product_id` varchar(120) NOT NULL DEFAULT 'general',
  `product_name` varchar(255) NOT NULL DEFAULT 'General inquiry',
  `message` text NOT NULL,
  `status` varchar(80) NOT NULL DEFAULT 'New',
  `created_at_text` varchar(120) NOT NULL DEFAULT 'Recently',
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `products`
  (`id`, `name`, `category`, `description`, `price`, `weight`, `material`, `image_url`, `images`, `availability`, `sort_order`)
VALUES
  (
    'royal-gold-necklace',
    'Royal Gold Necklace',
    'Necklaces',
    'A handcrafted 22K gold necklace with layered detailing for weddings and milestone celebrations.',
    'LKR 185,000',
    '34.2 g',
    '22K Gold',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=80"]',
    'In stock',
    1
  ),
  (
    'diamond-bloom-ring',
    'Diamond Bloom Ring',
    'Rings',
    'A floral-inspired diamond ring with a refined profile, polished for daily comfort and shine.',
    'LKR 98,000',
    '5.8 g',
    '18K Gold, Diamond',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&q=80"]',
    'Available for inquiry',
    2
  ),
  (
    'pearl-grace-earrings',
    'Pearl Grace Earrings',
    'Earrings',
    'Lightweight pearl earrings with a bright finish, designed for formal events and everyday elegance.',
    'LKR 64,500',
    '7.4 g',
    'Pearl, 18K Gold',
    'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=1200&q=80"]',
    'In stock',
    3
  ),
  (
    'sapphire-tennis-bracelet',
    'Sapphire Tennis Bracelet',
    'Bracelets',
    'A slim bracelet set with blue sapphire accents and secure clasp detailing for a polished fit.',
    'LKR 142,000',
    '16.5 g',
    '18K Gold, Sapphire',
    'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1619119069152-a2b331eb392a?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=80"]',
    'Limited stock',
    4
  ),
  (
    'bridal-radiance-set',
    'Bridal Radiance Set',
    'Bridal Collections',
    'A complete bridal jewelry set with matching necklace, earrings, and bangles for a coordinated look.',
    'LKR 420,000',
    '86.0 g',
    '22K Gold',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80"]',
    'Made to order',
    5
  ),
  (
    'rose-gold-bangle',
    'Rose Gold Bangle',
    'Bracelets',
    'A minimal rose gold bangle with clean lines, crafted for stacking or wearing as a single accent.',
    'LKR 76,000',
    '12.8 g',
    'Rose Gold',
    'https://images.unsplash.com/photo-1620656798579-1984d9e87df5?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1620656798579-1984d9e87df5?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80"]',
    'In stock',
    6
  );

INSERT IGNORE INTO `offers`
  (`id`, `title`, `description`, `discount`, `code`, `valid_from`, `valid_until`, `sort_order`)
VALUES
  ('festival-gold-week', 'Festival Gold Week', 'Reduced making charges on selected gold necklaces, rings, and bangles.', '15% off', 'GOLD15', 'May 8, 2026', 'May 31, 2026', 1),
  ('bridal-bundle', 'Bridal Collection Bundle', 'Special pricing when you choose a matching bridal necklace, earrings, and bangles.', '12% bundle saving', 'BRIDAL12', 'May 1, 2026', 'June 30, 2026', 2),
  ('diamond-upgrade', 'Diamond Ring Upgrade', 'Trade in an old ring and receive extra value toward a certified diamond ring.', 'LKR 25,000 extra value', 'UPGRADE25', 'May 8, 2026', 'May 25, 2026', 3);

INSERT IGNORE INTO `feedback`
  (`id`, `customer_name`, `message`, `rating`, `created_at_text`, `status`, `sort_order`)
VALUES
  ('feedback-nethmi', 'Nethmi', 'Excellent craftsmanship and very professional service. The necklace looked beautiful.', 5, 'May 6, 2026', 'Approved', 1),
  ('feedback-ishan', 'Ishan', 'The design consultation was smooth and personal. I found the perfect gift.', 5, 'May 3, 2026', 'Approved', 2),
  ('feedback-amaya', 'Amaya', 'Beautiful finishing, careful packaging, and quick support from the shop team.', 4, 'April 28, 2026', 'Pending', 3);

INSERT IGNORE INTO `inquiries`
  (`id`, `customer_name`, `phone`, `email`, `product_id`, `product_name`, `message`, `status`, `created_at_text`, `sort_order`)
VALUES
  ('inquiry-1001', 'Kavindi', '+94771234567', 'kavindi@example.com', 'bridal-radiance-set', 'Bridal Radiance Set', 'Please share appointment times for bridal set selection.', 'New', 'May 8, 2026', 1),
  ('inquiry-1002', 'Ravindu', '+94779876543', 'ravindu@example.com', 'diamond-bloom-ring', 'Diamond Bloom Ring', 'I would like to know available ring sizes.', 'Contacted', 'May 7, 2026', 2);
