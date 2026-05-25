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
    'Kandyan Gold Necklace',
    'Necklaces',
    'A handcrafted 22K gold necklace with layered detailing for poruwa ceremonies, homecomings, and milestone celebrations.',
    'LKR 1,185,000',
    '34.2 g',
    '22K Gold',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=80"]',
    'In stock',
    1
  ),
  (
    'diamond-bloom-ring',
    'Ceylon Sapphire Diamond Ring',
    'Rings',
    'A Ceylon blue sapphire centre stone with small diamond accents, set in 18K gold for engagements and anniversary gifts.',
    'LKR 385,000',
    '6.2 g',
    '18K Gold, Ceylon Sapphire, Diamond',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&q=80"]',
    'Available for inquiry',
    2
  ),
  (
    'pearl-grace-earrings',
    'Pearl Temple Earrings',
    'Earrings',
    'Freshwater pearl drop earrings with 18K gold hooks, light enough for office wear, weddings, and temple visits.',
    'LKR 92,000',
    '7.1 g',
    'Freshwater Pearl, 18K Gold',
    'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=1200&q=80"]',
    'In stock',
    3
  ),
  (
    'sapphire-tennis-bracelet',
    'Ceylon Sapphire Bracelet',
    'Bracelets',
    'A slim bracelet set with blue Ceylon sapphire accents and secure clasp detailing for a polished fit.',
    'LKR 425,000',
    '16.5 g',
    '18K Gold, Ceylon Sapphire',
    'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1619119069152-a2b331eb392a?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=80"]',
    'Limited stock',
    4
  ),
  (
    'bridal-radiance-set',
    'Kandyan Bridal Radiance Set',
    'Bridal Collections',
    'A complete 22K gold bridal jewelry set with matching necklace, earrings, bangles, and hair pins for a coordinated Kandyan look.',
    'LKR 3,250,000',
    '96.4 g',
    '22K Gold',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80"]',
    'Made to order',
    5
  ),
  (
    'rose-gold-bangle',
    'Avurudu Gold Bangle',
    'Bracelets',
    'A solid 22K gold bangle with soft traditional engraving, sized for everyday wear and Sinhala and Tamil New Year gifting.',
    'LKR 475,000',
    '15.8 g',
    '22K Gold',
    'https://images.unsplash.com/photo-1620656798579-1984d9e87df5?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1620656798579-1984d9e87df5?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80"]',
    'In stock',
    6
  );

UPDATE `products`
SET
  `name` = 'Kandyan Gold Necklace',
  `description` = 'A handcrafted 22K gold necklace with layered detailing for poruwa ceremonies, homecomings, and milestone celebrations.',
  `price` = 'LKR 1,185,000',
  `weight` = '34.2 g',
  `material` = '22K Gold',
  `availability` = 'In stock'
WHERE `id` = 'royal-gold-necklace'
  AND `name` = 'Royal Gold Necklace'
  AND `description` = 'A handcrafted 22K gold necklace with layered detailing for weddings and milestone celebrations.';

UPDATE `products`
SET
  `name` = 'Ceylon Sapphire Diamond Ring',
  `description` = 'A Ceylon blue sapphire centre stone with small diamond accents, set in 18K gold for engagements and anniversary gifts.',
  `price` = 'LKR 385,000',
  `weight` = '6.2 g',
  `material` = '18K Gold, Ceylon Sapphire, Diamond',
  `availability` = 'Available for inquiry'
WHERE `id` = 'diamond-bloom-ring'
  AND `name` = 'Diamond Bloom Ring'
  AND `description` = 'A floral-inspired diamond ring with a refined profile, polished for daily comfort and shine.';

UPDATE `products`
SET
  `name` = 'Pearl Temple Earrings',
  `description` = 'Freshwater pearl drop earrings with 18K gold hooks, light enough for office wear, weddings, and temple visits.',
  `price` = 'LKR 92,000',
  `weight` = '7.1 g',
  `material` = 'Freshwater Pearl, 18K Gold',
  `availability` = 'In stock'
WHERE `id` = 'pearl-grace-earrings'
  AND `name` = 'Pearl Grace Earrings'
  AND `description` = 'Lightweight pearl earrings with a bright finish, designed for formal events and everyday elegance.';

