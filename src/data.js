export const mockInventory = [
  {
    id: '1',
    name: 'Whole Milk',
    quantity: 1000,
    unit: 'g',
    category: 'Dairy',
    expiryDays: 1,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&h=150&fit=crop',
    dateAdded: '2026-04-25T10:00:00.000Z'
  },
  {
    id: '2',
    name: 'Chicken',
    quantity: 400,
    unit: 'g',
    category: 'Meat',
    expiryDays: 5,
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=150&h=150&fit=crop',
    dateAdded: '2026-04-26T12:00:00.000Z',
    batches: [
      {
        id: '2_badge_1',
        dateAdded: '2026-04-26T12:00:00.000Z',
        quantity: 100,
        originalQuantity: 100,
        expiryDays: 4,
        note: 'wing'
      },
      {
        id: '2_badge_2',
        dateAdded: '2026-04-26T12:00:00.000Z',
        quantity: 300,
        originalQuantity: 300,
        expiryDays: 5,
        note: 'breast'
      }
    ]
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
    quantity: 300,
    unit: 'g',
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
    name: 'Mozzarella Cheese',
    quantity: 150,
    unit: 'g',
    category: 'Dairy',
    expiryDays: 5,
    imageUrl: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=150&h=150&fit=crop',
    dateAdded: '2026-04-15T09:20:00.000Z'
  },
  {
    id: '7',
    name: 'Bell Peppers',
    quantity: 300,
    unit: 'g',
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
    title: 'Pasta al Forno',
    time: '25 min',
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&h=200&fit=crop',
    ingredients: ['Eggs', 'Pasta', 'Mozzarella Cheese', 'Whole Milk'],
    instructions: [
      'Boil pasta until al dente.',
      'Mix pasta with bechamel and mozzarella.',
      'Bake until cheese is bubbly.',
      'Serve hot.'
    ]
  },
  {
    id: 'r2',
    title: 'Fluffy Mozzarella Omelette',
    time: '10 min',
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=200&fit=crop',
    ingredients: ['Eggs', 'Mozzarella Cheese', 'Whole Milk'],
    instructions: [
      'Beat the eggs with a splash of milk.',
      'Pour into a heated, oiled pan.',
      'Add mozzarella to one half and fold over.',
      'Cook until cheese is perfectly melted.'
    ]
  },
  {
    id: 'r3',
    title: 'Veggie Stir Fry',
    time: '15 min',
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop',
    ingredients: ['Bell Peppers', 'Spinach', 'Chicken'],
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
  },
  {
    id: 'r5',
    title: 'Gourmet Margherita Pizza',
    time: '45 min',
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=400&h=200&fit=crop',
    ingredients: ['Mozzarella Cheese', 'Tomato Sauce', 'Fresh Basil', 'Pizza Flour'],
    instructions: [
      'Roll out the pizza dough.',
      'Spread tomato sauce evenly.',
      'Add fresh mozzarella pieces.',
      'Bake at 450°F until crust is golden.',
      'Garnish with fresh basil before serving.'
    ]
  },
  {
    id: 'r6',
    title: 'Classic Caesar Salad',
    time: '15 min',
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=200&fit=crop',
    ingredients: ['Romaine Lettuce', 'Grilled Chicken', 'Parmesan Cheese', 'Croutons', 'Caesar Dressing'],
    instructions: [
      'Chop romaine lettuce into bite-sized pieces.',
      'Slice grilled chicken.',
      'Toss lettuce with dressing and croutons.',
      'Top with chicken and parmesan shavings.'
    ]
  },
  {
    id: 'r7',
    title: 'Creamy Mushroom Risotto',
    time: '40 min',
    difficulty: 'Hard',
    imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=200&fit=crop',
    ingredients: ['Arborio Rice', 'Mushrooms', 'Vegetable Broth', 'Onion', 'Parmesan Cheese'],
    instructions: [
      'Sauté onions and mushrooms in butter.',
      'Add rice and toast for 2 minutes.',
      'Slowly add warm broth, one ladle at a time, stirring constantly.',
      'Finish with parmesan and a knob of butter once rice is creamy.'
    ]
  },
  {
    id: 'r8',
    title: 'Truffle Mushroom Pasta',
    time: '30 min',
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400&h=200&fit=crop',
    ingredients: ['Pasta', 'Mushrooms', 'Truffle Oil', 'Parmesan Cheese', 'Garlic'],
    instructions: [
      'Cook pasta according to package instructions.',
      'Sauté garlic and mushrooms in olive oil until golden.',
      'Toss pasta with mushrooms and a drizzle of truffle oil.',
      'Top with plenty of parmesan cheese.'
    ]
  },
  {
    id: 'r9',
    title: 'Fresh Caprese Skewers',
    time: '15 min',
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1529312266912-b33cfce2eefd?w=400&h=200&fit=crop',
    ingredients: ['Mozzarella Cheese', 'Cherry Tomatoes', 'Fresh Basil', 'Balsamic Glaze'],
    instructions: [
      'Thread a cherry tomato, basil leaf, and mozzarella ball onto a small skewer.',
      'Repeat until all ingredients are used.',
      'Drizzle with balsamic glaze and a pinch of salt.'
    ]
  },
  {
    id: 'r10',
    title: 'Avocado Toast with Poached Egg',
    time: '12 min',
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=200&fit=crop',
    ingredients: ['Bread', 'Avocado', 'Eggs', 'Chili Flakes'],
    instructions: [
      'Toast your bread until golden brown.',
      'Mash avocado with salt and pepper, spread on toast.',
      'Poach an egg for 3 minutes until white is set but yolk is runny.',
      'Place egg on toast and sprinkle with chili flakes.'
    ]
  }
];
