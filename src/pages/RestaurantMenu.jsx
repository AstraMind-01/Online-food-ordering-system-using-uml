import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { menuService, cartService, orderService, authService } from '../services/api';

// Complete 19-item Diner Menu with culinary specifications, ingredients, and customization choices
const FOOD_ITEMS = [
  // 1. Smash Burgers & Melts
  {
    id: 'item-1',
    backendId: 1,
    name: 'The Route 66 Double Smash',
    category: 'smash',
    price: 12.95,
    badge: '★ Diner Special',
    badgeColor: 'bg-primary text-on-primary',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDImiRou9pZncwd_QKdJwfF2oddtJM6qe9LejdjAk9kU-VmPhfGKuDeXoLdev080FIqBb3EegRlQLcgGHjSsRSJnbJHhRXHy7xAtU8li2KeNF7efW1lu3sND3NLxAFAwhFaXr4JXevPQFVmAQS9MvyOefhp7YgTSaeUE55Z-ig7gfC1AYRDUo5S5Lg6pd4EVweZatSkLqXk0OPnMIoC9DZMn-To0ejPrWSfTUWx8JOGrQp1GG8o9Cnh',
    description: "Double smashed beef patties, griddled onions, thick sharp cheddar, crispy pickles, and Bill's secret 1974 spiced relish on toasted brioche.",
    longDescription: "Two Certified Angus beef patties smashed super thin on our screaming-hot flat-top griddle for maximum crispy lacy edges. Layered with double Wisconsin yellow cheddar, slowly caramelized vidalia onions, house dill pickles, and Big Bill's authentic 1974 secret burger relish on a golden butter-toasted brioche bun.",
    ingredients: ['Two 100% Angus Smash Patties', 'Wisconsin Sharp Cheddar', 'Griddled Vidalia Onions', 'Secret 1974 Spiced Relish', 'Crispy Dill Pickles', 'Butter-Toasted Brioche Bun'],
    allergens: 'Contains Dairy, Gluten. Prepared in a facility handling sesame and eggs.',
    prepTime: '12–15 mins',
    calories: '680 kcal',
    tags: ['House Favorite', 'Double Patty'],
    vegetarian: false,
    sideChoices: [
      { name: 'No Side (Just Burger)', price: 0 },
      { name: 'Crinkle-Cut Fries', price: 2.50 },
      { name: 'Crispy Onion Rings', price: 3.00 },
      { name: 'Truffle Parmesan Tots', price: 3.50 },
      { name: 'Garden Side Salad', price: 2.00 }
    ],
    extraChoices: [
      { name: 'Extra Sharp Melted Cheddar', price: 1.50 },
      { name: 'Applewood Smoked Bacon Strips', price: 2.00 },
      { name: 'Double Dill Pickles & Relish', price: 0.00 },
      { name: 'Fire-Roasted Jalapeños', price: 1.00 }
    ]
  },
  {
    id: 'item-2',
    backendId: 2,
    name: 'Avocado Green Goddess Burger',
    category: 'smash',
    price: 14.25,
    badge: '★ Veggie Pick',
    badgeColor: 'bg-tertiary text-on-tertiary',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUDrljKVytOGjUw1TO1Ki6e2JT0fcDAgQ4dpMy0NAm-0mo6Rh5JJzhqDTz0l6Ir3qtyERVD_Fqi7lOQJfqhqPB_kBiv070gWa3PSCgOOPn7wrfltXoQ9rg5Cab2j_-dC50_aDSHlvCElYHQ6Xe86F585Eh7EOpJMNHHbIJRzUg6t86wCFv1hLaqjZ_ji4F95yxlbODsyjwhmO98yw8ZqsWQ2LSo8UtQau1Xdad5fl5jbdtqg3xrSzX',
    description: 'Hand-formed seasoned plant patty, ripe avocado mash, green tomato chow-chow relish, and crisp iceberg on a griddled potato bun.',
    longDescription: 'Our award-winning vegetarian burger crafted with a savory charred plant-based patty, freshly crushed California Haas avocado, tangy pickled green tomato chow-chow relish, fresh garden herbs, and crisp iceberg lettuce on a griddled potato roll.',
    ingredients: ['Hand-Formed Plant Patty', 'Fresh California Avocado', 'Green Tomato Chow-Chow', 'Crisp Iceberg Lettuce', 'Fresh Tarragon & Chives', 'Potato Bun'],
    allergens: 'Contains Gluten. 100% Plant-Based and Vegetarian friendly.',
    prepTime: '10–12 mins',
    calories: '520 kcal',
    tags: ['Plant Option', 'Fresh Herbs'],
    vegetarian: true,
    sideChoices: [
      { name: 'No Side (Just Burger)', price: 0 },
      { name: 'Crinkle-Cut Fries', price: 2.50 },
      { name: 'Crispy Onion Rings', price: 3.00 },
      { name: 'Garden Side Salad', price: 2.00 }
    ],
    extraChoices: [
      { name: 'Extra Sliced Avocado', price: 2.00 },
      { name: 'Melted Swiss Cheese', price: 1.50 },
      { name: 'Extra Chow-Chow Relish', price: 0.00 }
    ]
  },
  {
    id: 'item-5',
    backendId: 7,
    name: 'Classic Patty Melt on Caraway Rye',
    category: 'smash',
    price: 11.50,
    badge: "★ Retro Classic '74",
    badgeColor: 'bg-secondary text-on-secondary',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAepflTShAE-KO4FlAI2SAZ96L-3fC_ab7LReW5F-kCX1z_fEga8NAE2c0p3bS-LsqXlnca1wPZvVop1jPWOOaUq0r6Bzs3zebF8yACt5gSBVH91ymVOFHqI_pXr4Qfr8Lok8-KqMTHOpcWxd-I8uF3aMfUOeC2s5jUbhoEPbOjAHeJIU9uFfMjJWywbH6hxQ3H4-2yEAG--OX2hf6-i1v2MrQh_k_4bJ1_MY785LPVGBjlZ6iwxd2G',
    description: 'Butter-toasted caraway seed rye bread, heavy griddled Swiss, slowly caramelized vidalia onions, and special black pepper diner dressing.',
    longDescription: 'The quintessential American diner sandwich: griddled flat-top Angus patty nestled between thick slices of seeded caraway rye bread, packed with deeply browned sweet vidalia onions, melted Swiss cheese, and our black pepper Russian diner dressing.',
    ingredients: ['Seeded Caraway Rye Bread', 'Angus Beef Patty', 'Imported Swiss Cheese', 'Slow-Caramelized Onions', 'Diner Black Pepper Dressing'],
    allergens: 'Contains Dairy, Gluten.',
    prepTime: '12–15 mins',
    calories: '640 kcal',
    tags: ['Griddled to Order', 'Swiss Cheese'],
    vegetarian: false,
    sideChoices: [
      { name: 'No Side (Just Melt)', price: 0 },
      { name: 'Crinkle-Cut Fries', price: 2.50 },
      { name: 'Crispy Onion Rings', price: 3.00 },
      { name: 'Truffle Parmesan Tots', price: 3.50 }
    ],
    extraChoices: [
      { name: 'Double Swiss Cheese', price: 1.50 },
      { name: 'Extra Caramelized Onions', price: 1.00 },
      { name: 'Smoked Bacon Strip', price: 2.00 }
    ]
  },
  {
    id: 'item-7',
    backendId: 5,
    name: 'Nashville Hot Crispy Chicken',
    category: 'smash',
    price: 13.50,
    badge: '★ Spicy Sensation',
    badgeColor: 'bg-[#cb4926] text-white',
    imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    description: 'Buttermilk-marinated chicken breast dredged in cayenne pepper glaze, spicy diner pickles, and tangy apple-cider slaw on toasted brioche.',
    longDescription: 'Jumbo tender chicken breast brined in whole buttermilk for 24 hours, double-dredged in seasoned flour, and fried until shatteringly crisp. Bathed in fiery Nashville hot cayenne chili oil, topped with cold apple-cider slaw and thick crinkle dill pickles.',
    ingredients: ['Buttermilk-Fried Chicken Breast', 'Nashville Hot Cayenne Glaze', 'Apple-Cider Cabbage Slaw', 'Thick Crinkle Pickles', 'Brioche Bun'],
    allergens: 'Contains Gluten, Dairy. Spicy.',
    prepTime: '15 mins',
    calories: '710 kcal',
    tags: ['Hand-Breaded', 'Crispy Chicken'],
    vegetarian: false,
    sideChoices: [
      { name: 'No Side', price: 0 },
      { name: 'Crinkle-Cut Fries', price: 2.50 },
      { name: 'Crispy Onion Rings', price: 3.00 }
    ],
    extraChoices: [
      { name: 'Extra Nashville Hot Dip', price: 0.75 },
      { name: 'Melted Pepper Jack Cheese', price: 1.25 },
      { name: 'Double Crinkle Pickles', price: 0.00 }
    ]
  },
  {
    id: 'item-8',
    backendId: 1,
    name: 'Smokey BBQ Bacon Beast',
    category: 'smash',
    price: 14.95,
    badge: '★ Smokehouse Pick',
    badgeColor: 'bg-[#59413b] text-white',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    description: 'Dual smashed Angus patties with crisp Applewood smoked bacon, smoked gouda, crispy vidalia onion strings, and sweet bourbon hickory BBQ.',
    longDescription: 'Built for hearty appetites: two smashed beef patties, thick-cut Applewood smoked bacon, warm melted smoked gouda cheese, a nest of crispy fried onion straws, and sweet Kentucky bourbon BBQ sauce on a toasted seeded bun.',
    ingredients: ['Two Angus Beef Patties', 'Applewood Bacon', 'Smoked Gouda', 'Fried Onion Strings', 'Bourbon Hickory BBQ Sauce', 'Seeded Bun'],
    allergens: 'Contains Dairy, Gluten.',
    prepTime: '14 mins',
    calories: '820 kcal',
    tags: ['Applewood Bacon', 'Hickory BBQ'],
    vegetarian: false,
    sideChoices: [
      { name: 'No Side', price: 0 },
      { name: 'Crinkle-Cut Fries', price: 2.50 },
      { name: 'Crispy Onion Rings', price: 3.00 }
    ],
    extraChoices: [
      { name: 'Double Bacon Strips', price: 2.00 },
      { name: 'Extra BBQ Sauce', price: 0.50 }
    ]
  },
  {
    id: 'item-9',
    backendId: 12,
    name: 'Coney Island Loaded Chili Dog',
    category: 'smash',
    price: 8.95,
    badge: '★ Boardwalk Classic',
    badgeColor: 'bg-[#fdc65c] text-[#231916]',
    imageUrl: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80',
    description: 'Charred all-beef frankfurter smothered in slow-cooked Texas road chili, minced sweet onions, and sharp ballpark mustard on a steamed bun.',
    longDescription: 'Old-school boardwalk style: jumbo all-beef frankfurter grilled over flame, loaded with slowly simmered Texas beef chili, freshly minced sweet vidalia onions, and tangy yellow stadium mustard on a steamed bakery split-top bun.',
    ingredients: ['100% All-Beef Frankfurter', 'Slow-Simmered Texas Chili', 'Minced Vidalia Onions', 'Yellow Stadium Mustard', 'Bakery Split-Top Bun'],
    allergens: 'Contains Gluten.',
    prepTime: '8–10 mins',
    calories: '490 kcal',
    tags: ['All-Beef Frank', 'Texas Chili'],
    vegetarian: false,
    sideChoices: [
      { name: 'No Side', price: 0 },
      { name: 'Crinkle-Cut Fries', price: 2.50 },
      { name: 'Crispy Onion Rings', price: 3.00 }
    ],
    extraChoices: [
      { name: 'Melted Cheddar Cheese Sauce', price: 1.25 },
      { name: 'Pickled Jalapeños', price: 0.75 }
    ]
  },

  // 2. Baskets & Sides
  {
    id: 'item-3',
    backendId: 4,
    name: 'Crinkle-Cut Loaded Fries',
    category: 'sides',
    price: 6.50,
    badge: '★ Loaded Basket',
    badgeColor: 'bg-primary text-on-primary',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO2eh4PZEcyMoktobhphBW-1t_dXhmeaAnQjCiG6gnsXPCSr4CjlqgySRva2pIgwRZAe-lZ1WrnUUgIcle7zQln2mr6RLDCWBq29yqK5uR51ncwEwBEP8Ear9Eh2sAxlULwBzXEEs1v4IFOG5rtN2wh8taP6l6uSBEoNUs30eoySN90nnMgJC52ncpYiNmTOwm2TQG2Sp9Yar4Klqc9_6SRgVNSOjfjq7Fo9AbMWEbAeBzOCU5tmVh',
    description: 'Extra crispy crinkle fries, spiced sea salt, velvety yellow cheddar cheese sauce, bacon crumble, and snipped scallions.',
    longDescription: 'Golden crinkle fries fried to crispy perfection, dusted with Big Bill’s signature diner season-salt, smothered in house-made warm cheddar cheese sauce, crisp Applewood bacon bits, and chopped green garden scallions.',
    ingredients: ['Crinkle-Cut Russet Potatoes', 'Velvety Cheddar Cheese Sauce', 'Smoked Bacon Bits', 'Fresh Green Scallions', 'Diner Season-Salt'],
    allergens: 'Contains Dairy.',
    prepTime: '6–8 mins',
    calories: '440 kcal',
    tags: ['Loaded Basket', 'Serves 2–3'],
    vegetarian: false,
    sideChoices: [
      { name: 'Big Bill Campfire Dip', price: 0 },
      { name: 'Buttermilk Ranch Dip', price: 0.50 },
      { name: 'Extra Warm Cheese Sauce', price: 1.00 }
    ],
    extraChoices: [
      { name: 'Double Bacon Crumble', price: 1.50 },
      { name: 'Sliced Pickled Jalapeños', price: 0.75 }
    ]
  },
  {
    id: 'item-6',
    backendId: 10,
    name: 'Crispy Vidalia Onion Ring Tower',
    category: 'sides',
    price: 6.00,
    badge: '★ Hand-Dipped',
    badgeColor: 'bg-tertiary text-on-tertiary',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_a9lG45cMxCs_SujnGOD789YutO6YkVHMYmPAQZ_Zbjbabsl8qn9rt7lyJLbWC5sJHQP-S-WYQOm2BpnCMaOH4NiVJ7eQWEMARYOo-TtIaPTyGTGRYDkc0RIQQ7XcShzpFwKmzb2YWel9YCmCtoPLYkv7aPe3mQde-EsZhX7KgxmIDJyg4mVCxtK8cIyVEDsW6B2Q6cVah83eNG3u2wTUaAjbrdTLLrZMuJlWNUV8OtfiWD33OScA',
    description: "Beer-battered thick sweet Vidalia onion rings served with Big Bill's tangy, smoky campfire dip.",
    longDescription: 'Thick, sweet Vidalia onion slices hand-dipped in cold-craft beer batter and flash-fried to an extraordinary golden crunch. Served with our famous tangy campfire dipping sauce.',
    ingredients: ['Sweet Vidalia Onions', 'Craft Beer Batter', 'Campfire Dip', 'Paprika & Sea Salt'],
    allergens: 'Contains Gluten. Vegetarian.',
    prepTime: '7 mins',
    calories: '390 kcal',
    tags: ['Vegetarian', 'Campfire Dip'],
    vegetarian: true,
    sideChoices: [
      { name: 'Campfire Dip (Included)', price: 0 },
      { name: 'Creamy Garlic Aioli', price: 0.75 }
    ],
    extraChoices: [
      { name: 'Extra Campfire Dip Cup', price: 0.75 }
    ]
  },
  {
    id: 'item-10',
    backendId: 4,
    name: 'Golden Truffle Parmesan Tots',
    category: 'sides',
    price: 7.25,
    badge: '★ Gourmet Crunch',
    badgeColor: 'bg-[#988100] text-white',
    imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
    description: 'Crunchy potato tots tossed with white truffle oil, freshly grated parmesan reggiano, sea salt herbs, and garlic aioli dip.',
    longDescription: 'Crisp cylindrical potato tots tossed while piping hot in aromatic Italian white truffle oil, fine sea salt, minced parsley, and finely grated aged parmesan reggiano. Served with house-whipped roasted garlic aioli.',
    ingredients: ['Grated Russet Potatoes', 'Italian White Truffle Oil', 'Parmigiano Reggiano', 'Fresh Parsley', 'Roasted Garlic Aioli'],
    allergens: 'Contains Dairy. Vegetarian.',
    prepTime: '8 mins',
    calories: '420 kcal',
    tags: ['Vegetarian', 'White Truffle'],
    vegetarian: true,
    sideChoices: [
      { name: 'Roasted Garlic Aioli', price: 0 },
      { name: 'Truffle Mayo', price: 1.00 }
    ],
    extraChoices: [
      { name: 'Extra Shaved Parmesan', price: 1.00 }
    ]
  },
  {
    id: 'item-11',
    backendId: 5,
    name: 'Buttermilk Fried Chicken Tenders Basket',
    category: 'sides',
    price: 11.50,
    badge: '★ Chef Basket',
    badgeColor: 'bg-primary text-on-primary',
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    description: 'Four giant hand-breaded buttermilk chicken tenders served with seasoned crinkle fries, house honey mustard, and smoky campfire dip.',
    longDescription: 'Four jumbo strips of fresh, whole chicken tenderloins brined in herbed buttermilk and hand-breaded to order. Served alongside a generous portion of crisp crinkle fries with house honey mustard and campfire dip.',
    ingredients: ['Hand-Cut Chicken Breast Tenders', 'Herbed Buttermilk Brine', 'Seasoned Crinkle Fries', 'Honey Mustard', 'Campfire Dip'],
    allergens: 'Contains Gluten, Dairy.',
    prepTime: '12 mins',
    calories: '670 kcal',
    tags: ['Fresh Chicken', 'Includes Fries'],
    vegetarian: false,
    sideChoices: [
      { name: 'Honey Mustard + Campfire Dip', price: 0 },
      { name: 'Buttermilk Ranch + BBQ', price: 0 }
    ],
    extraChoices: [
      { name: 'Add 2 Extra Tenders', price: 4.00 },
      { name: 'Extra Dipping Sauce', price: 0.75 }
    ]
  },
  {
    id: 'item-12',
    backendId: 4,
    name: 'Wisconsin Fried Mozzarella Stix',
    category: 'sides',
    price: 6.75,
    badge: '★ Epic Cheese Pull',
    badgeColor: 'bg-tertiary text-on-tertiary',
    imageUrl: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?auto=format&fit=crop&w=800&q=80',
    description: 'Six golden-crusted whole milk Wisconsin mozzarella sticks with an ultra-stretchy pull, served with warm San Marzano marinara.',
    longDescription: 'Six giant baton cuts of Wisconsin whole-milk mozzarella cheese, crusted with Italian herb breadcrumbs and flash fried. Guaranteed stretchy cheese pull, served with slow-simmered San Marzano tomato marinara.',
    ingredients: ['Wisconsin Whole Milk Mozzarella', 'Italian Herb Panko Breadcrumbs', 'San Marzano Tomato Marinara'],
    allergens: 'Contains Dairy, Gluten. Vegetarian.',
    prepTime: '7 mins',
    calories: '480 kcal',
    tags: ['Vegetarian', 'Marinara Dip'],
    vegetarian: true,
    sideChoices: [
      { name: 'Warm San Marzano Marinara', price: 0 },
      { name: 'Garlic Butter Dip', price: 0.75 }
    ],
    extraChoices: [
      { name: 'Extra Marinara Cup', price: 0.75 }
    ]
  },

  // 3. Fountain Malts & Shakes
  {
    id: 'item-4',
    backendId: 3,
    name: 'Tall Boy Neapolitan Malted Milkshake',
    category: 'shakes',
    price: 7.00,
    badge: '★ Hand-Spun',
    badgeColor: 'bg-primary text-on-primary',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUX06h_GTrBqVutq0m2qxKzgiPInRwc9dcCz2aft0rBV29FhE3IlQml-2w9Q0Xd5bRlfNQsESdX-KSfXS2STkNzv-E6BKpgD3M1C2UAheBKLPd7hj6G3jMqd_7lPjI9J0xb1Yr02VG-NA4-Artcs91ufaKnsCHNm0jTwr4J92OK3o2zH-ng_oY_xWGf6X2-OjuK0xBkU0TMaa57qFUKIx93tBvxO2XzTVhH5OXKKJfXnsdl8EkzruD',
    description: 'Real dairy vanilla bean, Dutch cocoa, and sweet macerated strawberry spun with malted barley powder. Finished with whipped cream.',
    longDescription: 'The crown jewel of our fountain bar: three scoops of local dairy ice cream (pure Madagascar vanilla, rich Dutch cocoa, and macerated Oregon strawberry) spun with whole milk and malted barley powder in an antique stainless steel mixer. Finished with hand-whipped sweet cream and a maraschino cherry.',
    ingredients: ['Vanilla Bean Ice Cream', 'Dutch Cocoa', 'Oregon Strawberries', 'Malted Barley Powder', 'Whole Milk', 'Whipped Cream', 'Maraschino Cherry'],
    allergens: 'Contains Dairy. Vegetarian.',
    prepTime: '5 mins',
    calories: '590 kcal',
    tags: ['Extra Thick', 'Classic Malt', 'Vegetarian'],
    vegetarian: true,
    sideChoices: [
      { name: 'Classic 16oz Can', price: 0 },
      { name: 'Super 20oz Fluted Glass', price: 1.50 }
    ],
    extraChoices: [
      { name: 'Extra Malted Barley Powder', price: 0.75 },
      { name: 'Dark Chocolate Fudge Drizzle', price: 1.00 },
      { name: 'Double Whipped Cream & Cherry', price: 0.50 }
    ]
  },
  {
    id: 'item-13',
    backendId: 6,
    name: 'Salted Caramel Pretzel Crunch Shake',
    category: 'shakes',
    price: 7.50,
    badge: '★ Sweet & Salty',
    badgeColor: 'bg-[#988100] text-white',
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    description: 'Madagascar vanilla custard blended with buttery caramel ribbon, topped with crushed salted pretzel brittle and sea salt flakes.',
    longDescription: 'Creamy vanilla custard spun with warm butterscotch caramel sauce, folded with freshly crushed salted pretzel brittle bits, topped with real whipped cream, caramel drizzle, and Maldon sea salt flakes.',
    ingredients: ['Vanilla Custard', 'Caramel Ribbon', 'Salted Pretzel Brittle', 'Maldon Flake Salt', 'Whipped Cream'],
    allergens: 'Contains Dairy, Gluten. Vegetarian.',
    prepTime: '5 mins',
    calories: '610 kcal',
    tags: ['Pretzel Crunch', 'Sea Salt Caramel', 'Vegetarian'],
    vegetarian: true,
    sideChoices: [
      { name: 'Classic 16oz Cup', price: 0 }
    ],
    extraChoices: [
      { name: 'Extra Pretzel Brittle', price: 0.75 },
      { name: 'Warm Caramel Shot', price: 0.75 }
    ]
  },
  {
    id: 'item-14',
    backendId: 3,
    name: 'Old School 1950s Root Beer Float',
    category: 'shakes',
    price: 5.50,
    badge: '★ Retro Classic',
    badgeColor: 'bg-[#59413b] text-white',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    description: 'Frosted vintage heavy mug filled with craft draft root beer, topped with two scoops of slow-churned bourbon vanilla bean ice cream.',
    longDescription: 'Served in an ice-frosted heavy glass mug: micro-brewed draft root beer with sassafras, vanilla, and wintergreen botanicals, crowned with two heaping scoops of slow-churned bourbon vanilla bean ice cream.',
    ingredients: ['Craft Micro-Brewed Root Beer', 'Bourbon Vanilla Bean Ice Cream'],
    allergens: 'Contains Dairy. Vegetarian.',
    prepTime: '4 mins',
    calories: '380 kcal',
    tags: ['Draft Soda', 'Vanilla Scoop', 'Vegetarian'],
    vegetarian: true,
    sideChoices: [
      { name: 'Ice-Frosted Mug', price: 0 }
    ],
    extraChoices: [
      { name: 'Extra Scoop of Vanilla', price: 1.75 }
    ]
  },
  {
    id: 'item-15',
    backendId: 6,
    name: 'Double Dutch Dark Fudge Malt',
    category: 'shakes',
    price: 7.25,
    badge: '★ Choco Mania',
    badgeColor: 'bg-[#231916] text-[#fed388]',
    imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
    description: 'Decadent Dutch cocoa custard, malted milk powder, warm chocolate fudge swirl, topped with chocolate sprinkles and a maraschino cherry.',
    longDescription: 'Rich dark Dutch cocoa spun with malted barley and whole milk, swirled with warm hot fudge sauce, finished with mountain-high whipped cream and dark chocolate curls.',
    ingredients: ['Dutch Cocoa Ice Cream', 'Hot Fudge', 'Malted Barley Powder', 'Dark Chocolate Curls', 'Whipped Cream'],
    allergens: 'Contains Dairy. Vegetarian.',
    prepTime: '5 mins',
    calories: '630 kcal',
    tags: ['Dark Chocolate', 'Malted', 'Vegetarian'],
    vegetarian: true,
    sideChoices: [
      { name: 'Classic 16oz Can', price: 0 }
    ],
    extraChoices: [
      { name: 'Extra Hot Fudge Swirl', price: 1.00 },
      { name: 'Crushed Oreos', price: 1.25 }
    ]
  },

  // 4. Homemade Desserts & Pies
  {
    id: 'item-16',
    backendId: 11,
    name: 'Deep-Dish Cinnamon Apple Pie à la Mode',
    category: 'desserts',
    price: 7.25,
    badge: "★ Grandma's Recipe",
    badgeColor: 'bg-primary text-on-primary',
    imageUrl: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80',
    description: 'Flaky hand-crimped butter crust filled with spiced Granny Smith apples and cinnamon honey glaze, served warm with vanilla bean gelato.',
    longDescription: 'Baked fresh in our diner kitchen every morning: buttery, flaky double-crust pie stuffed with tender Granny Smith apples tossed in Saigon cinnamon, nutmeg, and brown sugar. Served warm from the oven with a scoop of cool vanilla bean gelato.',
    ingredients: ['Granny Smith Apples', 'Saigon Cinnamon', 'Butter-Flake Pastry', 'Bourbon Vanilla Bean Gelato'],
    allergens: 'Contains Dairy, Gluten. Vegetarian.',
    prepTime: '6 mins',
    calories: '490 kcal',
    tags: ['Served Warm', 'Vanilla Gelato', 'Vegetarian'],
    vegetarian: true,
    sideChoices: [
      { name: 'Vanilla Bean Gelato (Included)', price: 0 },
      { name: 'Whipped Sweet Cream Only', price: 0 }
    ],
    extraChoices: [
      { name: 'Warm Caramel Drizzle', price: 0.75 },
      { name: 'Double Scoop Gelato', price: 1.75 }
    ]
  },
  {
    id: 'item-17',
    backendId: 11,
    name: 'Skillet Hot Fudge Brownie Sundae',
    category: 'desserts',
    price: 8.50,
    badge: '★ Ultimate Dessert',
    badgeColor: 'bg-[#cb4926] text-white',
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80',
    description: 'Warm gooey triple-chocolate fudge brownie in a mini cast-iron skillet, topped with double vanilla scoops, hot fudge, and toasted walnuts.',
    longDescription: 'Gooey, rich triple-chocolate brownie served bubbling in a mini cast-iron skillet, topped with two large scoops of vanilla bean ice cream, thick hot fudge, toasted chopped walnuts, and a cherry.',
    ingredients: ['Fudge Chocolate Brownie', 'Vanilla Bean Ice Cream', 'Hot Fudge Sauce', 'Toasted Walnuts', 'Maraschino Cherry'],
    allergens: 'Contains Dairy, Gluten, Nuts. Vegetarian.',
    prepTime: '7 mins',
    calories: '680 kcal',
    tags: ['Warm Skillet', 'Double Scoop', 'Vegetarian'],
    vegetarian: true,
    sideChoices: [
      { name: 'Hot Skillet Presentation', price: 0 }
    ],
    extraChoices: [
      { name: 'No Walnuts (Nut-Free)', price: 0 },
      { name: 'Extra Warm Hot Fudge', price: 1.00 }
    ]
  },

  // 5. Hand-Crafted Beverages
  {
    id: 'item-18',
    backendId: 3,
    name: 'Handcrafted Cherry Vanilla Cola',
    category: 'beverages',
    price: 3.75,
    badge: '★ Handcrafted Fountain',
    badgeColor: 'bg-[#a9310f] text-white',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoZxQuCZjoebNJODjhyJESxQlYgLaQhRW4-fIUfUeotsVlQkgH7_gntG2dBgZR9IRR88WjdrI1XyZhS4en_jc71O1JcOlOxo3L-FFCdLuXLMshNc9blA52EBvk3ZiD3nu3LpR7gSxwoCCQVYWa2SNrV5BHfoOGNbAOtFoVJJhe1geLoWc0YB2dB0ffgqzH7rAYQcWePhpujhpyNXr1zm9St7Qi8M9PWxd3hbLCDrJWf6Mt4g4dasuH',
    description: 'Cold-pressed tart black cherry syrup, pure Mexican cane sugar cola, and Madagascar vanilla bean extract over crushed pebble ice.',
    longDescription: 'Hand-pulled soda fountain delight: pure cane sugar cola blended with house-made tart black cherry syrup, real Madagascar vanilla bean essence, served over crushed pebble ice with two stem-on sweet cherries.',
    ingredients: ['Pure Cane Sugar Cola', 'Tart Black Cherry Syrup', 'Madagascar Vanilla Extract', 'Pebble Ice'],
    allergens: 'Vegetarian. Caffeine.',
    prepTime: '3 mins',
    calories: '180 kcal',
    tags: ['Real Cane Sugar', 'Crushed Ice', 'Vegetarian'],
    vegetarian: true,
    sideChoices: [
      { name: 'Crushed Pebble Ice', price: 0 },
      { name: 'Light Ice', price: 0 }
    ],
    extraChoices: [
      { name: 'Extra Cherry Syrup Shot', price: 0.50 }
    ]
  },
  {
    id: 'item-19',
    backendId: 3,
    name: 'Fresh Squeezed Route 66 Lemonade',
    category: 'beverages',
    price: 3.50,
    badge: '★ All-Natural Refresher',
    badgeColor: 'bg-[#988100] text-white',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    description: 'Hand-squeezed sun-ripened Meyer lemons, pure cane sugar syrup, iced spring water, garnished with fresh mint sprig and lemon wheels.',
    longDescription: 'Made fresh by the pitcher all day long: whole California Meyer lemons squeezed fresh, simple pure cane sugar syrup, cold mountain spring water, and crushed ice with fresh garden mint.',
    ingredients: ['Fresh Squeezed Meyer Lemons', 'Pure Cane Sugar', 'Filtered Spring Water', 'Fresh Garden Mint'],
    allergens: 'Vegetarian. Gluten-Free.',
    prepTime: '3 mins',
    calories: '140 kcal',
    tags: ['Fresh Squeezed', 'No Artificial', 'Vegetarian'],
    vegetarian: true,
    sideChoices: [
      { name: 'Regular Ice', price: 0 },
      { name: 'Extra Ice', price: 0 }
    ],
    extraChoices: [
      { name: 'Fresh Mint Leaves', price: 0.25 },
      { name: 'Strawberry Puree Infusion', price: 0.75 }
    ]
  },
];