UPDATE `products`
SET
  `name` = 'Ceylon Sapphire Bracelet',
  `description` = 'A slim bracelet set with blue Ceylon sapphire accents and secure clasp detailing for a polished fit.',
  `price` = 'LKR 425,000',
  `weight` = '16.5 g',
  `material` = '18K Gold, Ceylon Sapphire',
  `availability` = 'Limited stock'
WHERE `id` = 'sapphire-tennis-bracelet'
  AND `name` = 'Sapphire Tennis Bracelet'
  AND `description` = 'A slim bracelet set with blue sapphire accents and secure clasp detailing for a polished fit.';

UPDATE `products`
SET
  `name` = 'Kandyan Bridal Radiance Set',
  `description` = 'A complete 22K gold bridal jewelry set with matching necklace, earrings, bangles, and hair pins for a coordinated Kandyan look.',
  `price` = 'LKR 3,250,000',
  `weight` = '96.4 g',
  `material` = '22K Gold',
  `availability` = 'Made to order'
WHERE `id` = 'bridal-radiance-set'
  AND `name` = 'Bridal Radiance Set'
  AND `description` = 'A complete bridal jewelry set with matching necklace, earrings, and bangles for a coordinated look.';

UPDATE `products`
SET
  `name` = 'Avurudu Gold Bangle',
  `description` = 'A solid 22K gold bangle with soft traditional engraving, sized for everyday wear and Sinhala and Tamil New Year gifting.',
  `price` = 'LKR 475,000',
  `weight` = '15.8 g',
  `material` = '22K Gold',
  `availability` = 'In stock'
WHERE `id` = 'rose-gold-bangle'
  AND `name` = 'Rose Gold Bangle'
  AND `description` = 'A minimal rose gold bangle with clean lines, crafted for stacking or wearing as a single accent.';

INSERT IGNORE INTO `offers`
  (`id`, `title`, `description`, `discount`, `code`, `valid_from`, `valid_until`, `sort_order`)
VALUES
  ('festival-gold-week', 'Vesak Making Charge Offer', 'Lower making charges on selected 22K gold bangles, chains, and pendants for in-store purchases.', '10% off making charges', 'VESAK10', 'May 25, 2026', 'June 8, 2026', 1),
  ('bridal-bundle', 'Kandyan Bridal Package', 'Book a bridal set consultation and receive bundle pricing on matching necklace, earrings, bangles, and hair pins.', 'LKR 75,000 bundle saving', 'BRIDE75', 'May 25, 2026', 'July 31, 2026', 2),
  ('diamond-upgrade', 'Ceylon Sapphire Certificate Gift', 'Selected sapphire rings include gemstone certification and complimentary resizing within 14 days.', 'Free certification', 'SAPPHIRELK', 'May 25, 2026', 'June 30, 2026', 3);

UPDATE `offers`
SET
  `title` = 'Vesak Making Charge Offer',
  `description` = 'Lower making charges on selected 22K gold bangles, chains, and pendants for in-store purchases.',
  `discount` = '10% off making charges',
  `code` = 'VESAK10',
  `valid_from` = 'May 25, 2026',
  `valid_until` = 'June 8, 2026'
WHERE `id` = 'festival-gold-week'
  AND `title` = 'Festival Gold Week'
  AND `description` = 'Reduced making charges on selected gold necklaces, rings, and bangles.';

UPDATE `offers`
SET
  `title` = 'Kandyan Bridal Package',
  `description` = 'Book a bridal set consultation and receive bundle pricing on matching necklace, earrings, bangles, and hair pins.',
  `discount` = 'LKR 75,000 bundle saving',
  `code` = 'BRIDE75',
  `valid_from` = 'May 25, 2026',
  `valid_until` = 'July 31, 2026'
WHERE `id` = 'bridal-bundle'
  AND `title` = 'Bridal Collection Bundle'
  AND `description` = 'Special pricing when you choose a matching bridal necklace, earrings, and bangles.';

UPDATE `offers`
SET
  `title` = 'Ceylon Sapphire Certificate Gift',
  `description` = 'Selected sapphire rings include gemstone certification and complimentary resizing within 14 days.',
  `discount` = 'Free certification',
  `code` = 'SAPPHIRELK',
  `valid_from` = 'May 25, 2026',
  `valid_until` = 'June 30, 2026'
WHERE `id` = 'diamond-upgrade'
  AND `title` = 'Diamond Ring Upgrade'
  AND `description` = 'Trade in an old ring and receive extra value toward a certified diamond ring.';

