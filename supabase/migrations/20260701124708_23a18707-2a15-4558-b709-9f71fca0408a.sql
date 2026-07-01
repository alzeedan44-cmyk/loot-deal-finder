
-- Products (12 real trending SKUs)
INSERT INTO public.products (title, slug, category, brand, image_url, emoji, mrp) VALUES
('Apple AirPods 4 (ANC)', 'apple-airpods-4-anc', 'Electronics', 'Apple', NULL, '🎧', 17900),
('Samsung Galaxy S24 5G (256GB)', 'samsung-galaxy-s24-256', 'Electronics', 'Samsung', NULL, '📱', 79999),
('boAt Xtend Smartwatch', 'boat-xtend-smartwatch', 'Electronics', 'boAt', NULL, '⌚', 7999),
('Sony WH-1000XM5 Headphones', 'sony-wh-1000xm5', 'Electronics', 'Sony', NULL, '🎧', 34990),
('Levi''s 511 Slim Jeans', 'levis-511-slim-jeans', 'Fashion', 'Levi''s', NULL, '👖', 3499),
('Nike Air Max SC Sneakers', 'nike-air-max-sc', 'Fashion', 'Nike', NULL, '👟', 6495),
('H&M Oversized Cotton Tee', 'hm-oversized-cotton-tee', 'Fashion', 'H&M', NULL, '👕', 999),
('Lakmé 9 to 5 Primer + Matte Lipstick', 'lakme-9to5-lipstick', 'Beauty', 'Lakmé', NULL, '💄', 725),
('The Ordinary Niacinamide 10% Serum', 'ordinary-niacinamide-serum', 'Beauty', 'The Ordinary', NULL, '🧴', 750),
('Mamaearth Onion Hair Oil 250ml', 'mamaearth-onion-hair-oil', 'Beauty', 'Mamaearth', NULL, '🧴', 599),
('Prestige Deluxe Alpha 5L Pressure Cooker', 'prestige-deluxe-alpha-5l', 'Home', 'Prestige', NULL, '🍲', 2695),
('Milton Thermosteel Flip Lid 1L', 'milton-thermosteel-1l', 'Home', 'Milton', NULL, '🥤', 1345);