export default function RestaurantMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderMode, setOrderMode] = useState('single'); // 'single' (Personal Solo Order) or 'group' (Collab Booth)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Food Item Details Modal State
  const [selectedFoodDetail, setSelectedFoodDetail] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [selectedSide, setSelectedSide] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [specialNote, setSpecialNote] = useState('');

  // Quantities for each item on the card grid
  const [quantities, setQuantities] = useState(() => {
    const initial = {};
    FOOD_ITEMS.forEach((it) => {
      initial[it.id] = 1;
    });
    return initial;
  });

  const [trayCount, setTrayCount] = useState(5);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  // Single Person Order State
  const [soloItems, setSoloItems] = useState([
    { backendId: 1, name: 'The Route 66 Double Smash', price: 12.95, quantity: 1 }
  ]);
  const [soloAddress, setSoloAddress] = useState('742 Evergreen Terrace (Booth 4)');

  // Solo Bill Calculations
  const soloSubtotal = soloItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
  const soloDeliveryFee = soloSubtotal >= 35 || soloSubtotal === 0 ? 0 : 2.50;
  const soloTax = soloSubtotal * 0.0825;
  const soloGrandTotal = soloSubtotal + (soloSubtotal > 0 ? soloDeliveryFee + soloTax : 0);
  const soloCount = soloItems.reduce((sum, it) => sum + it.quantity, 0);

  // Auto-open drawer if navigated with hash
  useEffect(() => {
    if (location.hash === '#shared-ticket' || location.hash === '#cart') {
      setCartDrawerOpen(true);
    }
  }, [location.hash]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const handleQtyChange = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  // Open Details Modal for an item
  const handleOpenDetail = (item) => {
    setSelectedFoodDetail(item);
    setModalQty(quantities[item.id] || 1);
    setSelectedSide(item.sideChoices && item.sideChoices.length > 0 ? item.sideChoices[0] : null);
    setSelectedAddons([]);
    setSpecialNote('');
  };

  // Modal Price Calculation
  const modalSidePrice = selectedSide?.price || 0;
  const modalAddonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const modalCalculatedTotal = selectedFoodDetail
    ? (selectedFoodDetail.price + modalSidePrice + modalAddonsPrice) * modalQty
    : 0;

  // Add from Details Modal to Solo Order
  const handleAddModalSolo = () => {
    if (!selectedFoodDetail) return;
    const itemUnitPrice = selectedFoodDetail.price + modalSidePrice + modalAddonsPrice;
    let customLabel = selectedFoodDetail.name;
    if (selectedSide && selectedSide.price > 0) {
      customLabel += ` (+${selectedSide.name})`;
    }
    if (selectedAddons.length > 0) {
      customLabel += ` [${selectedAddons.map(a => a.name).join(', ')}]`;
    }

    setSoloItems((prev) => {
      const idx = prev.findIndex((it) => it.name === customLabel && it.price === itemUnitPrice);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += modalQty;
        return copy;
      }
      return [...prev, { backendId: selectedFoodDetail.backendId, name: customLabel, price: itemUnitPrice, quantity: modalQty }];
    });

    setOrderMode('single');
    triggerToast(`✓ Added ${modalQty}x "${customLabel}" to Solo Order!`);

    try {
      if (authService.isAuthenticated()) {
        cartService.addItem(selectedFoodDetail.backendId, modalQty);
      }
    } catch {}

    setSelectedFoodDetail(null);
  };

  // Add from Details Modal to Group Tray
  const handleAddModalGroup = () => {
    if (!selectedFoodDetail) return;
    handleAddToTray(selectedFoodDetail.name, selectedFoodDetail.backendId);
    setSelectedFoodDetail(null);
  };

  // Add to Collaborative Group Tray
  const handleAddToTray = async (name, itemBackendId = 1) => {
    setTrayCount((prev) => prev + 1);
    setOrderMode('group');
    triggerToast(`Added ${name} to Sally's Group Tray!`);
    try {
      if (authService.isAuthenticated()) {
        await cartService.addItem(itemBackendId, quantities[`item-${itemBackendId}`] || 1);
      }
    } catch {}
  };

  // Add to Single Person Order (Personal Tray)
  const handleAddSoloOrder = (name, price, backendId, qtyKey) => {
    const qty = quantities[qtyKey] || 1;
    setSoloItems((prev) => {
      const idx = prev.findIndex((it) => it.backendId === backendId && it.price === price);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += qty;
        return copy;
      }
      return [...prev, { backendId, name, price, quantity: qty }];
    });
    setOrderMode('single');
    triggerToast(`✓ Added ${qty}x "${name}" to your Single Person Order!`);

    try {
      if (authService.isAuthenticated()) {
        cartService.addItem(backendId, qty);
      }
    } catch {}
  };

  const handleSoloQtyChange = (backendId, delta) => {
    setSoloItems((prev) =>
      prev
        .map((it) => {
          if (it.backendId === backendId) {
            const nextQty = it.quantity + delta;
            return nextQty > 0 ? { ...it, quantity: nextQty } : null;
          }
          return it;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveSoloItem = (backendId) => {
    setSoloItems((prev) => prev.filter((it) => it.backendId !== backendId));
    triggerToast('Item removed from Single Person Order.');
  };

  // Checkout Single Person Order
  const handleSingleOrderCheckout = async () => {
    if (soloItems.length === 0) {
      triggerToast('Your Solo Order is empty! Add items first.');
      return;
    }
    setIsOrdering(true);
    try {
      if (!authService.isAuthenticated()) {
        try {
          await authService.login('customer1@chowchow.com', 'cust123');
        } catch {}
      }

      try {
        await cartService.clear();
        for (const item of soloItems) {
          await cartService.addItem(item.backendId, item.quantity);
        }
      } catch {}

      const res = await orderService.create({
        restaurantId: 1,
        deliveryAddress: soloAddress || '742 Evergreen Terrace (Booth 4)',
        deliveryLatitude: 30.2849,
        deliveryLongitude: -97.7341,
      });

      if (res && res.id) {
        triggerToast('Single person order placed successfully!');
        navigate(`/track-order?orderId=${res.id}`);
        return;
      }
    } catch (e) {
      console.error('Failed to create solo order', e);
    } finally {
      setIsOrdering(false);
    }
    navigate('/track-order?orderId=1');
  };

  // Group Checkout
  const handleDirectCheckout = async () => {
    setIsOrdering(true);
    try {
      if (!authService.isAuthenticated()) {
        try {
          await authService.login('customer1@chowchow.com', 'cust123');
        } catch {}
      }
      try {
        await cartService.addItem(1, 1);
        await cartService.addItem(3, 1);
      } catch {}

      const res = await orderService.create({
        restaurantId: 1,
        deliveryAddress: '742 Evergreen Terrace, Floor 3, Buzz #04',
        deliveryLatitude: 30.2849,
        deliveryLongitude: -97.7341,
      });

      if (res && res.id) {
        triggerToast('Group delivery order placed successfully!');
        navigate(`/track-order?orderId=${res.id}`);
        return;
      }
    } catch (e) {
      console.error('Failed direct checkout', e);
    } finally {
      setIsOrdering(false);
    }
    navigate('/track-order?orderId=1');
  };

  const handleCopyInvite = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/group-ordering?session=table-04`);
      triggerToast('Booth invite link copied to clipboard!');
    } else {
      triggerToast('Invite link: /group-ordering?session=table-04');
    }
  };

  // Filter items
  const filteredItems = FOOD_ITEMS.filter((item) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'vegetarian') return item.vegetarian;
    return item.category === selectedCategory;
  });

  return (
    <div className="flex flex-col gap-space-lg pb-32">
      {/* Top Breadcrumb & Marquee Context Ribbon */}
      <section className="flex flex-col gap-space-xs">
        <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-on-surface font-bold">Route 66 Retro Diner</span>
        </div>

        {/* Marquee Banner with Mode Switcher */}
        <div className="bg-[#ffdea7] text-[#231916] rounded-xl diner-border p-space-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-[2px_2px_0px_#231916]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center p-1 bg-[#fff8f6] rounded-xl border-2 border-[#231916] gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setOrderMode('single');
                  triggerToast('Switched to Single Person Order mode.');
                }}
                className={`px-3 py-1.5 rounded-lg font-label-md text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                  orderMode === 'single'
                    ? 'bg-[#cb4926] text-white shadow-[2px_2px_0px_#231916]'
                    : 'text-[#59413b] hover:text-[#231916]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">person</span>
                <span>Single Person Order</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setOrderMode('group');
                  triggerToast('Switched to Collaborative Group Booth mode.');
                }}
                className={`px-3 py-1.5 rounded-lg font-label-md text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                  orderMode === 'group'
                    ? 'bg-[#fdc65c] text-[#231916] shadow-[2px_2px_0px_#231916]'
                    : 'text-[#59413b] hover:text-[#231916]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">diversity_3</span>
                <span>Collab Group Mode</span>
              </button>
            </div>

            <span className="hidden sm:inline font-body-sm text-xs font-bold text-[#59413b]">
              {orderMode === 'single'
                ? '👤 Ordering just for yourself? Fast, direct courier dropoff to your address!'
                : "👥 Sally's Office Lunch session active • 4 diner pals picking together!"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#cb4926] text-white font-label-sm text-xs font-black uppercase border border-[#231916] shadow-[2px_2px_0px_#231916] hover:bg-[#a9310f] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              <span>View Guest Check ({orderMode === 'single' ? soloCount : trayCount})</span>
            </button>
            {orderMode === 'group' && (
              <button
                className="px-3 py-1.5 rounded-full bg-white text-[#231916] font-label-sm text-xs font-bold border border-[#231916] hover:bg-[#fff1ec] transition-all flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_#231916]"
                id="copyInviteBtn"
                type="button"
                onClick={handleCopyInvite}
              >
                <span className="material-symbols-outlined text-sm text-[#cb4926]">link</span>
                <span>Invite Link</span>
              </button>
            )}
          </div>
        </div>

        {/* Restaurant Header Card */}
        <div className="bg-surface-container-low rounded-2xl diner-border p-space-md lg:p-space-lg relative overflow-hidden">
          {/* Decorative Retro Watermark */}
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none">
            <span className="material-symbols-outlined text-[240px] text-on-surface">lunch_dining</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg relative z-10">
            {/* Brand Title & Details */}
            <div className="flex flex-col gap-space-xs max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm uppercase diner-tag tracking-wider">
                  Highway 66 Flavor Stop
                </span>
                <span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm diner-tag flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-xs">star</span> 4.9 (420 reviews)
                </span>
                <span className="px-2.5 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm diner-tag">
                  Open Late 'til 2 AM
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg uppercase tracking-tight text-on-surface mt-1">
                Big Bill's Burger Emporium
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Fresh griddled smash patties, house relish, toasted potato buns, crispy sides, and fountain malts spun on genuine 1958 Hamilton Beach mixers.
              </p>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-space-md text-on-surface-variant font-label-sm text-label-sm mt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-primary">timer</span> Avg Prep: 15–25 min
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-secondary">local_shipping</span> Free Delivery over ₹35
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-tertiary">touch_app</span> Click any food item for ingredients &amp; customization
                </span>
              </div>
            </div>

            {/* Action Pill Group */}
            <div className="flex flex-wrap lg:flex-col gap-space-xs shrink-0 items-start lg:items-end">
              <button
                type="button"
                onClick={() => setCartDrawerOpen(true)}
                className="px-space-md py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase diner-tag hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-lg">receipt_long</span>
                <span>Open Guest Check ({soloCount + trayCount})</span>
              </button>
              <Link
                to="/group-ordering"
                className="px-space-md py-2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md uppercase diner-tag hover:bg-secondary-fixed-dim transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">diversity_3</span>
                <span>Booth Table #942</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Dietary Pill Strip */}
      <section className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          className={`px-4 py-1.5 rounded-full font-label-md text-label-md diner-tag shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-secondary-container text-on-secondary-container font-bold shadow-[2px_2px_0px_#231916]'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
          type="button"
          onClick={() => setSelectedCategory('all')}
        >
          All Diner Goodies (19)
        </button>
        <button
          className={`px-4 py-1.5 rounded-full font-label-md text-label-md diner-tag shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'smash'
              ? 'bg-secondary-container text-on-secondary-container font-bold shadow-[2px_2px_0px_#231916]'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
          type="button"
          onClick={() => setSelectedCategory('smash')}
        >
          Smash Burgers &amp; Melts (6)
        </button>
        <button
          className={`px-4 py-1.5 rounded-full font-label-md text-label-md diner-tag shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'sides'
              ? 'bg-secondary-container text-on-secondary-container font-bold shadow-[2px_2px_0px_#231916]'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
          type="button"
          onClick={() => setSelectedCategory('sides')}
        >
          Baskets &amp; Sides (5)
        </button>
        <button
          className={`px-4 py-1.5 rounded-full font-label-md text-label-md diner-tag shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'shakes'
              ? 'bg-secondary-container text-on-secondary-container font-bold shadow-[2px_2px_0px_#231916]'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
          type="button"
          onClick={() => setSelectedCategory('shakes')}
        >
          Malts &amp; Shakes (4)
        </button>
        <button
          className={`px-4 py-1.5 rounded-full font-label-md text-label-md diner-tag shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'desserts'
              ? 'bg-secondary-container text-on-secondary-container font-bold shadow-[2px_2px_0px_#231916]'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
          type="button"
          onClick={() => setSelectedCategory('desserts')}
        >
          Desserts &amp; Pies (2)
        </button>
        <button
          className={`px-4 py-1.5 rounded-full font-label-md text-label-md diner-tag shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'beverages'
              ? 'bg-secondary-container text-on-secondary-container font-bold shadow-[2px_2px_0px_#231916]'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
          type="button"
          onClick={() => setSelectedCategory('beverages')}
        >
          Beverages (2)
        </button>
        <button
          className={`px-4 py-1.5 rounded-full font-label-md text-label-md diner-tag shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
            selectedCategory === 'vegetarian'
              ? 'bg-secondary-container text-on-secondary-container font-bold shadow-[2px_2px_0px_#231916]'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
          }`}
          type="button"
          onClick={() => setSelectedCategory('vegetarian')}
        >
          <span className="w-2 h-2 rounded-full bg-tertiary"></span> Veggie Friendly (11)
        </button>
      </section>

      {/* Main Full-Width Food Menu Grid (3 Columns) */}
      <main className="w-full flex flex-col gap-space-xl">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-on-surface/40">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-3xl">restaurant_menu</span>
            <h2 className="font-headline-xl text-headline-xl uppercase tracking-tight text-on-surface">
              {selectedCategory === 'all' && 'All Diner Specials & Goodies (19)'}
              {selectedCategory === 'smash' && 'Smash Burgers, Melts & Sandwiches (6)'}
              {selectedCategory === 'sides' && 'Diner Baskets & Crispy Sides (5)'}
              {selectedCategory === 'shakes' && 'Fountain Malts & Shakes (4)'}
              {selectedCategory === 'desserts' && 'Homemade Desserts & Pies (2)'}
              {selectedCategory === 'beverages' && 'Handcrafted Cold Beverages (2)'}
              {selectedCategory === 'vegetarian' && '100% Vegetarian Friendly Diner Picks (11)'}
            </h2>
          </div>
          <span className="font-label-sm text-label-sm uppercase bg-surface-container px-3 py-1 rounded diner-tag font-bold">
            Fresh Griddled &amp; Hand-Crafted
          </span>
        </div>

        {/* 3-Column Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="bg-surface-container-lowest rounded-2xl diner-border p-space-md flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform group shadow-sm hover:shadow-md"
            >
              {/* Clickable Card Body opening Food Details Modal */}
              <div
                className="flex flex-col cursor-pointer group/card"
                onClick={() => handleOpenDetail(item)}
                title="Click to view full recipe details, ingredients & side customization"
              >
                <div className="relative w-full h-52 rounded-xl overflow-hidden diner-border mb-space-sm bg-surface-container">
                  <img
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                    alt={item.name}
                    src={item.imageUrl}
                    loading="lazy"
                  />
                  <span className={`absolute top-2 left-2 px-2.5 py-0.5 rounded font-label-sm text-[10px] uppercase font-bold diner-tag tracking-wider shadow-sm ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-sm font-bold diner-tag shadow-sm">
                    ₹{item.price.toFixed(2)}
                  </span>
                  {/* Hover Hint Overlay Badge */}
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#231916]/85 text-white font-label-sm text-[10px] uppercase font-black opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center gap-1 backdrop-blur-xs shadow-sm">
                    <span className="material-symbols-outlined text-[13px] text-[#fdc65c]">info</span>
                    <span>View Details</span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-headline-sm text-lg uppercase text-on-surface font-black leading-snug group-hover/card:text-[#cb4926] transition-colors">
                    {item.name}
                  </h3>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-surface-container-high font-label-sm text-[10px] uppercase text-on-surface font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.vegetarian && (
                    <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] uppercase font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Veg
                    </span>
                  )}
                </div>
              </div>

              {/* Stepper and Dual Action Buttons */}
              <div className="mt-space-md pt-space-xs border-t-2 border-dashed border-outline-variant flex items-center justify-between gap-2">
                <div className="flex items-center diner-tag rounded-full bg-surface-container-low p-0.5">
                  <button
                    className="w-7 h-7 rounded-full bg-surface flex items-center justify-center font-bold text-on-surface hover:bg-secondary-fixed text-sm transition-colors cursor-pointer"
                    type="button"
                    onClick={() => handleQtyChange(item.id, -1)}
                  >
                    −
                  </button>
                  <span className="w-7 text-center font-label-md text-xs font-bold">
                    {quantities[item.id] || 1}
                  </span>
                  <button
                    className="w-7 h-7 rounded-full bg-surface flex items-center justify-center font-bold text-on-surface hover:bg-secondary-fixed text-sm transition-colors cursor-pointer"
                    type="button"
                    onClick={() => handleQtyChange(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-1.5">
                  <button
                    className="py-2 px-2 rounded-full bg-[#cb4926] text-white font-label-sm text-[11px] font-black uppercase diner-tag hover:bg-[#a9310f] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                    type="button"
                    title="Add item to your single person order"
                    onClick={() => handleAddSoloOrder(item.name, item.price, item.backendId, item.id)}
                  >
                    <span className="material-symbols-outlined text-xs">person</span>
                    <span className="truncate">Add to Order</span>
                  </button>
                  <button
                    className="py-2 px-2 rounded-full bg-[#ffdea7] text-[#231916] font-label-sm text-[11px] font-black uppercase diner-tag hover:bg-[#fed388] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1 cursor-pointer border border-[#231916] shadow-sm"
                    type="button"
                    title="Add item to shared booth tray"
                    onClick={() => handleAddToTray(item.name, item.backendId)}
                  >
                    <span className="material-symbols-outlined text-xs">diversity_3</span>
                    <span className="truncate">Group Tray</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Retro Diner Table Guarantee Callout Banner */}
        <div className="w-full bg-secondary-fixed/50 rounded-2xl diner-border p-space-md lg:p-space-lg flex items-center gap-space-md mt-6">
          <span className="material-symbols-outlined text-5xl text-secondary shrink-0">
            sentiment_very_satisfied
          </span>
          <div>
            <h4 className="font-headline-sm text-headline-sm uppercase text-on-surface font-black">
              The 100% Big Bill Diner Guarantee
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              All solo orders and group booth items are prepared fresh to order using 100% Angus beef, locally churned dairy, and farm produce. If it isn't piping hot, Bill makes it twice!
            </p>
          </div>
        </div>
      </main>

      {/* Floating Bottom Diner Order Dock (Visible when user has active items) */}
      {(soloCount > 0 || trayCount > 0) && (
        <aside className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl">
          <div className="bg-[#231916] text-white p-3 sm:p-3.5 rounded-2xl diner-border-thick shadow-[4px_4px_0px_#cb4926] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 pl-1.5">
              <div className="w-10 h-10 rounded-xl bg-[#cb4926] text-white flex items-center justify-center font-black text-lg border border-white/20 shrink-0">
                🍔
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase text-[#fdc65c] tracking-wide truncate">
                  {orderMode === 'single'
                    ? `Solo Order (${soloCount} items)`
                    : `Booth #942 Tray (${trayCount} items)`}
                </p>
                <p className="text-sm font-bold text-white">
                  Total: <span className="text-[#caecbe]">{orderMode === 'single' ? `₹${soloGrandTotal.toFixed(2)}` : '₹45.85'}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#cb4926] hover:bg-[#a9310f] text-white font-label-md text-xs font-black uppercase diner-tag tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md shrink-0 active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>View Guest Check</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </aside>
      )}

      {/* ========================================================================= */}
      {/* FOOD ITEM DETAILS & CUSTOMIZATION MODAL (When clicking any food item)      */}
      {/* ========================================================================= */}
      {selectedFoodDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedFoodDetail(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-[#fff8f6] rounded-2xl diner-border-thick shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* Top Diner Scalloped Ribbon Header */}
            <div className="bg-[#ffdea7] p-3 px-5 diner-border-thick border-x-0 border-t-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#cb4926] text-xl font-bold">lunch_dining</span>
                <span className="font-headline-sm text-xs font-black uppercase text-[#231916] tracking-wider">
                  Diner Recipe Specification &amp; Customization
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFoodDetail(null)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#231916] flex items-center justify-center border-2 border-[#231916] transition-colors cursor-pointer shadow-sm active:translate-x-0.5 active:translate-y-0.5"
                title="Close details"
              >
                <span className="material-symbols-outlined text-base font-bold">close</span>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Food Image with Badges */}
                <div className="md:col-span-6 flex flex-col">
                  <div className="relative w-full h-64 rounded-xl overflow-hidden diner-border bg-surface-container shadow-md">
                    <img
                      src={selectedFoodDetail.imageUrl}
                      alt={selectedFoodDetail.name}
                      className="w-full h-full object-cover"
                    />
                    <span className={`absolute top-2.5 left-2.5 px-3 py-1 rounded font-label-sm text-xs uppercase font-black diner-tag shadow-sm ${selectedFoodDetail.badgeColor}`}>
                      {selectedFoodDetail.badge}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded bg-[#231916] text-[#fed388] font-label-md text-base font-black border border-[#fed388] shadow-sm">
                      ₹{selectedFoodDetail.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Quick Prep & Calorie Badges */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface-container flex items-center gap-1.5 border border-outline-variant/40">
                      <span className="material-symbols-outlined text-sm text-[#cb4926]">timer</span>
                      <span className="font-bold text-on-surface">{selectedFoodDetail.prepTime || '12–15 mins'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-container flex items-center gap-1.5 border border-outline-variant/40">
                      <span className="material-symbols-outlined text-sm text-tertiary">local_fire_department</span>
                      <span className="font-bold text-on-surface">{selectedFoodDetail.calories || '550–700 kcal'}</span>
                    </div>
                  </div>
                </div>

                {/* Food Details Info */}
                <div className="md:col-span-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-lg text-2xl uppercase font-black text-[#231916] leading-tight">
                      {selectedFoodDetail.name}
                    </h3>
                    <div className="font-headline-lg text-xl font-black text-[#cb4926] mt-1">
                      ₹{selectedFoodDetail.price.toFixed(2)}
                    </div>
                    <p className="font-body-md text-xs text-[#59413b] mt-2.5 leading-relaxed font-medium">
                      {selectedFoodDetail.longDescription || selectedFoodDetail.description}
                    </p>

                    {/* Dietary Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {selectedFoodDetail.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-surface-container-high text-[#231916] font-label-sm text-[10px] uppercase font-bold"
                        >
                          {tag}
                        </span>
                      ))}
                      {selectedFoodDetail.vegetarian && (
                        <span className="px-2 py-0.5 rounded-full bg-[#caecbe] text-[#062105] font-label-sm text-[10px] uppercase font-bold border border-[#062105]/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> 100% Vegetarian
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Kitchen Ingredients List & Allergens */}
                  <div className="mt-4 p-3.5 bg-surface-container rounded-xl border border-outline-variant/50 text-xs space-y-1.5">
                    <p className="font-black uppercase text-[#231916] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-primary">restaurant</span>
                      Kitchen Ingredients:
                    </p>
                    <p className="text-[11px] text-[#59413b] leading-normal font-medium">
                      {selectedFoodDetail.ingredients?.join(' • ') || 'Premium farm ingredients, griddled with fresh spices.'}
                    </p>
                    <p className="text-[10px] text-on-surface-variant italic pt-1.5 border-t border-outline-variant/30">
                      Allergen Note: {selectedFoodDetail.allergens || 'Prepared in a kitchen that handles dairy, wheat, and eggs.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customization Options Section */}
              <div className="pt-4 border-t-2 border-dashed border-[#231916]/30 space-y-4">
                {/* 1. Choice of Side */}
                {selectedFoodDetail.sideChoices && selectedFoodDetail.sideChoices.length > 0 && (
                  <div>
                    <label className="text-xs font-black uppercase text-[#231916] flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#cb4926]">fastfood</span>
                        1. Side-Choice:
                      </span>
                      <span className="text-[10px] font-bold text-[#59413b] italic">Select one option</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedFoodDetail.sideChoices.map((side, i) => {
                        const isSelected = selectedSide?.name === side.name;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedSide(side)}
                            className={`p-2.5 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-[#cb4926] text-white border-[#231916] shadow-[2px_2px_0px_#231916]'
                                : 'bg-white text-[#231916] border-[#231916]/30 hover:border-[#231916]'
                            }`}
                          >
                            <span>{side.name}</span>
                            <span className="font-black">
                              {side.price === 0 ? 'Included' : `+₹${side.price.toFixed(2)}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Extra Addons & Toppings */}
                {selectedFoodDetail.extraChoices && selectedFoodDetail.extraChoices.length > 0 && (
                  <div>
                    <label className="text-xs font-black uppercase text-[#231916] flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#cb4926]">add_circle</span>
                        2. Extra Toppings &amp; Add-ons:
                      </span>
                      <span className="text-[10px] font-bold text-[#59413b] italic">Optional</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedFoodDetail.extraChoices.map((extra, i) => {
                        const isChecked = selectedAddons.some((a) => a.name === extra.name);
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              if (isChecked) {
                                setSelectedAddons((prev) => prev.filter((a) => a.name !== extra.name));
                              } else {
                                setSelectedAddons((prev) => [...prev, extra]);
                              }
                            }}
                            className={`p-2.5 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              isChecked
                                ? 'bg-[#ffdea7] text-[#231916] border-[#231916] shadow-[2px_2px_0px_#231916]'
                                : 'bg-white text-[#231916] border-[#231916]/30 hover:border-[#231916]'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm">
                                {isChecked ? 'check_box' : 'check_box_outline_blank'}
                              </span>
                              <span>{extra.name}</span>
                            </span>
                            <span className="font-black text-[#cb4926]">
                              {extra.price === 0 ? 'FREE' : `+₹${extra.price.toFixed(2)}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Special Kitchen Instructions */}
                <div>
                  <label className="text-xs font-black uppercase text-[#231916] flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-sm text-primary">edit_note</span>
                    3. Special Kitchen Instructions / Chef Notes:
                  </label>
                  <input
                    type="text"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    placeholder="e.g. Extra pickles, no onions, dressing on the side..."
                    className="w-full text-xs font-bold bg-white text-[#231916] px-3.5 py-2.5 rounded-xl border-2 border-[#231916]/40 focus:outline-none focus:border-[#cb4926]"
                  />
                </div>
              </div>
            </div>

            {/* Modal Sticky Bottom Action Footer */}
            <div className="bg-[#f7e4de] p-4 diner-border-thick border-x-0 border-b-0 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-black uppercase text-[#231916]">Quantity:</span>
                <div className="flex items-center diner-tag rounded-full bg-surface p-1 border-2 border-[#231916]">
                  <button
                    type="button"
                    onClick={() => setModalQty((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-bold text-sm hover:bg-secondary-fixed transition-colors cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-label-md text-sm font-black">
                    {modalQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalQty((prev) => prev + 1)}
                    className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-bold text-sm hover:bg-secondary-fixed transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAddModalSolo}
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-[#cb4926] text-white font-label-md text-xs font-black uppercase diner-tag hover:bg-[#a9310f] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:translate-x-0.5 active:translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-sm">person</span>
                  <span>Add to Order (₹{modalCalculatedTotal.toFixed(2)})</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddModalGroup}
                  className="flex-1 sm:flex-initial py-2.5 px-3.5 rounded-xl bg-[#ffdea7] text-[#231916] font-label-md text-xs font-black uppercase diner-tag hover:bg-[#fed388] transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#231916] shadow-sm active:translate-x-0.5 active:translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-sm">diversity_3</span>
                  <span>Group Tray</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Guest Check Drawer / Modal */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setCartDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-surface-container-low h-full overflow-y-auto z-10 diner-border-thick border-y-0 border-r-0 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Top Navigation Bar */}
              <div className="bg-[#231916] text-white p-3 px-4 flex items-center justify-between border-b-2 border-[#231916]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#fdc65c]">receipt_long</span>
                  <span className="font-headline-sm text-sm uppercase font-black text-white">
                    Order Guest Check
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCartDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close ticket"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              {/* Order Mode Tab Switcher atop the Ticket */}
              <div className="grid grid-cols-2 bg-[#ffdea7] p-1.5 diner-border-thick border-x-0 border-t-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setOrderMode('single');
                    triggerToast('Viewing Single Person Order check.');
                  }}
                  className={`py-2 px-2 rounded-lg font-label-md text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    orderMode === 'single'
                      ? 'bg-[#cb4926] text-white shadow-[2px_2px_0px_#231916]'
                      : 'bg-transparent text-[#231916] hover:bg-[#fed388]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">person</span>
                  <span>Solo Order ({soloCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrderMode('group');
                    triggerToast('Viewing Booth Group Check.');
                  }}
                  className={`py-2 px-2 rounded-lg font-label-md text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    orderMode === 'group'
                      ? 'bg-[#231916] text-[#fed388] shadow-[2px_2px_0px_rgba(0,0,0,0.3)]'
                      : 'bg-transparent text-[#231916] hover:bg-[#fed388]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">diversity_3</span>
                  <span>Booth #942 ({trayCount})</span>
                </button>
              </div>

              {/* Ticket Body */}
              <div className="p-4 flex flex-col gap-4 bg-surface-bright">
                {orderMode === 'single' ? (
                  /* ================= SOLO ORDER CHECK ================= */
                  <>
                    <div className="bg-[#f2dfd7] p-3 rounded-xl diner-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#cb4926] font-bold">receipt_long</span>
                        <div>
                          <span className="font-label-md text-xs uppercase font-black text-[#231916] block">
                            Solo Guest Check
                          </span>
                          <span className="text-[10px] text-[#59413b] font-bold">
                            Direct courier delivery • Personal Tray
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#cb4926] text-white font-label-sm text-xs font-bold diner-tag shadow-sm">
                        #SOLO-01
                      </span>
                    </div>

                    {/* Delivery Address Input */}
                    <div className="bg-surface-container rounded-xl p-3 diner-tag flex flex-col gap-1 border border-outline-variant/50">
                      <label className="text-[11px] font-black uppercase text-[#59413b] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#cb4926]">pin_drop</span>
                        Deliver Directly To:
                      </label>
                      <input
                        type="text"
                        value={soloAddress}
                        onChange={(e) => setSoloAddress(e.target.value)}
                        placeholder="Enter your delivery address..."
                        className="w-full text-xs font-bold bg-white text-[#231916] px-3 py-2 rounded-lg border border-[#231916]/40 focus:outline-none focus:border-[#cb4926]"
                      />
                    </div>

                    {/* Solo Items List */}
                    <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                      {soloItems.length === 0 ? (
                        <div className="text-center py-8 px-4 bg-surface-container rounded-xl diner-tag">
                          <span className="material-symbols-outlined text-3xl text-on-surface-variant/60 block mb-1">
                            lunch_dining
                          </span>
                          <p className="font-headline-sm text-xs font-bold uppercase text-on-surface">
                            Your Solo Order is Empty
                          </p>
                          <p className="text-[11px] text-on-surface-variant mt-1">
                            Click <span className="text-[#cb4926] font-black">"Add to Order"</span> on any menu card to add food!
                          </p>
                        </div>
                      ) : (
                        soloItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-surface-container rounded-xl p-2.5 diner-tag flex items-center justify-between gap-2 border border-outline-variant/40"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black uppercase text-on-surface truncate">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-on-surface-variant font-medium">
                                ₹{item.price.toFixed(2)} ea
                              </p>
                            </div>

                            {/* Solo Qty Stepper */}
                            <div className="flex items-center diner-tag rounded-full bg-surface p-0.5 border border-[#231916]/20">
                              <button
                                type="button"
                                onClick={() => handleSoloQtyChange(item.backendId, -1)}
                                className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center font-bold text-xs hover:bg-secondary-fixed transition-colors"
                              >
                                −
                              </button>
                              <span className="w-5 text-center text-xs font-bold">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleSoloQtyChange(item.backendId, 1)}
                                className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center font-bold text-xs hover:bg-secondary-fixed transition-colors"
                              >
                                +
                              </button>
                            </div>

                            {/* Total for item & delete */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="font-label-sm text-xs font-bold text-[#cb4926]">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSoloItem(item.backendId)}
                                className="text-on-surface-variant hover:text-error transition-colors p-0.5 rounded cursor-pointer"
                                title="Remove item"
                              >
                                <span className="material-symbols-outlined text-sm">close</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Perforated Bill Tear-Line */}
                    <div className="relative py-2 border-t-2 border-dashed border-on-surface/40 my-1">
                      <span className="absolute -top-2 -left-6 w-4 h-4 rounded-full bg-surface-container-highest"></span>
                      <span className="absolute -top-2 -right-6 w-4 h-4 rounded-full bg-surface-container-highest"></span>
                    </div>

                    {/* Bill Calculation */}
                    <div className="flex flex-col gap-1 font-label-md text-label-md text-on-surface">
                      <div className="flex justify-between text-xs">
                        <span>Items Subtotal ({soloCount})</span>
                        <span className="font-bold">₹{soloSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>Delivery Fee</span>
                        <span>
                          {soloSubtotal >= 35 || soloSubtotal === 0 ? (
                            <span className="text-tertiary font-bold">FREE (₹0.00)</span>
                          ) : (
                            <span>₹2.50</span>
                          )}
                        </span>
                      </div>
                      {soloSubtotal > 0 && soloSubtotal < 35 && (
                        <p className="text-[10px] text-tertiary font-semibold -mt-0.5">
                          Add ₹{(35 - soloSubtotal).toFixed(2)} more for FREE delivery!
                        </p>
                      )}
                      <div className="flex justify-between text-on-surface-variant text-xs">
                        <span>Estimated Tax (8.25%)</span>
                        <span>₹{soloTax.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t-2 border-on-surface flex justify-between items-baseline font-headline-sm text-headline-sm">
                        <span className="uppercase">Solo Total</span>
                        <span className="text-[#cb4926] font-black" id="soloBillTotalAmount">
                          ₹{soloGrandTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleSingleOrderCheckout}
                        disabled={isOrdering || soloItems.length === 0}
                        className="w-full py-3 rounded-xl bg-[#cb4926] text-white font-label-lg text-label-lg uppercase tracking-wider diner-border hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined">shopping_bag</span>
                        <span>
                          {isOrdering
                            ? 'Placing Order...'
                            : `Place Solo Delivery Order (₹${soloGrandTotal.toFixed(2)})`}
                        </span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* ================= GROUP ORDER CHECK ================= */
                  <>
                    <div className="bg-secondary-container p-3 rounded-xl diner-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary font-bold">receipt</span>
                        <div>
                          <span className="font-label-md text-xs uppercase font-black tracking-wider text-on-secondary-container block">
                            Sally's Office Lunch
                          </span>
                          <span className="text-[10px] text-on-secondary-container/80 font-bold">
                            Host: Sally W. • 4 Friends
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-surface text-primary font-label-sm text-xs font-bold diner-tag">
                        #TABLE-04
                      </span>
                    </div>

                    {/* Member Breakdown */}
                    <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                      <div className="bg-surface-container rounded-lg p-2.5 diner-tag">
                        <div className="flex items-center justify-between text-xs font-bold uppercase mb-1">
                          <span className="flex items-center gap-1.5 text-primary">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                            Sally (Host)
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px]">
                            Locked • ₹19.45
                          </span>
                        </div>
                        <ul className="text-xs text-on-surface space-y-1">
                          <li className="flex justify-between">
                            <span>1x The Route 66 Double Smash</span>
                            <span className="font-bold">₹12.95</span>
                          </li>
                          <li className="flex justify-between text-on-surface-variant">
                            <span>1x Crinkle Loaded Fries</span>
                            <span className="font-bold">₹6.50</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-surface-container rounded-lg p-2.5 diner-tag">
                        <div className="flex items-center justify-between text-xs font-bold uppercase mb-1">
                          <span className="flex items-center gap-1.5 text-secondary">
                            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                            Dave
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px]">
                            Ready • ₹14.25
                          </span>
                        </div>
                        <ul className="text-xs text-on-surface space-y-1">
                          <li className="flex justify-between">
                            <span>1x Avocado Green Goddess</span>
                            <span className="font-bold">₹14.25</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-surface-container rounded-lg p-2.5 diner-tag">
                        <div className="flex items-center justify-between text-xs font-bold uppercase mb-1">
                          <span className="flex items-center gap-1.5 text-tertiary">
                            <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                            Priya
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] animate-pulse">
                            Picking... • ₹13.00
                          </span>
                        </div>
                        <ul className="text-xs text-on-surface space-y-1">
                          <li className="flex justify-between">
                            <span>1x Neapolitan Malt Shake</span>
                            <span className="font-bold">₹7.00</span>
                          </li>
                          <li className="flex justify-between">
                            <span>1x Crispy Onion Rings</span>
                            <span className="font-bold">₹6.00</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Perforated Bill Tear-Line */}
                    <div className="relative py-2 border-t-2 border-dashed border-on-surface/40 my-1">
                      <span className="absolute -top-2 -left-6 w-4 h-4 rounded-full bg-surface-container-highest"></span>
                      <span className="absolute -top-2 -right-6 w-4 h-4 rounded-full bg-surface-container-highest"></span>
                    </div>

                    {/* Bill Calculation */}
                    <div className="flex flex-col gap-1 font-label-md text-label-md text-on-surface">
                      <div className="flex justify-between text-xs">
                        <span>Items Subtotal ({trayCount})</span>
                        <span>₹46.70</span>
                      </div>
                      <div className="flex justify-between text-xs text-tertiary font-bold">
                        <span>Group Perk (4+ Diners)</span>
                        <span>-₹5.00</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant text-xs">
                        <span>Shared Delivery</span>
                        <span className="text-tertiary font-bold">FREE (₹0.00)</span>
                      </div>
                      <div className="pt-2 border-t-2 border-on-surface flex justify-between items-baseline font-headline-sm text-headline-sm">
                        <span className="uppercase">Table Total</span>
                        <span className="text-primary font-bold">₹45.85</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleDirectCheckout}
                        disabled={isOrdering}
                        className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg uppercase tracking-wider diner-border hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-70"
                      >
                        <span className="material-symbols-outlined">receipt_long</span>
                        <span>{isOrdering ? 'Dispatching...' : 'Place Delivery Order (₹45.85)'}</span>
                      </button>
                      <Link
                        to="/group-ordering"
                        className="w-full py-2.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md uppercase diner-tag hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 text-center"
                      >
                        <span className="material-symbols-outlined text-base">diversity_3</span>
                        <span>Open Collab Booth Table</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Delivery Pin Note at Bottom of Drawer */}
            <div className="p-3 bg-surface-container-high border-t border-outline-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">pin_drop</span>
              <div className="text-left font-body-sm text-xs">
                <p className="font-bold text-on-surface">Delivering to:</p>
                <p className="text-on-surface-variant truncate">
                  {orderMode === 'single' ? soloAddress : '742 Evergreen Terrace, Floor 3 • Buzz #04'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      <div
        className={`fixed bottom-6 right-6 z-50 transform transition-transform duration-300 pointer-events-none ${
          showToast ? 'translate-y-0' : 'translate-y-32'
        }`}
      >
        <div className="bg-secondary-container text-on-secondary-container px-space-md py-3 rounded-xl diner-border-thick flex items-center gap-3 shadow-2xl">
          <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
          <p className="font-label-md text-label-md font-bold">{toastMessage}</p>
        </div>
      </div>
    </div>
  );
}
