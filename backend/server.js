const http = require('node:http');
const { URL } = require('node:url');
const database = require('./database');

const defaultPort = Number(process.env.PORT || process.env.API_PORT || 3000);
const defaultHost = process.env.API_HOST || '127.0.0.1';
const jsonLimitBytes = 10 * 1024 * 1024;
let activeServer = null;
const databaseReady = database.initDatabase().catch((error) => {
  console.warn(`MySQL database unavailable. Falling back to demo memory data. ${error.message}`);
  return false;
});

const state = {
  products: [
    {
      id: 'royal-gold-necklace',
      name: 'Royal Gold Necklace',
      category: 'Necklaces',
      description:
        'A handcrafted 22K gold necklace with layered detailing for weddings and milestone celebrations.',
      price: 'LKR 185,000',
      weight: '34.2 g',
      material: '22K Gold',
      imageUrl:
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=80',
      ],
      availability: 'In stock',
    },
    {
      id: 'diamond-bloom-ring',
      name: 'Diamond Bloom Ring',
      category: 'Rings',
      description:
        'A floral-inspired diamond ring with a refined profile, polished for daily comfort and shine.',
      price: 'LKR 98,000',
      weight: '5.8 g',
      material: '18K Gold, Diamond',
      imageUrl:
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&q=80',
      ],
      availability: 'Available for inquiry',
    },
    {
      id: 'pearl-grace-earrings',
      name: 'Pearl Grace Earrings',
      category: 'Earrings',
      description:
        'Lightweight pearl earrings with a bright finish, designed for formal events and everyday elegance.',
      price: 'LKR 64,500',
      weight: '7.4 g',
      material: 'Pearl, 18K Gold',
      imageUrl:
        'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=1200&q=80',
      ],
      availability: 'In stock',
    },
    {
      id: 'sapphire-tennis-bracelet',
      name: 'Sapphire Tennis Bracelet',
      category: 'Bracelets',
      description:
        'A slim bracelet set with blue sapphire accents and secure clasp detailing for a polished fit.',
      price: 'LKR 142,000',
      weight: '16.5 g',
      material: '18K Gold, Sapphire',
      imageUrl:
        'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=80',
      ],
      availability: 'Limited stock',
    },
    {
      id: 'bridal-radiance-set',
      name: 'Bridal Radiance Set',
      category: 'Bridal Collections',
      description:
        'A complete bridal jewelry set with matching necklace, earrings, and bangles for a coordinated look.',
      price: 'LKR 420,000',
      weight: '86.0 g',
      material: '22K Gold',
      imageUrl:
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      ],
      availability: 'Made to order',
    },
    {
      id: 'rose-gold-bangle',
      name: 'Rose Gold Bangle',
      category: 'Bracelets',
      description:
        'A minimal rose gold bangle with clean lines, crafted for stacking or wearing as a single accent.',
      price: 'LKR 76,000',
      weight: '12.8 g',
      material: 'Rose Gold',
      imageUrl:
        'https://images.unsplash.com/photo-1620656798579-1984d9e87df5?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1620656798579-1984d9e87df5?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80',
      ],
      availability: 'In stock',
    },
  ],
  offers: [
    {
      id: 'festival-gold-week',
      title: 'Festival Gold Week',
      description: 'Reduced making charges on selected gold necklaces, rings, and bangles.',
      discount: '15% off',
      code: 'GOLD15',
      validFrom: 'May 8, 2026',
      validUntil: 'May 31, 2026',
    },
    {
      id: 'bridal-bundle',
      title: 'Bridal Collection Bundle',
      description:
        'Special pricing when you choose a matching bridal necklace, earrings, and bangles.',
      discount: '12% bundle saving',
      code: 'BRIDAL12',
      validFrom: 'May 1, 2026',
      validUntil: 'June 30, 2026',
    },
    {
      id: 'diamond-upgrade',
      title: 'Diamond Ring Upgrade',
      description: 'Trade in an old ring and receive extra value toward a certified diamond ring.',
      discount: 'LKR 25,000 extra value',
      code: 'UPGRADE25',
      validFrom: 'May 8, 2026',
      validUntil: 'May 25, 2026',
    },
  ],
  feedback: [
    {
      id: 'feedback-nethmi',
      customerName: 'Nethmi',
      message: 'Excellent craftsmanship and very professional service. The necklace looked beautiful.',
      rating: 5,
      createdAt: 'May 6, 2026',
      status: 'Approved',
    },
    {
      id: 'feedback-ishan',
      customerName: 'Ishan',
      message: 'The design consultation was smooth and personal. I found the perfect gift.',
      rating: 5,
      createdAt: 'May 3, 2026',
      status: 'Approved',
    },
    {
      id: 'feedback-amaya',
      customerName: 'Amaya',
      message: 'Beautiful finishing, careful packaging, and quick support from the shop team.',
      rating: 4,
      createdAt: 'April 28, 2026',
      status: 'Pending',
    },
  ],
  inquiries: [
    {
      id: 'inquiry-1001',
      customerName: 'Kavindi',
      phone: '+94771234567',
      email: 'kavindi@example.com',
      productId: 'bridal-radiance-set',
      productName: 'Bridal Radiance Set',
      message: 'Please share appointment times for bridal set selection.',
      status: 'New',
      createdAt: 'May 8, 2026',
    },
    {
      id: 'inquiry-1002',
      customerName: 'Ravindu',
      phone: '+94779876543',
      email: 'ravindu@example.com',
      productId: 'diamond-bloom-ring',
      productName: 'Diamond Bloom Ring',
      message: 'I would like to know available ring sizes.',
      status: 'Contacted',
      createdAt: 'May 7, 2026',
    },
  ],
};