-- Offers: for each product create 3-4 merchant rows with varied prices
INSERT INTO public.offers (product_id, merchant_slug, price, raw_url, rating, ratings_count, eta) 
SELECT p.id, m.merchant_slug, m.price, m.url, m.rating, m.rc, m.eta
FROM public.products p
JOIN LATERAL (VALUES
  ('amazon',   'https://www.amazon.in/dp/B0DGHYDZSC', 12999, 4.4, 8421, 'Tomorrow'),
  ('flipkart', 'https://www.flipkart.com/apple-airpods-4-anc/p/itm', 13499, 4.5, 5123, '2 days'),
  ('tatacliq', 'https://www.tatacliq.com/apple-airpods-4/p-mp000000024', 13899, 4.3, 812, '3 days')
) AS m(merchant_slug, url, price, rating, rc, eta) ON p.slug = 'apple-airpods-4-anc'
UNION ALL SELECT p.id, m.merchant_slug, m.price, m.url, m.rating, m.rc, m.eta FROM public.products p
JOIN LATERAL (VALUES
  ('amazon',   'https://www.amazon.in/dp/B0CS6HXJPD', 64999, 4.5, 12034, 'Tomorrow'),
  ('flipkart', 'https://www.flipkart.com/samsung-galaxy-s24-5g/p/itm', 63999, 4.6, 9210, 'Tomorrow'),
  ('tatacliq', 'https://www.tatacliq.com/samsung-galaxy-s24/p-mp000000025', 66499, 4.4, 402, '3 days')
) AS m(merchant_slug, url, price, rating, rc, eta) ON p.slug = 'samsung-galaxy-s24-256'
UNION ALL SELECT p.id, m.merchant_slug, m.price, m.url, m.rating, m.rc, m.eta FROM public.products p
JOIN LATERAL (VALUES
  ('amazon',   'https://www.amazon.in/dp/B0CTHVDN2P', 2199, 4.1, 15211, '2 days'),
  ('flipkart', 'https://www.flipkart.com/boat-xtend-smartwatch/p/itm', 1999, 4.2, 22014, 'Tomorrow')
) AS m(merchant_slug, url, price, rating, rc, eta) ON p.slug = 'boat-xtend-smartwatch'
UNION ALL SELECT p.id, m.merchant_slug, m.price, m.url, m.rating, m.rc, m.eta FROM public.products p
JOIN LATERAL (VALUES
  ('amazon',   'https://www.amazon.in/dp/B09XS7JWHH', 26990, 4.6, 6120, 'Tomorrow'),
  ('flipkart', 'https://www.flipkart.com/sony-wh-1000xm5/p/itm', 27490, 4.7, 4321, '2 days'),
  ('tatacliq', 'https://www.tatacliq.com/sony-wh-1000xm5/p-mp000000026', 28490, 4.5, 210, '3 days')
) AS m(merchant_slug, url, price, rating, rc, eta) ON p.slug = 'sony-wh-1000xm5'
UNION ALL SELECT p.id, m.merchant_slug, m.price, m.url, m.rating, m.rc, m.eta FROM public.products p
JOIN LATERAL (VALUES
  ('myntra',   'https://www.myntra.com/jeans/levis/levis-511-slim/1234567/buy', 1749, 4.3, 12042, '3 days'),
  ('ajio',     'https://www.ajio.com/levis-511-slim-jeans/p/469123001', 1699, 4.2, 3210, '4 days'),
  ('flipkart', 'https://www.flipkart.com/levis-511-slim-jeans/p/itm', 1799, 4.3, 5210, '2 days')
) AS m(merchant_slug, url, price, rating, rc, eta) ON p.slug = 'levis-511-slim-jeans'
UNION ALL SELECT p.id, m.merchant_slug, m.price, m.url, m.rating, m.rc, m.eta FROM public.products p
JOIN LATERAL (VALUES
  ('myntra',   'https://www.myntra.com/sneakers/nike/nike-air-max-sc/2345678/buy', 4796, 4.4, 8412, '3 days'),
  ('ajio',     'https://www.ajio.com/nike-air-max-sc/p/469777001', 4646, 4.3, 2201, '4 days'),
  ('amazon',   'https://www.amazon.in/dp/B08NXVJDXZ', 4995, 4.4, 3421, '2 days')
) AS m(merchant_slug, url, price, rating, rc, eta) ON p.slug = 'nike-air-max-sc'
UNION ALL SELECT p.id, m.merchant_slug, m.price, m.url, m.rating, m.rc, m.eta FROM public.products p
JOIN LATERAL (VALUES
  ('myntra',   'https://www.myntra.com/tshirts/hm/hm-oversized-cotton-tee/3456789/buy', 599, 4.1, 4102, '3 days'),
  ('ajio',     'https://www.ajio.com/hm-oversized-cotton-tee/p/469233001', 549, 4.0, 1520, '4 days')
) AS m(merchant_slug, url, price, rating, rc, eta) ON p.slug = 'hm-oversized-cotton-tee'
UNION ALL SELECT p.id, m.merchant_slug, m.price, m.url, m.rating, m.rc, m.eta FROM public.products p
JOIN LATERAL (VALUES
  ('nykaa',    'https://www.nykaa.com/lakme-9-to-5-primer-matte-lipstick/p/12345', 615, 4.5, 22103, '3 days'),
  ('amazon',   'https://www.amazon.in/dp/B07LGX8YVT', 649, 4.4, 15421, '2 days'),
  ('flipkart', 'https://www.flipkart.com/lakme-9to5-lipstick/p/itm', 645, 4.4, 12042, '3 days')
) AS m(merchant_slug, url, price, rating, rc, eta) ON p.slug = 'lakme-9to5-lipstick'
UNION ALL SELECT p.id, m.merchant_slug, m.price, m.url, m.rating, m.rc, m.eta FROM public.products p
JOIN LATERAL (VALUES
  ('nykaa',    'https://www.nykaa.com/the-ordinary-niacinamide-10-serum/p/54321', 690, 4.4, 9803, '3 days'),
  ('amazon',   'https://www.amazon.in/dp/B07VZBB3F1', 720, 4.5, 6512, '2 days')
) AS m(merchant_slug, url, price, rating, rc, eta) ON p.slug = 'ordinary-niacinamide-serum'
UNION ALL SELECT p.id, m.merchant_slug, m.price, m.url, m.rating, m.rc, m.eta FROM public.products p
JOIN LATERAL (VALUES
  ('nykaa',    'https://www.nykaa.com/mamaearth-onion-hair-oil-250ml/p/98765', 449, 4.3, 30122, '3 days'),
  ('amazon',   'https://www.amazon.in/dp/B08J7C4L9K', 469, 4.2, 45011, '2 days'),
  ('flipkart', 'https://www.flipkart.com/mamaearth-onion-hair-oil/p/itm', 479, 4.3, 28401, '2 days')
) AS m(merchant_slug, url, price, rating, rc, eta) ON p.slug = 'mamaearth-onion-hair-oil'
UNION ALL SELECT p.id, m.merchant_slug, m.price, m.url, m.rating, m.rc, m.eta FROM public.products p
JOIN LATERAL (VALUES
  ('amazon',   'https://www.amazon.in/dp/B00LFRZQ1I', 1749, 4.4, 21123, '2 days'),
  ('flipkart', 'https://www.flipkart.com/prestige-deluxe-alpha-5l/p/itm', 1699, 4.5, 15412, '3 days'),
  ('tatacliq', 'https://www.tatacliq.com/prestige-deluxe-alpha-5l/p-mp000000027', 1799, 4.4, 1203, '4 days')
) AS m(merchant_slug, url, price, rating, rc, eta) ON p.slug = 'prestige-deluxe-alpha-5l'
UNION ALL SELECT p.id, m.merchant_slug, m.price, m.url, m.rating, m.rc, m.eta FROM public.products p
JOIN LATERAL (VALUES
  ('amazon',   'https://www.amazon.in/dp/B07J4M5J2K', 999, 4.5, 42123, '2 days'),
  ('flipkart', 'https://www.flipkart.com/milton-thermosteel-1l/p/itm', 989, 4.6, 32041, '2 days'),
  ('tatacliq', 'https://www.tatacliq.com/milton-thermosteel-1l/p-mp000000028', 1049, 4.4, 811, '3 days')
) AS m(merchant_slug, url, price, rating, rc, eta) ON p.slug = 'milton-thermosteel-1l';

