import { FeedbackItem } from '../services/feedback';
import { InquiryItem } from '../services/contact';
import { OfferItem } from '../services/offer';
import { ProductItem } from '../services/product';

export const DEMO_PRODUCTS: ProductItem[] = [
  {
    id: 'royal-gold-necklace',
    name: 'Royal Gold Necklace',
    category: 'Necklaces',
    description:
      'A handcrafted 22K gold necklace with layered detailing for weddings and milestone celebrations.',
    price: 'LKR 185,000',
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
    imageUrl:
      'https://images.unsplash.com/photo-1620656798579-1984d9e87df5?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1620656798579-1984d9e87df5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80',
    ],
    availability: 'In stock',
  },
];

export const DEMO_OFFERS: OfferItem[] = [
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
    description: 'Special pricing when you choose a matching bridal necklace, earrings, and bangles.',
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
];

export const DEMO_FEEDBACK: FeedbackItem[] = [
  {
    id: 'feedback-nethmi',
    customerName: 'Nethmi',
    message: 'Excellent craftsmanship and very professional service. The necklace looked beautiful.',
    rating: 5,
    createdAt: 'May 6, 2026',
  },
  {
    id: 'feedback-ishan',
    customerName: 'Ishan',
    message: 'The design consultation was smooth and personal. I found the perfect gift.',
    rating: 5,
    createdAt: 'May 3, 2026',
  },
  {
    id: 'feedback-amaya',
    customerName: 'Amaya',
    message: 'Beautiful finishing, careful packaging, and quick support from the shop team.',
    rating: 4,
    createdAt: 'April 28, 2026',
  },
];

export const DEMO_INQUIRIES: InquiryItem[] = [
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
];