function createApiServer(options = {}) {
  const port = Number(options.port || defaultPort);
  const host = options.host || defaultHost;

  return http.createServer(async (request, response) => {
    setCommonHeaders(response);

    if (request.method === 'OPTIONS') {
      response.writeHead(204);
      response.end();
      return;
    }

    try {
      const url = new URL(request.url || '/', `http://${request.headers.host || `${host}:${port}`}`);
      const parts = url.pathname.split('/').filter(Boolean);

      if (parts[0] !== 'api') {
        sendJson(response, 404, { message: 'API route not found.' });
        return;
      }

      if (parts[1] === 'health') {
        sendJson(response, 200, { status: 'ok' });
        return;
      }

      if (parts[1] === 'products') {
        await handleProducts(request, response, parts);
        return;
      }

      if (parts[1] === 'offers') {
        await handleOffers(request, response, parts);
        return;
      }

      if (parts[1] === 'feedback') {
        await handleFeedback(request, response, parts);
        return;
      }

      if (parts[1] === 'inquiries') {
        await handleInquiries(request, response, parts);
        return;
      }

      sendJson(response, 404, { message: 'API route not found.' });
    } catch (error) {
      console.error(error);
      sendJson(response, 500, { message: 'Unexpected API server error.' });
    }
  });
}

function startServer(options = {}) {
  const port = Number(options.port || defaultPort);
  const host = options.host || defaultHost;

  if (activeServer?.listening) {
    return activeServer;
  }

  const server = createApiServer({ host, port });
  activeServer = server;

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && options.allowExisting) {
      activeServer = null;
      console.log(`Using existing API server at http://${host}:${port}/api`);
      return;
    }

    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Stop the other server or set API_PORT.`);
    } else {
      console.error(error);
    }

    if (options.exitOnError !== false) {
      process.exit(1);
    }
  });

  server.listen(port, host, () => {
    console.log(`Local API server running at http://${host}:${port}/api`);
  });

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = {
  createApiServer,
  startServer,
};

async function handleProducts(request, response, parts) {
  if (await isDatabaseReady()) {
    await handleProductsDatabase(request, response, parts);
    return;
  }

  if (request.method === 'GET' && parts.length === 2) {
    sendJson(response, 200, { items: state.products });
    return;
  }

  if (request.method === 'GET' && parts[2] === 'featured' && parts.length === 3) {
    sendJson(response, 200, { items: state.products.slice(0, 3) });
    return;
  }

  if (request.method === 'GET' && parts.length === 3) {
    const product = findById(state.products, parts[2]);
    sendItem(response, product, 'Product not found.');
    return;
  }

  if (request.method === 'POST' && parts.length === 2) {
    const body = await readJsonBody(request);
    const product = toProduct(body);
    state.products.unshift(product);
    sendJson(response, 201, { item: product });
    return;
  }

  if (request.method === 'PUT' && parts.length === 3) {
    const index = findIndexById(state.products, parts[2]);

    if (index < 0) {
      sendJson(response, 404, { message: 'Product not found.' });
      return;
    }

    const body = await readJsonBody(request);
    const product = toProduct({ ...state.products[index], ...body, id: parts[2] });
    state.products[index] = product;
    sendJson(response, 200, { item: product });
    return;
  }

  if (request.method === 'DELETE' && parts.length === 3) {
    deleteById(state.products, parts[2]);
    sendJson(response, 204);
    return;
  }

  sendJson(response, 405, { message: 'Method not allowed for products.' });
}