INSERT IGNORE INTO `feedback`
  (`id`, `customer_name`, `message`, `rating`, `created_at_text`, `status`, `sort_order`)
VALUES
  ('feedback-nethmi', 'Nethmi Perera', 'The Kandyan bridal set looked elegant for my poruwa ceremony, and the team adjusted the fit before the homecoming.', 5, 'May 22, 2026', 'Approved', 1),
  ('feedback-ishan', 'Dinuka Jayasinghe', 'They explained the sapphire quality clearly and helped me choose a ring within my budget.', 5, 'May 18, 2026', 'Approved', 2),
  ('feedback-amaya', 'Amaya Fernando', 'Quick WhatsApp updates, careful packaging, and the bangle size was correct when it arrived in Galle.', 4, 'May 12, 2026', 'Pending', 3);

UPDATE `feedback`
SET
  `customer_name` = 'Nethmi Perera',
  `message` = 'The Kandyan bridal set looked elegant for my poruwa ceremony, and the team adjusted the fit before the homecoming.',
  `rating` = 5,
  `created_at_text` = 'May 22, 2026',
  `status` = 'Approved'
WHERE `id` = 'feedback-nethmi'
  AND `customer_name` = 'Nethmi'
  AND `message` = 'Excellent craftsmanship and very professional service. The necklace looked beautiful.';

UPDATE `feedback`
SET
  `customer_name` = 'Dinuka Jayasinghe',
  `message` = 'They explained the sapphire quality clearly and helped me choose a ring within my budget.',
  `rating` = 5,
  `created_at_text` = 'May 18, 2026',
  `status` = 'Approved'
WHERE `id` = 'feedback-ishan'
  AND `customer_name` = 'Ishan'
  AND `message` = 'The design consultation was smooth and personal. I found the perfect gift.';

UPDATE `feedback`
SET
  `customer_name` = 'Amaya Fernando',
  `message` = 'Quick WhatsApp updates, careful packaging, and the bangle size was correct when it arrived in Galle.',
  `rating` = 4,
  `created_at_text` = 'May 12, 2026',
  `status` = 'Pending'
WHERE `id` = 'feedback-amaya'
  AND `customer_name` = 'Amaya'
  AND `message` = 'Beautiful finishing, careful packaging, and quick support from the shop team.';

INSERT IGNORE INTO `inquiries`
  (`id`, `customer_name`, `phone`, `email`, `product_id`, `product_name`, `message`, `status`, `created_at_text`, `sort_order`)
VALUES
  ('inquiry-1001', 'Tharushi Silva', '+94712345678', 'tharushi.silva@example.lk', 'bridal-radiance-set', 'Kandyan Bridal Radiance Set', 'Can I book a weekend appointment in Colombo for a Kandyan bridal set fitting?', 'New', 'May 24, 2026', 1),
  ('inquiry-1002', 'Malith Fernando', '+94773456789', 'malith.fernando@example.lk', 'diamond-bloom-ring', 'Ceylon Sapphire Diamond Ring', 'Please share available Ceylon sapphire stone sizes and whether certification is included.', 'Contacted', 'May 23, 2026', 2);

UPDATE `inquiries`
SET
  `customer_name` = 'Tharushi Silva',
  `phone` = '+94712345678',
  `email` = 'tharushi.silva@example.lk',
  `product_id` = 'bridal-radiance-set',
  `product_name` = 'Kandyan Bridal Radiance Set',
  `message` = 'Can I book a weekend appointment in Colombo for a Kandyan bridal set fitting?',
  `status` = 'New',
  `created_at_text` = 'May 24, 2026'
WHERE `id` = 'inquiry-1001'
  AND `customer_name` = 'Kavindi'
  AND `message` = 'Please share appointment times for bridal set selection.';

UPDATE `inquiries`
SET
  `customer_name` = 'Malith Fernando',
  `phone` = '+94773456789',
  `email` = 'malith.fernando@example.lk',
  `product_id` = 'diamond-bloom-ring',
  `product_name` = 'Ceylon Sapphire Diamond Ring',
  `message` = 'Please share available Ceylon sapphire stone sizes and whether certification is included.',
  `status` = 'Contacted',
  `created_at_text` = 'May 23, 2026'
WHERE `id` = 'inquiry-1002'
  AND `customer_name` = 'Ravindu'
  AND `message` = 'I would like to know available ring sizes.';
