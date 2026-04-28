export const mockInventory = [
  {
    id: '1',
    name: 'Whole Milk',
    quantity: 1,
    unit: 'L',
    category: 'Dairy',
    expiryDays: 1,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&h=150&fit=crop',
    dateAdded: '2026-04-25T10:00:00.000Z'
  },
  {
    id: '2',
    name: 'Chicken Breast',
    quantity: 400,
    unit: 'g',
    category: 'Meat',
    expiryDays: 2,
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=150&h=150&fit=crop',
    dateAdded: '2026-04-26T12:00:00.000Z'
  },
  {
    id: '3',
    name: 'Strawberries',
    quantity: 250,
    unit: 'g',
    category: 'Fruit',
    expiryDays: 2,
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=150&h=150&fit=crop',
    dateAdded: '2026-04-26T14:30:00.000Z'
  },
  {
    id: '4',
    name: 'Eggs',
    quantity: 6,
    unit: 'pcs',
    category: 'Others',
    expiryDays: 3,
    imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=150&h=150&fit=crop',
    dateAdded: '2026-04-20T08:15:00.000Z'
  },
  {
    id: '5',
    name: 'Spinach',
    quantity: 200,
    unit: 'g',
    category: 'Vegetables',
    expiryDays: 4,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=150&h=150&fit=crop',
    dateAdded: '2026-04-27T16:45:00.000Z'
  },
  {
    id: '6',
    name: 'Cheddar Cheese',
    quantity: 150,
    unit: 'g',
    category: 'Dairy',
    expiryDays: 5,
    imageUrl: 'https://images.unsplash.com/photo-1618164422027-5bff69eb6862?w=150&h=150&fit=crop',
    dateAdded: '2026-04-15T09:20:00.000Z'
  },
  {
    id: '7',
    name: 'Bell Peppers',
    quantity: 3,
    unit: 'pcs',
    category: 'Vegetables',
    expiryDays: 6,
    imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=150&h=150&fit=crop',
    dateAdded: '2026-04-28T08:00:00.000Z'
  },
  {
    id: '8',
    name: 'Greek Yogurt',
    quantity: 260,
    unit: 'g',
    category: 'Dairy',
    expiryDays: 7,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=150&h=150&fit=crop',
    dateAdded: '2026-04-24T11:10:00.000Z'
  },
  {
    id: '9',
    name: 'Pasta',
    quantity: 300,
    unit: 'g',
    category: 'Others',
    expiryDays: 180,
    imageUrl: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=150&h=150&fit=crop',
    dateAdded: '2026-01-10T10:00:00.000Z'
  }
];

export const mockRecipes = [
  {
    id: 'r1',
    title: 'Pasta Carbonara',
    time: '25 min',
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=200&fit=crop',
    ingredients: ['Eggs', 'Pasta', 'Cheddar Cheese', 'Whole Milk'],
    instructions: [
      'Boil pasta until al dente.',
      'Whisk eggs with cheese.',
      'Combine hot pasta with egg mixture off heat.',
      'Season and serve immediately.'
    ]
  },
  {
    id: 'r2',
    title: 'Cheese Omelette',
    time: '10 min',
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1510693062568-d018bb041dc5?w=400&h=200&fit=crop',
    ingredients: ['Eggs', 'Cheddar Cheese', 'Whole Milk'],
    instructions: [
      'Beat the eggs with a splash of milk.',
      'Pour into a heated, oiled pan.',
      'Add cheese to one half and fold over.',
      'Cook for another minute until cheese melts.'
    ]
  },
  {
    id: 'r3',
    title: 'Veggie Stir Fry',
    time: '15 min',
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop',
    ingredients: ['Bell Peppers', 'Spinach', 'Chicken Breast'],
    instructions: [
      'Slice chicken and bell peppers into strips.',
      'Stir fry chicken until cooked through.',
      'Add bell peppers and cook for 3 minutes.',
      'Toss in spinach until lightly wilted and serve.'
    ]
  },
  {
    id: 'r4',
    title: 'Greek Salad',
    time: '10 min',
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=200&fit=crop',
    ingredients: ['Bell Peppers', 'Spinach', 'Greek Yogurt'],
    instructions: [
      'Chop bell peppers into bite-sized pieces.',
      'In a bowl, mix spinach and bell peppers.',
      'Top with a dollop of greek yogurt as a healthy dressing.'
    ]
  }
];