async function handleOffers(request, response, parts) {
  if (await isDatabaseReady()) {
    await handleOffersDatabase(request, response, parts);
    return;
  }

  if (request.method === 'GET' && parts.length === 2) {
    sendJson(response, 200, { items: state.offers });
    return;
  }

  if (request.method === 'GET' && parts.length === 3) {
    const offer = findById(state.offers, parts[2]);
    sendItem(response, offer, 'Offer not found.');
    return;
  }

  if (request.method === 'POST' && parts.length === 2) {
    const body = await readJsonBody(request);
    const offer = toOffer(body);
    state.offers.unshift(offer);
    sendJson(response, 201, { item: offer });
    return;
  }

  if (request.method === 'PUT' && parts.length === 3) {
    const index = findIndexById(state.offers, parts[2]);

    if (index < 0) {
      sendJson(response, 404, { message: 'Offer not found.' });
      return;
    }

    const body = await readJsonBody(request);
    const offer = toOffer({ ...state.offers[index], ...body, id: parts[2] });
    state.offers[index] = offer;
    sendJson(response, 200, { item: offer });
    return;
  }

  if (request.method === 'DELETE' && parts.length === 3) {
    deleteById(state.offers, parts[2]);
    sendJson(response, 204);
    return;
  }

  sendJson(response, 405, { message: 'Method not allowed for offers.' });
}

async function handleFeedback(request, response, parts) {
  if (await isDatabaseReady()) {
    await handleFeedbackDatabase(request, response, parts);
    return;
  }

  if (request.method === 'GET' && parts.length === 2) {
    sendJson(response, 200, { items: state.feedback });
    return;
  }

  if (request.method === 'POST' && parts.length === 2) {
    const body = await readJsonBody(request);
    const feedback = toFeedback(body);
    state.feedback.unshift(feedback);
    sendJson(response, 201, { feedback });
    return;
  }

  if (request.method === 'PATCH' && parts.length === 4 && parts[3] === 'status') {
    const index = findIndexById(state.feedback, parts[2]);

    if (index < 0) {
      sendJson(response, 404, { message: 'Feedback not found.' });
      return;
    }

    const body = await readJsonBody(request);
    state.feedback[index] = {
      ...state.feedback[index],
      status: toFeedbackStatus(body.status),
    };
    sendJson(response, 200, { feedback: state.feedback[index] });
    return;
  }

  if (request.method === 'DELETE' && parts.length === 3) {
    deleteById(state.feedback, parts[2]);
    sendJson(response, 204);
    return;
  }

  sendJson(response, 405, { message: 'Method not allowed for feedback.' });
}

async function handleInquiries(request, response, parts) {
  if (await isDatabaseReady()) {
    await handleInquiriesDatabase(request, response, parts);
    return;
  }

  if (request.method === 'GET' && parts.length === 2) {
    sendJson(response, 200, { items: state.inquiries });
    return;
  }

  if (request.method === 'POST' && parts.length === 2) {
    const body = await readJsonBody(request);
    const inquiry = toInquiry(body);
    state.inquiries.unshift(inquiry);
    sendJson(response, 201, { inquiry });
    return;
  }

  if (request.method === 'PATCH' && parts.length === 4 && parts[3] === 'status') {
    const index = findIndexById(state.inquiries, parts[2]);

    if (index < 0) {
      sendJson(response, 404, { message: 'Inquiry not found.' });
      return;
    }

    const body = await readJsonBody(request);
    state.inquiries[index] = {
      ...state.inquiries[index],
      status: toText(body.status, state.inquiries[index].status),
    };
    sendJson(response, 200, { inquiry: state.inquiries[index] });
    return;
  }

  if (request.method === 'DELETE' && parts.length === 3) {
    deleteById(state.inquiries, parts[2]);
    sendJson(response, 204);
    return;
  }

  sendJson(response, 405, { message: 'Method not allowed for inquiries.' });
}

