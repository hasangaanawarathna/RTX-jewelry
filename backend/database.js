const { spawn } = require('node:child_process');
const fs = require('node:fs');
const { readFile } = require('node:fs/promises');
const path = require('node:path');

const dbName = process.env.DB_NAME || 'rtx_jewelry';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || '3306';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const schemaPath = path.join(__dirname, 'schema.sql');
const mysqlBin = resolveMysqlBinary();

let initPromise = null;

function initDatabase() {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    if (!mysqlBin) {
      throw new Error('MySQL client was not found. Set MYSQL_BIN or install XAMPP MySQL.');
    }

    const schema = await readFile(schemaPath, 'utf8');
    await runMysql(schema, { database: false });
    return true;
  })();

  return initPromise;
}

async function getProducts() {
  return normalizeProducts(await queryJson(`
    SELECT JSON_OBJECT(
      'id', id,
      'name', name,
      'category', category,
      'description', description,
      'price', price,
      'weight', weight,
      'material', material,
      'imageUrl', image_url,
      'images', images,
      'availability', availability
    )
    FROM products
    ORDER BY sort_order ASC, created_at DESC
  `));
}

async function getFeaturedProducts() {
  return (await getProducts()).slice(0, 3);
}

async function getProductById(id) {
  const rows = normalizeProducts(await queryJson(`
    SELECT JSON_OBJECT(
      'id', id,
      'name', name,
      'category', category,
      'description', description,
      'price', price,
      'weight', weight,
      'material', material,
      'imageUrl', image_url,
      'images', images,
      'availability', availability
    )
    FROM products
    WHERE id = ${sql(id)}
    LIMIT 1
  `));

  return rows[0] || null;
}

async function createProduct(product) {
  await runMysql(`
    INSERT INTO products
      (id, name, category, description, price, weight, material, image_url, images, availability)
    VALUES
      (${sql(product.id)}, ${sql(product.name)}, ${sql(product.category)}, ${sql(product.description)},
       ${sql(product.price)}, ${sql(product.weight)}, ${sql(product.material)}, ${sql(product.imageUrl)},
       ${sql(JSON.stringify(product.images || []))}, ${sql(product.availability)})
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      category = VALUES(category),
      description = VALUES(description),
      price = VALUES(price),
      weight = VALUES(weight),
      material = VALUES(material),
      image_url = VALUES(image_url),
      images = VALUES(images),
      availability = VALUES(availability)
  `);

  return getProductById(product.id);
}

async function updateProduct(id, product) {
  await runMysql(`
    UPDATE products
    SET
      name = ${sql(product.name)},
      category = ${sql(product.category)},
      description = ${sql(product.description)},
      price = ${sql(product.price)},
      weight = ${sql(product.weight)},
      material = ${sql(product.material)},
      image_url = ${sql(product.imageUrl)},
      images = ${sql(JSON.stringify(product.images || []))},
      availability = ${sql(product.availability)}
    WHERE id = ${sql(id)}
  `);

  return getProductById(id);
}

async function deleteProduct(id) {
  await runMysql(`DELETE FROM products WHERE id = ${sql(id)}`);
}

async function getOffers() {
  return queryJson(`
    SELECT JSON_OBJECT(
      'id', id,
      'title', title,
      'description', description,
      'discount', discount,
      'code', code,
      'validFrom', valid_from,
      'validUntil', valid_until
    )
    FROM offers
    ORDER BY sort_order ASC, created_at DESC
  `);
}

async function getOfferById(id) {
  const rows = await queryJson(`
    SELECT JSON_OBJECT(
      'id', id,
      'title', title,
      'description', description,
      'discount', discount,
      'code', code,
      'validFrom', valid_from,
      'validUntil', valid_until
    )
    FROM offers
    WHERE id = ${sql(id)}
    LIMIT 1
  `);

  return rows[0] || null;
}

async function createOffer(offer) {
  await runMysql(`
    INSERT INTO offers
      (id, title, description, discount, code, valid_from, valid_until)
    VALUES
      (${sql(offer.id)}, ${sql(offer.title)}, ${sql(offer.description)}, ${sql(offer.discount)},
       ${sql(offer.code)}, ${sql(offer.validFrom)}, ${sql(offer.validUntil)})
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      description = VALUES(description),
      discount = VALUES(discount),
      code = VALUES(code),
      valid_from = VALUES(valid_from),
      valid_until = VALUES(valid_until)
  `);

  return getOfferById(offer.id);
}

async function updateOffer(id, offer) {
  await runMysql(`
    UPDATE offers
    SET
      title = ${sql(offer.title)},
      description = ${sql(offer.description)},
      discount = ${sql(offer.discount)},
      code = ${sql(offer.code)},
      valid_from = ${sql(offer.validFrom)},
      valid_until = ${sql(offer.validUntil)}
    WHERE id = ${sql(id)}
  `);

  return getOfferById(id);
}

async function deleteOffer(id) {
  await runMysql(`DELETE FROM offers WHERE id = ${sql(id)}`);
}

async function getFeedback() {
  return queryJson(`
    SELECT JSON_OBJECT(
      'id', id,
      'customerName', customer_name,
      'message', message,
      'rating', rating,
      'createdAt', created_at_text,
      'status', status
    )
    FROM feedback
    ORDER BY sort_order ASC, created_at DESC
  `);
}