-- Seed the price history with current prices (one snapshot)
INSERT INTO public.price_history (product_id, merchant_slug, price)
SELECT product_id, merchant_slug, price FROM public.offers;

-- Coupons
INSERT INTO public.coupons (merchant_slug, code, title, description, discount_text, category, verified, expires_at) VALUES
('amazon',   'PRIMEDAY24', 'Prime Day Extra 10% Off',   'On SBI/HDFC credit cards, above ₹5,000',        '10% instant',       'Electronics', true, now() + interval '30 days'),
('flipkart', 'BBDSAVE500', 'Big Billion ₹500 Off',      'On orders above ₹4,999, all categories',        '₹500 OFF',          'Electronics', true, now() + interval '20 days'),
('myntra',   'EORS40',     'End of Reason 40% Extra',   'Extra 40% off on already discounted fashion',    'Extra 40%',        'Fashion',     true, now() + interval '15 days'),
('nykaa',    'GLOW20',     'Nykaa Glow 20%',            '20% off on new users, beauty essentials',        '20% off',          'Beauty',      true, now() + interval '45 days'),
('ajio',     'AJIOKART300','₹300 Off on ₹1,499+',       'Applicable on Ajio branded fashion',              '₹300 OFF',         'Fashion',     true, now() + interval '25 days'),
('tatacliq', 'CLIQ15',     'Tata CLiQ Flat 15%',        'Flat 15% off on home & kitchen appliances',      '15% off',          'Home',        true, now() + interval '30 days');