async function handleProductsDatabase(request, response, parts) {
  if (request.method === 'GET' && parts.length === 2) {
    sendJson(response, 200, { items: await database.getProducts() });
    return;
  }

  if (request.method === 'GET' && parts[2] === 'featured' && parts.length === 3) {
    sendJson(response, 200, { items: await database.getFeaturedProducts() });
    return;
  }

  if (request.method === 'GET' && parts.length === 3) {
    const product = await database.getProductById(decodeURIComponent(parts[2]));
    sendItem(response, product, 'Product not found.');
    return;
  }

  if (request.method === 'POST' && parts.length === 2) {
    const product = toProduct(await readJsonBody(request));
    sendJson(response, 201, { item: await database.createProduct(product) });
    return;
  }

  if (request.method === 'PUT' && parts.length === 3) {
    const id = decodeURIComponent(parts[2]);
    const product = toProduct({ ...(await readJsonBody(request)), id });
    const updatedProduct = await database.updateProduct(id, product);
    sendItem(response, updatedProduct, 'Product not found.');
    return;
  }

  if (request.method === 'DELETE' && parts.length === 3) {
    await database.deleteProduct(decodeURIComponent(parts[2]));
    sendJson(response, 204);
    return;
  }

  sendJson(response, 405, { message: 'Method not allowed for products.' });
}

async function handleOffersDatabase(request, response, parts) {
  if (request.method === 'GET' && parts.length === 2) {
    sendJson(response, 200, { items: await database.getOffers() });
    return;
  }

  if (request.method === 'GET' && parts.length === 3) {
    const offer = await database.getOfferById(decodeURIComponent(parts[2]));
    sendItem(response, offer, 'Offer not found.');
    return;
  }

  if (request.method === 'POST' && parts.length === 2) {
    const offer = toOffer(await readJsonBody(request));
    sendJson(response, 201, { item: await database.createOffer(offer) });
    return;
  }

  if (request.method === 'PUT' && parts.length === 3) {
    const id = decodeURIComponent(parts[2]);
    const offer = toOffer({ ...(await readJsonBody(request)), id });
    const updatedOffer = await database.updateOffer(id, offer);
    sendItem(response, updatedOffer, 'Offer not found.');
    return;
  }

  if (request.method === 'DELETE' && parts.length === 3) {
    await database.deleteOffer(decodeURIComponent(parts[2]));
    sendJson(response, 204);
    return;
  }

  sendJson(response, 405, { message: 'Method not allowed for offers.' });
}

async function handleFeedbackDatabase(request, response, parts) {
  if (request.method === 'GET' && parts.length === 2) {
    sendJson(response, 200, { items: await database.getFeedback() });
    return;
  }

  if (request.method === 'POST' && parts.length === 2) {
    const feedback = toFeedback(await readJsonBody(request));
    sendJson(response, 201, { feedback: await database.createFeedback(feedback) });
    return;
  }

  if (request.method === 'PATCH' && parts.length === 4 && parts[3] === 'status') {
    const body = await readJsonBody(request);
    const feedback = await database.updateFeedbackStatus(
      decodeURIComponent(parts[2]),
      toFeedbackStatus(body.status)
    );

    if (!feedback) {
      sendJson(response, 404, { message: 'Feedback not found.' });
      return;
    }

    sendJson(response, 200, { feedback });
    return;
  }

  if (request.method === 'DELETE' && parts.length === 3) {
    await database.deleteFeedback(decodeURIComponent(parts[2]));
    sendJson(response, 204);
    return;
  }

  sendJson(response, 405, { message: 'Method not allowed for feedback.' });
}

async function handleInquiriesDatabase(request, response, parts) {
  if (request.method === 'GET' && parts.length === 2) {
    sendJson(response, 200, { items: await database.getInquiries() });
    return;
  }

  if (request.method === 'POST' && parts.length === 2) {
    const inquiry = toInquiry(await readJsonBody(request));
    sendJson(response, 201, { inquiry: await database.createInquiry(inquiry) });
    return;
  }

  if (request.method === 'PATCH' && parts.length === 4 && parts[3] === 'status') {
    const body = await readJsonBody(request);
    const inquiry = await database.updateInquiryStatus(
      decodeURIComponent(parts[2]),
      toText(body.status, 'New')
    );

    if (!inquiry) {
      sendJson(response, 404, { message: 'Inquiry not found.' });
      return;
    }

    sendJson(response, 200, { inquiry });
    return;
  }

  if (request.method === 'DELETE' && parts.length === 3) {
    await database.deleteInquiry(decodeURIComponent(parts[2]));
    sendJson(response, 204);
    return;
  }

  sendJson(response, 405, { message: 'Method not allowed for inquiries.' });
}