async function createFeedback(feedback) {
  await runMysql(`
    INSERT INTO feedback
      (id, customer_name, message, rating, created_at_text, status)
    VALUES
      (${sql(feedback.id)}, ${sql(feedback.customerName)}, ${sql(feedback.message)},
       ${numberSql(feedback.rating)}, ${sql(feedback.createdAt)}, ${sql(feedback.status)})
  `);

  const rows = await queryJson(`
    SELECT JSON_OBJECT(
      'id', id,
      'customerName', customer_name,
      'message', message,
      'rating', rating,
      'createdAt', created_at_text,
      'status', status
    )
    FROM feedback
    WHERE id = ${sql(feedback.id)}
    LIMIT 1
  `);

  return rows[0] || null;
}

async function updateFeedbackStatus(id, status) {
  await runMysql(`UPDATE feedback SET status = ${sql(status)} WHERE id = ${sql(id)}`);
  const rows = await queryJson(`
    SELECT JSON_OBJECT(
      'id', id,
      'customerName', customer_name,
      'message', message,
      'rating', rating,
      'createdAt', created_at_text,
      'status', status
    )
    FROM feedback
    WHERE id = ${sql(id)}
    LIMIT 1
  `);

  return rows[0] || null;
}

async function deleteFeedback(id) {
  await runMysql(`DELETE FROM feedback WHERE id = ${sql(id)}`);
}

async function getInquiries() {
  return queryJson(`
    SELECT JSON_OBJECT(
      'id', id,
      'customerName', customer_name,
      'phone', phone,
      'email', email,
      'productId', product_id,
      'productName', product_name,
      'message', message,
      'status', status,
      'createdAt', created_at_text
    )
    FROM inquiries
    ORDER BY sort_order ASC, created_at DESC
  `);
}

async function createInquiry(inquiry) {
  await runMysql(`
    INSERT INTO inquiries
      (id, customer_name, phone, email, product_id, product_name, message, status, created_at_text)
    VALUES
      (${sql(inquiry.id)}, ${sql(inquiry.customerName)}, ${sql(inquiry.phone)}, ${sql(inquiry.email)},
       ${sql(inquiry.productId)}, ${sql(inquiry.productName)}, ${sql(inquiry.message)},
       ${sql(inquiry.status)}, ${sql(inquiry.createdAt)})
  `);

  const rows = await queryJson(`
    SELECT JSON_OBJECT(
      'id', id,
      'customerName', customer_name,
      'phone', phone,
      'email', email,
      'productId', product_id,
      'productName', product_name,
      'message', message,
      'status', status,
      'createdAt', created_at_text
    )
    FROM inquiries
    WHERE id = ${sql(inquiry.id)}
    LIMIT 1
  `);

  return rows[0] || null;
}

async function updateInquiryStatus(id, status) {
  await runMysql(`UPDATE inquiries SET status = ${sql(status)} WHERE id = ${sql(id)}`);
  const rows = await queryJson(`
    SELECT JSON_OBJECT(
      'id', id,
      'customerName', customer_name,
      'phone', phone,
      'email', email,
      'productId', product_id,
      'productName', product_name,
      'message', message,
      'status', status,
      'createdAt', created_at_text
    )
    FROM inquiries
    WHERE id = ${sql(id)}
    LIMIT 1
  `);

  return rows[0] || null;
}

async function deleteInquiry(id) {
  await runMysql(`DELETE FROM inquiries WHERE id = ${sql(id)}`);
}

async function queryJson(statement) {
  const output = await runMysql(statement);
  const rows = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return rows.map((row) => JSON.parse(row));
}

function runMysql(statement, options = {}) {
  return new Promise((resolve, reject) => {
    const args = [
      '--batch',
      '--raw',
      '--skip-column-names',
      '--default-character-set=utf8mb4',
      '-h',
      dbHost,
      '-P',
      String(dbPort),
      '-u',
      dbUser,
    ];

    if (dbPassword) {
      args.push(`-p${dbPassword}`);
    }

    if (options.database !== false) {
      args.push(dbName);
    }

    const child = spawn(mysqlBin, args, {
      windowsHide: true,
    });
    const stdout = [];
    const stderr = [];

    child.stdout.on('data', (chunk) => stdout.push(chunk));
    child.stderr.on('data', (chunk) => stderr.push(chunk));
    child.on('error', reject);
    child.on('close', (code) => {
      const output = Buffer.concat(stdout).toString('utf8');
      const errorOutput = Buffer.concat(stderr).toString('utf8');

      if (code === 0) {
        resolve(output);
        return;
      }

      reject(new Error(errorOutput || `mysql exited with code ${code}`));
    });

    child.stdin.end(statement);
  });
}

function normalizeProducts(rows) {
  return rows.map((row) => ({
    ...row,
    imageUrl: row.imageUrl || null,
    images: parseImages(row.images),
  }));
}

function parseImages(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function sql(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  return `'${String(value)
    .replace(/\0/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "''")}'`;
}

function numberSql(value) {
  const number = Number(value);
  return Number.isFinite(number) ? String(number) : '0';
}

function resolveMysqlBinary() {
  const candidates = [
    process.env.MYSQL_BIN,
    'C:\\xampp\\mysql\\bin\\mysql.exe',
    'mysql',
  ].filter(Boolean);

  return candidates.find((candidate) => candidate === 'mysql' || fs.existsSync(candidate)) || null;
}

module.exports = {
  initDatabase,
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  getFeedback,
  createFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry,
};
