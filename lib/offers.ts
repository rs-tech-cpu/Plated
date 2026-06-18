export interface Offer {
  id: number;
  restaurant: string;
  title: string;
  description: string;
  discount: string;
  imageUrl: string;
  category: string;
  validUntil: string;
}

export const MOCK_OFFERS: Offer[] = [
  {
    id: 1,
    restaurant: 'Bella Napoli',
    title: 'Free Dessert with Any Main',
    description:
      'Treat yourself to a complimentary dessert when you order any main course. Choose from our classic tiramisu, panna cotta, or seasonal gelato. Dine-in only. Valid for tables of up to 8.',
    discount: 'FREE DESSERT',
    imageUrl:
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=300&fit=crop',
    category: 'Italian',
    validUntil: '2026-07-31',
  },
  {
    id: 2,
    restaurant: 'Green Bowl',
    title: '20% Off Your Entire Bill',
    description:
      'Enjoy 20% off your entire bill at Green Bowl. Perfect for a healthy lunch or dinner. Valid Monday to Friday, 12pm–5pm. Cannot be combined with other offers or loyalty points.',
    discount: '20% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop',
    category: 'Healthy',
    validUntil: '2026-07-15',
  },
  {
    id: 3,
    restaurant: 'Sakura Sushi',
    title: 'Buy 1 Get 1 Free on Rolls',
    description:
      'Order any maki roll and get another of equal or lesser value completely free. Choose from our extensive menu of 30+ rolls. Valid for dine-in only. Does not apply to omakase sets.',
    discount: 'BOGO',
    imageUrl:
      'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=300&h=300&fit=crop',
    category: 'Japanese',
    validUntil: '2026-08-01',
  },
  {
    id: 4,
    restaurant: 'The Smokehouse',
    title: 'Free Fries with Any Burger',
    description:
      'Add a free regular portion of our signature smoked fries to any burger order. Upgrade to sweet potato fries for £1.50. Valid all day, every day while this offer lasts.',
    discount: 'FREE FRIES',
    imageUrl:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop',
    category: 'American',
    validUntil: '2026-07-20',
  },
  {
    id: 5,
    restaurant: 'Café Bloom',
    title: 'Loyalty Coffee — 5th Cup Free',
    description:
      'Every fifth coffee at Café Bloom is on us. Tap your NFC tag each visit to track your progress. Applies to any hot drink including specialty lattes and matcha.',
    discount: '5TH FREE',
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
    category: 'Café',
    validUntil: '2026-09-30',
  },
];