async function isDatabaseReady() {
  return (await databaseReady) === true;
}

function toProduct(value) {
  const row = isObject(value) ? value : {};
  const name = toText(row.name, 'Unnamed Jewelry');
  const imageUrl = toNullableText(row.imageUrl) || toNullableText(row.image);
  const images = toStringArray(row.images).length > 0 ? toStringArray(row.images) : [];

  return {
    id: toText(row.id, uniqueSlug(state.products, name || 'jewelry-item')),
    name,
    category: toText(row.category, 'Jewelry'),
    description: toText(row.description, ''),
    price: toText(row.price, ''),
    weight: toText(row.weight, 'By inquiry'),
    material: toText(row.material, 'Gold'),
    imageUrl,
    images: images.length > 0 ? images : imageUrl ? [imageUrl] : [],
    availability: toText(row.availability, 'Available for inquiry'),
  };
}

function toOffer(value) {
  const row = isObject(value) ? value : {};
  const title = toText(row.title, 'Jewelry Offer');

  return {
    id: toText(row.id, uniqueSlug(state.offers, title)),
    title,
    description: toText(row.description, 'Special jewelry discount.'),
    discount: toText(row.discount, 'Special saving'),
    code: toText(row.code, 'VISITSHOP').toUpperCase(),
    validFrom: toText(row.validFrom, 'Available now'),
    validUntil: toText(row.validUntil, 'While stocks last'),
  };
}

function toFeedback(value) {
  const row = isObject(value) ? value : {};
  const customerName = toText(row.customerName || row.name, 'Customer');

  return {
    id: toText(row.id, uniqueSlug(state.feedback, `feedback-${customerName}`)),
    customerName,
    message: toText(row.message || row.feedback, ''),
    rating: toRating(row.rating),
    createdAt: toText(row.createdAt || row.date, 'Just now'),
    status: toFeedbackStatus(row.status || 'Pending'),
  };
}

function toInquiry(value) {
  const row = isObject(value) ? value : {};

  return {
    id: toText(row.id, `inquiry-${Date.now()}`),
    customerName: toText(row.customerName || row.name, 'Customer'),
    phone: toText(row.phone, ''),
    email: toText(row.email, ''),
    productId: toText(row.productId, 'general'),
    productName: toText(row.productName || row.product, 'General inquiry'),
    message: toText(row.message, ''),
    status: toText(row.status, 'New'),
    createdAt: toText(row.createdAt || row.date, 'Just now'),
  };
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;

      if (Buffer.byteLength(body) > jsonLimitBytes) {
        reject(new Error('Request body is too large.'));
        request.destroy();
      }
    });

    request.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON request body.'));
      }
    });

    request.on('error', reject);
  });
}

function sendItem(response, item, notFoundMessage) {
  if (!item) {
    sendJson(response, 404, { message: notFoundMessage });
    return;
  }

  sendJson(response, 200, { item });
}

function sendJson(response, statusCode, value) {
  if (statusCode === 204) {
    response.writeHead(204);
    response.end();
    return;
  }

  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(value));
}

function setCommonHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

function findById(items, id) {
  return items.find((item) => item.id === decodeURIComponent(id));
}

function findIndexById(items, id) {
  return items.findIndex((item) => item.id === decodeURIComponent(id));
}

function deleteById(items, id) {
  const index = findIndexById(items, id);

  if (index >= 0) {
    items.splice(index, 1);
  }
}

function uniqueSlug(items, value) {
  const base = slugify(value) || `item-${Date.now()}`;
  let next = base;
  let counter = 2;

  while (items.some((item) => item.id === next)) {
    next = `${base}-${counter}`;
    counter += 1;
  }

  return next;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function toText(value, fallback) {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
}

function toNullableText(value) {
  return toText(value, null);
}

function toStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => toNullableText(item)).filter(Boolean);
}

function toRating(value) {
  const rating = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(rating)) {
    return 5;
  }

  return Math.min(5, Math.max(1, Math.round(rating)));
}

function toFeedbackStatus(value) {
  const status = toText(value, 'Pending').toLowerCase();

  if (status === 'approved') {
    return 'Approved';
  }

  if (status === 'rejected') {
    return 'Rejected';
  }

  return 'Pending';
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
