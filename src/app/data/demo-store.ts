import { FeedbackItem } from '../services/feedback';
import { InquiryItem } from '../services/contact';
import { OfferItem } from '../services/offer';
import { ProductItem } from '../services/product';

export const DEMO_PRODUCTS: ProductItem[] = [
  {
    id: 'royal-gold-necklace',
    name: 'Kandyan Gold Necklace',
    category: 'Necklaces',
    description:
      'A handcrafted 22K gold necklace with layered detailing for poruwa ceremonies, homecomings, and milestone celebrations.',
    price: 'LKR 1,185,000',
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
    name: 'Ceylon Sapphire Diamond Ring',
    category: 'Rings',
    description:
      'A Ceylon blue sapphire centre stone with small diamond accents, set in 18K gold for engagements and anniversary gifts.',
    price: 'LKR 385,000',
    weight: '6.2 g',
    material: '18K Gold, Ceylon Sapphire, Diamond',
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
    name: 'Pearl Temple Earrings',
    category: 'Earrings',
    description:
      'Freshwater pearl drop earrings with 18K gold hooks, light enough for office wear, weddings, and temple visits.',
    price: 'LKR 92,000',
    weight: '7.1 g',
    material: 'Freshwater Pearl, 18K Gold',
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
    name: 'Ceylon Sapphire Bracelet',
    category: 'Bracelets',
    description:
      'A slim bracelet set with blue Ceylon sapphire accents and secure clasp detailing for a polished fit.',
    price: 'LKR 425,000',
    weight: '16.5 g',
    material: '18K Gold, Ceylon Sapphire',
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
    name: 'Kandyan Bridal Radiance Set',
    category: 'Bridal Collections',
    description:
      'A complete 22K gold bridal jewelry set with matching necklace, earrings, bangles, and hair pins for a coordinated Kandyan look.',
    price: 'LKR 3,250,000',
    weight: '96.4 g',
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
    name: 'Avurudu Gold Bangle',
    category: 'Bracelets',
    description:
      'A solid 22K gold bangle with soft traditional engraving, sized for everyday wear and Sinhala and Tamil New Year gifting.',
    price: 'LKR 475,000',
    weight: '15.8 g',
    material: '22K Gold',
    imageUrl:
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80',
    ],
    availability: 'In stock',
  },
];

export const DEMO_OFFERS: OfferItem[] = [
  {
    id: 'festival-gold-week',
    title: 'Vesak Making Charge Offer',
    description:
      'Lower making charges on selected 22K gold bangles, chains, and pendants for in-store purchases.',
    discount: '10% off making charges',
    code: 'VESAK10',
    validFrom: 'May 25, 2026',
    validUntil: 'June 8, 2026',
  },
  {
    id: 'bridal-bundle',
    title: 'Kandyan Bridal Package',
    description:
      'Book a bridal set consultation and receive bundle pricing on matching necklace, earrings, bangles, and hair pins.',
    discount: 'LKR 75,000 bundle saving',
    code: 'BRIDE75',
    validFrom: 'May 25, 2026',
    validUntil: 'July 31, 2026',
  },
  {
    id: 'diamond-upgrade',
    title: 'Ceylon Sapphire Certificate Gift',
    description:
      'Selected sapphire rings include gemstone certification and complimentary resizing within 14 days.',
    discount: 'Free certification',
    code: 'SAPPHIRELK',
    validFrom: 'May 25, 2026',
    validUntil: 'June 30, 2026',
  },
];

export const DEMO_FEEDBACK: FeedbackItem[] = [
  {
    id: 'feedback-nethmi',
    customerName: 'Nethmi Perera',
    message:
      'The Kandyan bridal set looked elegant for my poruwa ceremony, and the team adjusted the fit before the homecoming.',
    rating: 5,
    createdAt: 'May 22, 2026',
    status: 'Approved',
  },
  {
    id: 'feedback-ishan',
    customerName: 'Dinuka Jayasinghe',
    message: 'They explained the sapphire quality clearly and helped me choose a ring within my budget.',
    rating: 5,
    createdAt: 'May 18, 2026',
    status: 'Approved',
  },
  {
    id: 'feedback-amaya',
    customerName: 'Amaya Fernando',
    message: 'Quick WhatsApp updates, careful packaging, and the bangle size was correct when it arrived in Galle.',
    rating: 4,
    createdAt: 'May 12, 2026',
    status: 'Pending',
  },
];

export const DEMO_INQUIRIES: InquiryItem[] = [
  {
    id: 'inquiry-1001',
    customerName: 'Tharushi Silva',
    phone: '+94712345678',
    email: 'tharushi.silva@example.lk',
    productId: 'bridal-radiance-set',
    productName: 'Kandyan Bridal Radiance Set',
    message: 'Can I book a weekend appointment in Colombo for a Kandyan bridal set fitting?',
    status: 'New',
    createdAt: 'May 24, 2026',
  },
  {
    id: 'inquiry-1002',
    customerName: 'Malith Fernando',
    phone: '+94773456789',
    email: 'malith.fernando@example.lk',
    productId: 'diamond-bloom-ring',
    productName: 'Ceylon Sapphire Diamond Ring',
    message: 'Please share available Ceylon sapphire stone sizes and whether certification is included.',
    status: 'Contacted',
    createdAt: 'May 23, 2026',
  },
];
