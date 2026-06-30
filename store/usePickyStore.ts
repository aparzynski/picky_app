import { create } from 'zustand'

export type Ingredient = {
  name: string
  state: 'in pantry' | 'missing item' | 'added to grocery list'
}

export type RecipeAccordionData = {
  color: 'yellow' | 'purple'
  title: string
  body: string
  ctaLabel?: string
}

export type Recipe = {
  id: string
  name: string
  description: string
  cookTime: number
  serves: number
  rating?: number
  calories?: number
  tags: string[]
  imageUrl: string
  ingredients?: Ingredient[]
  accordions?: RecipeAccordionData[]
  instructions?: string[]
}

type DayTile = {
  date: string
  dayLabel: string
  emojis?: string[]
  mealCount: number
  isToday: boolean
}

type EarlNudge = {
  variant: 'plan-day' | 'setup-pantry' | 'staple-reminder'
  message: string
  ctaLabel: string
}

type DiscoverCategoryData = {
  id: string
  title: string
  recipeIds: string[]
}

type PickyState = {
  userName: string
  tonightsMeal: Recipe
  isTonight: boolean
  weekTiles: DayTile[]
  familyFavorites: Recipe[]
  groceryItemCount: number
  recipesCount: number
  expiredItemCount: number
  earlNudge: EarlNudge
  discoverCategories: DiscoverCategoryData[]
  recipes: Record<string, Recipe>
}

export const usePickyStore = create<PickyState>(() => ({
  userName: 'Sarah',
  tonightsMeal: {
    id: 'r1',
    name: 'Creamy Tuscan Pasta',
    description: 'Rich and comforting — a family favourite with lots of leftovers.',
    cookTime: 35,
    serves: 6,
    rating: 4.8,
    calories: 520,
    tags: ['Lots of leftovers', "Noah's favorite"],
    imageUrl: '/mock/pasta.jpg',
    ingredients: [
      { name: '1 lb penne pasta', state: 'in pantry' },
      { name: '2 cups heavy cream', state: 'in pantry' },
      { name: '1 cup sundried tomatoes', state: 'missing item' },
      { name: '3 cloves garlic', state: 'in pantry' },
      { name: '2 cups baby spinach', state: 'missing item' },
      { name: '½ cup parmesan', state: 'missing item' },
      { name: '2 tbsp olive oil', state: 'in pantry' },
      { name: 'Salt and black pepper', state: 'in pantry' },
    ],
    accordions: [
      {
        color: 'yellow',
        title: '🌟 New food alert for Noah',
        body: 'Spinach is hidden in the sauce here — great sneaky introduction to a new green!',
      },
      {
        color: 'purple',
        title: '🌟 Customized for your family',
        body: 'Sundried tomatoes swapped for fresh cherry tomatoes for Lily. Served without cream for David.',
        ctaLabel: 'See all changes',
      },
    ],
    instructions: [
      'Cook pasta in salted boiling water until al dente. Reserve 1 cup pasta water.',
      'Heat olive oil in a large skillet over medium heat. Add garlic and cook for 1 minute.',
      'Add sundried tomatoes and cook for 2 minutes until fragrant.',
      'Pour in heavy cream and simmer for 3-4 minutes until slightly thickened.',
      'Add spinach and stir until wilted.',
      'Toss in cooked pasta with pasta water as needed. Season generously.',
      'Top with parmesan and serve immediately.',
    ],
  },
  isTonight: true,
  weekTiles: [
    { date: '2026-07-02', dayLabel: 'Thu', emojis: ['🧀'], mealCount: 1, isToday: true },
    { date: '2026-07-03', dayLabel: 'Fri', emojis: [],     mealCount: 0, isToday: false },
    { date: '2026-07-04', dayLabel: 'Sat', emojis: ['🍕', '🥗', '🥗'], mealCount: 3, isToday: false },
    { date: '2026-07-05', dayLabel: 'Sun', emojis: ['🍕', '🥗'],       mealCount: 2, isToday: false },
    { date: '2026-07-06', dayLabel: 'Mon', emojis: ['🍗'],  mealCount: 1, isToday: false },
  ],
  familyFavorites: [
    { id: 'r2', name: 'Silky Butter Pasta',      description: "Lily's safe food.",     cookTime: 15, serves: 6, tags: ['Lily-Approved 💜'], imageUrl: '/mock/pasta.jpg'    },
    { id: 'r3', name: 'Veggie Stir-Fry',     description: 'Mia-friendly, fully vegan.', cookTime: 25, serves: 6, tags: ['Vegan'],         imageUrl: '/mock/stirfry.jpg'  },
    { id: 'r4', name: 'Meatloaf & Potatoes', description: "David's pick.",          cookTime: 55, serves: 6, tags: ['Hearty'],         imageUrl: '/mock/meatloaf.jpg' },
  ],
  groceryItemCount: 14,
  recipesCount: 14,
  expiredItemCount: 4,
  earlNudge: {
    variant: 'staple-reminder',
    message: "You haven't made French toast casserole in a month 👀",
    ctaLabel: 'Add it back →',
  },
  discoverCategories: [
    { id: 'cat-1', title: 'Earl Suggests',      recipeIds: ['d1', 'd2', 'd3', 'd4'] },
    { id: 'cat-2', title: "Father's Day Dinner", recipeIds: ['d5', 'd6', 'd7', 'd8'] },
    { id: 'cat-3', title: 'Quick & Easy',        recipeIds: ['d9', 'd10', 'd11', 'd12'] },
    { id: 'cat-4', title: 'Less Dishes',         recipeIds: ['d13', 'd14', 'd15', 'd16'] },
    { id: 'cat-5', title: 'Saved Recipes',       recipeIds: ['d17', 'd18', 'd19', 'd20'] },
  ],
  recipes: {
    r1: {
      id: 'r1',
      name: 'Creamy Tuscan Pasta',
      description: 'Rich and comforting — a family favourite with lots of leftovers.',
      cookTime: 35,
      serves: 6,
      rating: 4.8,
      calories: 520,
      tags: ['Lots of leftovers', "Noah's favorite"],
      imageUrl: '/mock/pasta.jpg',
      ingredients: [
        { name: '1 lb penne pasta', state: 'in pantry' },
        { name: '2 cups heavy cream', state: 'in pantry' },
        { name: '1 cup sundried tomatoes', state: 'missing item' },
        { name: '3 cloves garlic', state: 'in pantry' },
        { name: '2 cups baby spinach', state: 'missing item' },
        { name: '½ cup parmesan', state: 'missing item' },
        { name: '2 tbsp olive oil', state: 'in pantry' },
        { name: 'Salt and black pepper', state: 'in pantry' },
      ],
      accordions: [
        {
          color: 'yellow',
          title: '🌟 New food alert for Noah',
          body: 'Spinach is hidden in the sauce here — great sneaky introduction to a new green!',
        },
        {
          color: 'purple',
          title: '🌟 Customized for your family',
          body: 'Sundried tomatoes swapped for fresh cherry tomatoes for Lily. Served without cream for David.',
          ctaLabel: 'See all changes',
        },
      ],
      instructions: [
        'Cook pasta in salted boiling water until al dente. Reserve 1 cup pasta water.',
        'Heat olive oil in a large skillet over medium heat. Add garlic and cook for 1 minute.',
        'Add sundried tomatoes and cook for 2 minutes until fragrant.',
        'Pour in heavy cream and simmer for 3-4 minutes until slightly thickened.',
        'Add spinach and stir until wilted.',
        'Toss in cooked pasta with pasta water as needed. Season generously.',
        'Top with parmesan and serve immediately.',
      ],
    },
    r2: {
      id: 'r2',
      name: 'Silky Butter Pasta',
      description: "Lily's ultimate safe food — simple, buttery, and always a win.",
      cookTime: 15,
      serves: 6,
      calories: 320,
      tags: ['Lily-Approved 💜'],
      imageUrl: '/mock/pasta.jpg',
      ingredients: [
        { name: '1 lb pasta', state: 'in pantry' },
        { name: '4 tbsp butter', state: 'in pantry' },
        { name: 'Salt', state: 'in pantry' },
        { name: 'Parmesan (optional)', state: 'in pantry' },
      ],
      instructions: [
        'Cook pasta in salted boiling water until al dente.',
        'Drain and return to the pot.',
        'Add butter and toss until fully melted and coated.',
        'Season with salt. Top with parmesan if desired.',
      ],
    },
    r3: {
      id: 'r3',
      name: 'Veggie Stir-Fry',
      description: 'Mia-friendly and fully vegan — a colorful pan full of crunch and flavor.',
      cookTime: 25,
      serves: 6,
      calories: 280,
      tags: ['Vegan'],
      imageUrl: '/mock/stirfry.jpg',
      ingredients: [
        { name: '2 cups broccoli florets', state: 'in pantry' },
        { name: '1 red bell pepper', state: 'missing item' },
        { name: '1 cup snap peas', state: 'missing item' },
        { name: '2 tbsp soy sauce', state: 'in pantry' },
        { name: '1 tbsp sesame oil', state: 'in pantry' },
        { name: '2 cloves garlic', state: 'in pantry' },
      ],
      instructions: [
        'Heat sesame oil in a wok over high heat.',
        'Add garlic and cook for 30 seconds.',
        'Add broccoli and bell pepper. Stir-fry for 3 minutes.',
        'Add snap peas and soy sauce. Toss for another 2 minutes.',
        'Serve over steamed rice.',
      ],
    },
    r4: {
      id: 'r4',
      name: 'Meatloaf & Potatoes',
      description: "David's pick — hearty, satisfying, and perfect for leftovers.",
      cookTime: 55,
      serves: 6,
      calories: 610,
      tags: ['Hearty'],
      imageUrl: '/mock/meatloaf.jpg',
      ingredients: [
        { name: '1.5 lb ground beef', state: 'missing item' },
        { name: '1 egg', state: 'in pantry' },
        { name: '½ cup breadcrumbs', state: 'in pantry' },
        { name: '¼ cup ketchup', state: 'in pantry' },
        { name: '4 russet potatoes', state: 'missing item' },
        { name: '2 tbsp butter', state: 'in pantry' },
        { name: 'Salt and pepper', state: 'in pantry' },
      ],
      instructions: [
        'Preheat oven to 375°F (190°C).',
        'Mix ground beef, egg, breadcrumbs, and salt in a bowl.',
        'Shape into a loaf in a baking dish. Top with ketchup.',
        'Bake for 45-50 minutes until internal temp reaches 160°F.',
        'Meanwhile, boil potatoes until tender. Mash with butter and salt.',
        'Slice meatloaf and serve alongside mashed potatoes.',
      ],
    },
    d1: {
      id: 'd1', name: 'Mini Pizza Cups', cookTime: 30, serves: 4, imageUrl: '/mock/meatloaf.jpg',
      description: 'Crispy mini pizzas loaded with sauce and melty cheese — ready in 30 minutes and always a crowd pleaser.',
      tags: ['🍕 Savory', 'Kid Favorite'],
      ingredients: [
        { name: '1 can refrigerated pizza dough', state: 'in pantry' },
        { name: '1/2 cup pizza sauce', state: 'in pantry' },
        { name: '1 cup shredded mozzarella', state: 'missing item' },
        { name: '1/4 cup mini pepperoni', state: 'missing item' },
        { name: '1 tsp Italian seasoning', state: 'in pantry' },
        { name: 'olive oil spray', state: 'in pantry' },
      ],
      instructions: [
        'Preheat oven to 400°F (200°C). Lightly grease a 12-cup muffin tin.',
        'Press pizza dough into each muffin cup, covering the bottom and sides.',
        'Spoon 1–2 tsp pizza sauce into each cup.',
        'Top with mozzarella and pepperoni. Sprinkle with Italian seasoning.',
        'Bake 12–14 minutes until edges are golden and cheese is bubbly.',
        'Cool 2 minutes before removing from the tin.',
      ],
    },
    d2: {
      id: 'd2', name: 'Bright Lemon Spaghetti', cookTime: 20, serves: 4, imageUrl: '/mock/pasta.jpg',
      description: 'Bright, zesty, and weeknight-fast. Al dente spaghetti tossed in a silky lemon-garlic oil with a shower of parmesan.',
      tags: ['🌿 Vegetarian', 'Quick Weeknight'],
      ingredients: [
        { name: '12 oz spaghetti', state: 'in pantry' },
        { name: '4 cloves garlic, minced', state: 'in pantry' },
        { name: '1 lemon, zested and juiced', state: 'missing item' },
        { name: '1/4 cup olive oil', state: 'in pantry' },
        { name: '1/4 cup parmesan', state: 'missing item' },
        { name: 'salt and red pepper flakes', state: 'in pantry' },
      ],
      instructions: [
        'Cook spaghetti in salted boiling water until al dente. Reserve 1/4 cup pasta water before draining.',
        'Heat olive oil in a skillet over medium heat. Add garlic and cook 1 minute until fragrant.',
        'Add lemon zest and a pinch of red pepper flakes. Stir 30 seconds.',
        'Add drained pasta and lemon juice. Toss to coat.',
        'Add pasta water a splash at a time until the sauce is silky.',
        'Season with salt. Top with parmesan and serve immediately.',
      ],
    },
    d3: {
      id: 'd3', name: 'Mango Coconut Rice Bowl', cookTime: 10, serves: 2, imageUrl: '/mock/stirfry.jpg',
      description: 'Creamy coconut milk poured over rice and piled with fresh mango. Tropical, dairy-free, and ready in 10 minutes.',
      tags: ['🥥 Tropical', 'Dairy-Free', 'No Cook'],
      ingredients: [
        { name: '2 ripe mangoes, diced', state: 'missing item' },
        { name: '1 can (13.5 oz) coconut milk', state: 'in pantry' },
        { name: '1 cup cooked rice', state: 'in pantry' },
        { name: '1 tbsp honey', state: 'in pantry' },
        { name: '1 lime, juiced', state: 'missing item' },
        { name: 'shredded coconut for topping', state: 'in pantry' },
      ],
      instructions: [
        'Divide cooked rice between two bowls.',
        'Whisk coconut milk with honey and lime juice.',
        'Pour coconut milk mixture over rice.',
        'Top with diced mango and shredded coconut.',
        'Serve immediately or refrigerate for up to 1 day.',
      ],
    },
    d4: {
      id: 'd4', name: 'Honey Teriyaki Salmon', cookTime: 25, serves: 4, imageUrl: '/mock/stirfry.jpg',
      description: 'Pan-seared salmon fillets glazed in a sweet-savory teriyaki sauce. Weeknight-friendly and ready in under 30 minutes.',
      tags: ['🐟 Seafood', 'Healthy', 'Weeknight'],
      ingredients: [
        { name: '4 salmon fillets (6 oz each)', state: 'missing item' },
        { name: '1/4 cup soy sauce', state: 'in pantry' },
        { name: '2 tbsp honey', state: 'in pantry' },
        { name: '1 tbsp rice vinegar', state: 'in pantry' },
        { name: '2 cloves garlic, minced', state: 'in pantry' },
        { name: '1 tsp sesame oil', state: 'in pantry' },
        { name: '1 tbsp sesame seeds', state: 'missing item' },
      ],
      instructions: [
        'Whisk soy sauce, honey, rice vinegar, garlic, and sesame oil to make the teriyaki glaze.',
        'Marinate salmon in half the glaze for 15 minutes.',
        'Heat a skillet over medium-high heat. Sear salmon skin-side up for 3–4 minutes.',
        'Flip and cook 3–4 more minutes until cooked through.',
        'Pour remaining glaze over salmon and cook 1 minute until sticky.',
        'Garnish with sesame seeds and serve over steamed rice.',
      ],
    },
    d5: {
      id: 'd5', name: 'Cast Iron Ribeye', cookTime: 45, serves: 2, imageUrl: '/mock/meatloaf.jpg',
      description: 'Thick-cut ribeye seared in a screaming-hot cast iron and basted in garlic butter. A special-occasion classic.',
      tags: ['🥩 Beef', 'Special Occasion', 'High Protein'],
      ingredients: [
        { name: '2 ribeye steaks (1 inch thick)', state: 'missing item' },
        { name: '2 tbsp butter', state: 'in pantry' },
        { name: '3 cloves garlic', state: 'in pantry' },
        { name: '2 sprigs fresh rosemary', state: 'missing item' },
        { name: 'salt and black pepper', state: 'in pantry' },
        { name: '1 tbsp olive oil', state: 'in pantry' },
      ],
      instructions: [
        'Remove steaks from refrigerator 30 minutes before cooking. Season generously with salt and pepper.',
        'Heat a cast iron skillet over high heat until smoking.',
        'Add olive oil, then steaks. Sear 3–4 minutes per side for medium-rare.',
        'Add butter, garlic, and rosemary. Tilt the pan and baste steaks with butter for 2 minutes.',
        'Rest on a cutting board for 10 minutes before slicing and serving.',
      ],
    },
    d6: {
      id: 'd6', name: 'Slow-Baked BBQ Ribs', cookTime: 120, serves: 4, imageUrl: '/mock/meatloaf.jpg',
      description: 'Low-and-slow oven-baked ribs with a homemade dry rub, finished with sticky BBQ glaze. Worth every minute.',
      tags: ['🔥 BBQ', 'Weekend Project', 'Crowd Pleaser'],
      ingredients: [
        { name: '2 racks baby back ribs', state: 'missing item' },
        { name: '1/2 cup BBQ sauce', state: 'in pantry' },
        { name: '2 tbsp brown sugar', state: 'in pantry' },
        { name: '1 tbsp smoked paprika', state: 'in pantry' },
        { name: '1 tsp garlic powder', state: 'in pantry' },
        { name: 'salt and black pepper', state: 'in pantry' },
      ],
      instructions: [
        'Preheat oven to 300°F (150°C). Remove the membrane from the back of the ribs.',
        'Mix brown sugar, paprika, garlic powder, salt, and pepper to make the dry rub.',
        'Coat ribs generously on all sides with the dry rub.',
        'Wrap tightly in foil and bake for 2 hours until very tender.',
        'Unwrap and brush both sides with BBQ sauce.',
        'Broil or grill for 5–10 minutes until the glaze is caramelized.',
        'Cut between bones and serve with extra sauce on the side.',
      ],
    },
    d7: {
      id: 'd7', name: 'Crispy Smash Potatoes', cookTime: 35, serves: 4, imageUrl: '/mock/meatloaf.jpg',
      description: 'Boiled baby potatoes smashed flat and roasted until crispy, topped with crumbled bacon and chives.',
      tags: ['🥔 Comfort', 'Crowd Pleaser'],
      ingredients: [
        { name: '1.5 lb baby potatoes', state: 'missing item' },
        { name: '4 strips bacon', state: 'missing item' },
        { name: '2 tbsp olive oil', state: 'in pantry' },
        { name: '1/2 tsp garlic powder', state: 'in pantry' },
        { name: 'salt and pepper', state: 'in pantry' },
        { name: '2 tbsp chives, chopped', state: 'missing item' },
        { name: 'sour cream for serving', state: 'in pantry' },
      ],
      instructions: [
        'Boil potatoes in salted water until just tender, about 15 minutes. Drain.',
        'Cook bacon in a skillet until crispy. Crumble and set aside.',
        'Preheat oven to 425°F (220°C). Arrange potatoes on a greased baking sheet.',
        'Smash each potato flat with the bottom of a glass.',
        'Drizzle with olive oil. Season with garlic powder, salt, and pepper.',
        'Bake 20–25 minutes until golden and crispy.',
        'Top with crumbled bacon and chives. Serve with sour cream.',
      ],
    },
    d8: {
      id: 'd8', name: 'Fully Loaded Baked Potato', cookTime: 50, serves: 4, imageUrl: '/mock/meatloaf.jpg',
      description: 'Fluffy russet potatoes baked until their skins are crisp, then piled high with all the toppings.',
      tags: ['🥔 Hearty', 'Comfort Food'],
      ingredients: [
        { name: '4 large russet potatoes', state: 'missing item' },
        { name: '4 tbsp butter', state: 'in pantry' },
        { name: '1/2 cup sour cream', state: 'in pantry' },
        { name: '1 cup shredded cheddar', state: 'missing item' },
        { name: '4 strips bacon, cooked and crumbled', state: 'missing item' },
        { name: '2 tbsp chives, chopped', state: 'missing item' },
        { name: 'salt', state: 'in pantry' },
      ],
      instructions: [
        'Preheat oven to 400°F (200°C). Scrub potatoes and pat dry.',
        'Prick each potato several times with a fork. Rub with oil and salt.',
        'Bake directly on the oven rack for 45–50 minutes until a fork slides in easily.',
        'Slice each potato open and fluff the flesh with a fork.',
        'Add a pat of butter, then top with cheddar, sour cream, bacon, and chives.',
        'Serve immediately.',
      ],
    },
    d9: {
      id: 'd9', name: 'Everything Avocado Toast', cookTime: 5, serves: 1, imageUrl: '/mock/pasta.jpg',
      description: 'Creamy mashed avocado on crispy sourdough, seasoned with everything bagel and a pinch of chili flakes.',
      tags: ['🥑 Healthy', 'Quick Breakfast', 'Vegetarian'],
      ingredients: [
        { name: '2 slices sourdough bread', state: 'in pantry' },
        { name: '1 ripe avocado', state: 'missing item' },
        { name: '1 lemon wedge', state: 'missing item' },
        { name: '1/2 tsp everything bagel seasoning', state: 'in pantry' },
        { name: 'pinch of red pepper flakes', state: 'in pantry' },
        { name: '1 egg (optional)', state: 'in pantry' },
      ],
      instructions: [
        'Toast sourdough until golden and crisp.',
        'Halve the avocado, remove the pit, and scoop flesh into a bowl.',
        'Mash with a fork. Squeeze lemon over and mix to combine.',
        'Spread avocado mixture on toasted bread.',
        'Sprinkle with everything bagel seasoning and red pepper flakes.',
        'Top with a fried egg if desired. Serve immediately.',
      ],
    },
    d10: {
      id: 'd10', name: 'Fresh Garden Caprese', cookTime: 10, serves: 4, imageUrl: '/mock/pasta.jpg',
      description: 'Layers of fresh mozzarella, ripe tomatoes, and basil leaves drizzled with olive oil and balsamic glaze.',
      tags: ['🌿 Vegetarian', 'No Cook', 'Summer'],
      ingredients: [
        { name: '3 large tomatoes, sliced', state: 'missing item' },
        { name: '8 oz fresh mozzarella, sliced', state: 'missing item' },
        { name: '1/4 cup fresh basil leaves', state: 'missing item' },
        { name: '2 tbsp extra virgin olive oil', state: 'in pantry' },
        { name: '1 tbsp balsamic glaze', state: 'in pantry' },
        { name: 'salt and black pepper', state: 'in pantry' },
      ],
      instructions: [
        'Alternate tomato and mozzarella slices on a serving plate.',
        'Tuck basil leaves between the slices.',
        'Drizzle with olive oil and balsamic glaze.',
        'Season with salt and black pepper.',
        'Serve immediately at room temperature.',
      ],
    },
    d11: {
      id: 'd11', name: 'Garlic Shrimp Stir-Fry', cookTime: 15, serves: 4, imageUrl: '/mock/stirfry.jpg',
      description: 'Tender shrimp and crisp vegetables tossed in a savory garlic-soy sauce over steamed rice.',
      tags: ['🦐 Seafood', 'Quick Weeknight', 'High Protein'],
      ingredients: [
        { name: '1 lb large shrimp, peeled and deveined', state: 'missing item' },
        { name: '2 cups broccoli florets', state: 'in pantry' },
        { name: '1 red bell pepper, sliced', state: 'missing item' },
        { name: '3 cloves garlic, minced', state: 'in pantry' },
        { name: '3 tbsp soy sauce', state: 'in pantry' },
        { name: '1 tbsp sesame oil', state: 'in pantry' },
        { name: '1 tsp cornstarch', state: 'in pantry' },
      ],
      instructions: [
        'Toss shrimp lightly with cornstarch, salt, and pepper.',
        'Heat oil in a wok over high heat until smoking.',
        'Add shrimp and cook 1–2 minutes per side until pink. Remove and set aside.',
        'Add garlic, broccoli, and bell pepper. Stir-fry 3 minutes until just tender.',
        'Return shrimp to wok. Add soy sauce and sesame oil.',
        'Toss everything together for 1 minute. Serve over steamed rice.',
      ],
    },
    d12: {
      id: 'd12', name: 'Mediterranean Omelet', cookTime: 10, serves: 1, imageUrl: '/mock/pasta.jpg',
      description: 'Fluffy eggs stuffed with crumbled feta, kalamata olives, and wilted spinach. High protein, low carb.',
      tags: ['🍳 Protein', 'Low Carb', 'Breakfast'],
      ingredients: [
        { name: '3 large eggs', state: 'in pantry' },
        { name: '1/4 cup crumbled feta', state: 'missing item' },
        { name: '1/4 cup baby spinach', state: 'missing item' },
        { name: '6 kalamata olives, halved', state: 'missing item' },
        { name: '1 tbsp butter', state: 'in pantry' },
        { name: 'salt and pepper', state: 'in pantry' },
      ],
      instructions: [
        'Whisk eggs with salt and pepper until light and frothy.',
        'Melt butter in a non-stick skillet over medium heat.',
        'Pour in eggs and let them set for 30 seconds without stirring.',
        'Gently pull cooked edges toward the center, letting raw egg flow to the edges.',
        'When eggs are nearly set, scatter feta, spinach, and olives over one half.',
        'Fold the omelet over the filling. Slide onto a plate and serve.',
      ],
    },
    d13: {
      id: 'd13', name: 'One-Pan Roasted Salmon', cookTime: 25, serves: 4, imageUrl: '/mock/stirfry.jpg',
      description: 'Salmon fillets roasted alongside asparagus and cherry tomatoes on one pan — minimal cleanup, maximum flavor.',
      tags: ['🍳 One Pan', 'Healthy', 'Weeknight'],
      ingredients: [
        { name: '4 salmon fillets', state: 'missing item' },
        { name: '1 lb asparagus, trimmed', state: 'missing item' },
        { name: '1 cup cherry tomatoes', state: 'in pantry' },
        { name: '2 tbsp olive oil', state: 'in pantry' },
        { name: '2 cloves garlic, minced', state: 'in pantry' },
        { name: '1 lemon, sliced', state: 'missing item' },
        { name: 'salt and pepper', state: 'in pantry' },
      ],
      instructions: [
        'Preheat oven to 400°F (200°C). Line a baking sheet with foil.',
        'Arrange asparagus and tomatoes on the sheet. Drizzle with olive oil, season, and toss.',
        'Nestle salmon fillets among the vegetables.',
        'Top salmon with garlic and lemon slices. Season with salt and pepper.',
        'Roast 15–18 minutes until salmon flakes easily with a fork.',
        'Serve directly from the pan.',
      ],
    },
    d14: {
      id: 'd14', name: 'One-Pot Tomato Linguine', cookTime: 20, serves: 4, imageUrl: '/mock/pasta.jpg',
      description: 'Linguine, cherry tomatoes, garlic, and broth all cooked together in one pot until the starch creates a silky sauce.',
      tags: ['🥘 One Pot', 'Quick Weeknight', 'Vegetarian'],
      ingredients: [
        { name: '12 oz linguine', state: 'in pantry' },
        { name: '2 cups cherry tomatoes', state: 'in pantry' },
        { name: '4 cups vegetable broth', state: 'in pantry' },
        { name: '3 cloves garlic, sliced', state: 'in pantry' },
        { name: '1 tsp dried basil', state: 'in pantry' },
        { name: '2 tbsp olive oil', state: 'in pantry' },
        { name: '1/4 cup parmesan', state: 'missing item' },
      ],
      instructions: [
        'Add linguine, tomatoes, garlic, basil, olive oil, and broth to a large pot.',
        'Bring to a boil over high heat.',
        'Cook uncovered, stirring frequently, until pasta is al dente and broth is mostly absorbed, about 9 minutes.',
        'Season with salt and pepper.',
        'Stir in parmesan and serve immediately.',
      ],
    },
    d15: {
      id: 'd15', name: 'Berry Overnight Oats', cookTime: 5, serves: 1, imageUrl: '/mock/pasta.jpg',
      description: 'Five minutes of prep the night before gives you a creamy, ready-to-eat breakfast with zero morning effort.',
      tags: ['🥄 No Cook', 'Meal Prep', 'Breakfast'],
      ingredients: [
        { name: '1/2 cup rolled oats', state: 'in pantry' },
        { name: '1/2 cup milk', state: 'in pantry' },
        { name: '1/4 cup Greek yogurt', state: 'missing item' },
        { name: '1 tbsp chia seeds', state: 'in pantry' },
        { name: '1 tbsp maple syrup', state: 'in pantry' },
        { name: '1/2 cup fresh berries', state: 'missing item' },
      ],
      instructions: [
        'Combine oats, milk, yogurt, chia seeds, and maple syrup in a jar or container.',
        'Stir well to combine.',
        'Cover and refrigerate overnight or at least 4 hours.',
        'In the morning, stir and add a splash of milk if too thick.',
        'Top with fresh berries and serve cold.',
      ],
    },
    d16: {
      id: 'd16', name: 'Quinoa Power Bowl', cookTime: 15, serves: 2, imageUrl: '/mock/stirfry.jpg',
      description: 'Quinoa, roasted chickpeas, and crisp vegetables drizzled with a lemony tahini dressing. Great for meal prep.',
      tags: ['🥗 Prep Ahead', 'Vegan', 'High Fiber'],
      ingredients: [
        { name: '1 cup cooked quinoa', state: 'in pantry' },
        { name: '1 cup roasted chickpeas', state: 'missing item' },
        { name: '1 cup arugula', state: 'missing item' },
        { name: '1/2 cucumber, sliced', state: 'in pantry' },
        { name: '1/2 cup shredded carrots', state: 'in pantry' },
        { name: '2 tbsp tahini', state: 'missing item' },
        { name: '1 lemon, juiced', state: 'missing item' },
      ],
      instructions: [
        'Divide quinoa between two bowls.',
        'Arrange arugula, cucumber, carrots, and chickpeas over the quinoa.',
        'Whisk tahini with lemon juice, 2 tbsp water, salt, and pepper to make the dressing.',
        'Drizzle dressing over bowls.',
        'Serve immediately or store components separately for up to 3 days.',
      ],
    },
    d17: {
      id: 'd17', name: 'Brown Butter Egg Noodles', cookTime: 10, serves: 4, imageUrl: '/mock/pasta.jpg',
      description: 'Simple egg noodles tossed in melted butter with a hit of parmesan. The ultimate comfort food that everyone loves.',
      tags: ['🍝 Stovetop', 'Kid Favorite', 'Quick'],
      ingredients: [
        { name: '12 oz egg noodles', state: 'in pantry' },
        { name: '4 tbsp butter', state: 'in pantry' },
        { name: '1/4 cup parmesan (optional)', state: 'in pantry' },
        { name: 'salt and black pepper', state: 'in pantry' },
      ],
      instructions: [
        'Cook egg noodles in salted boiling water per package instructions.',
        'Drain, reserving 1/4 cup pasta water.',
        'Return noodles to the pot over low heat.',
        'Add butter and toss until fully melted and coating every noodle.',
        'Add a splash of pasta water if needed for glossiness.',
        'Season with salt and pepper. Top with parmesan if desired.',
      ],
    },
    d18: {
      id: 'd18', name: 'Golden Grilled Cheese', cookTime: 10, serves: 1, imageUrl: '/mock/meatloaf.jpg',
      description: 'Golden-brown buttery bread with perfectly melted cheese inside. Simple, satisfying, and impossible to mess up.',
      tags: ['🧀 Stovetop', 'Kid Favorite', 'Quick'],
      ingredients: [
        { name: '2 slices sandwich bread', state: 'in pantry' },
        { name: '2 slices cheddar or American cheese', state: 'missing item' },
        { name: '1 tbsp butter, softened', state: 'in pantry' },
      ],
      instructions: [
        'Spread butter on one side of each bread slice.',
        'Place one slice butter-side down in a cold skillet.',
        'Layer cheese on top. Place the second slice butter-side up.',
        'Cook over medium-low heat 3–4 minutes until the bottom is golden.',
        'Flip and cook 2–3 more minutes until both sides are golden and cheese is melted.',
        'Slice in half and serve hot.',
      ],
    },
    d19: {
      id: 'd19', name: 'Crispy Baked Nuggets', cookTime: 20, serves: 4, imageUrl: '/mock/meatloaf.jpg',
      description: 'Oven-baked nuggets with a crispy breadcrumb coating and juicy chicken inside. Healthier than takeout, loved by all.',
      tags: ['🔥 Oven', 'Kid Favorite', 'High Protein'],
      ingredients: [
        { name: '1.5 lb boneless chicken breast, cubed', state: 'missing item' },
        { name: '1/2 cup all-purpose flour', state: 'in pantry' },
        { name: '2 eggs, beaten', state: 'in pantry' },
        { name: '1 cup breadcrumbs', state: 'in pantry' },
        { name: '1/2 tsp garlic powder', state: 'in pantry' },
        { name: '1/2 tsp paprika', state: 'in pantry' },
        { name: 'salt and pepper', state: 'in pantry' },
      ],
      instructions: [
        'Preheat oven to 425°F (220°C). Line a baking sheet with parchment.',
        'Set up a breading station: flour in one bowl, eggs in another, breadcrumbs mixed with garlic powder, paprika, salt, and pepper in a third.',
        'Coat each chicken piece in flour, then egg, then the seasoned breadcrumbs.',
        'Arrange on baking sheet in a single layer.',
        'Bake 12–15 minutes, flipping halfway, until golden and cooked through.',
        'Serve with ketchup or your dipping sauce of choice.',
      ],
    },
    d20: {
      id: 'd20', name: 'Fluffy Saturday Pancakes', cookTime: 15, serves: 4, imageUrl: '/mock/pasta.jpg',
      description: 'Light, fluffy classic pancakes made with pantry staples. Perfect weekend morning fuel with butter and maple syrup.',
      tags: ['🥞 Stovetop', 'Kid Favorite', 'Breakfast'],
      ingredients: [
        { name: '1.5 cups all-purpose flour', state: 'in pantry' },
        { name: '2 tsp baking powder', state: 'in pantry' },
        { name: '2 tbsp sugar', state: 'in pantry' },
        { name: '1/4 tsp salt', state: 'in pantry' },
        { name: '1 cup milk', state: 'in pantry' },
        { name: '1 large egg', state: 'in pantry' },
        { name: '2 tbsp melted butter', state: 'in pantry' },
      ],
      instructions: [
        'Whisk flour, baking powder, sugar, and salt in a large bowl.',
        'In a separate bowl, whisk milk, egg, and melted butter.',
        'Pour wet ingredients into dry and stir until just combined — lumps are fine, do not overmix.',
        'Heat a skillet or griddle over medium heat. Lightly butter the surface.',
        'Pour 1/4 cup batter per pancake. Cook until bubbles form on the surface and edges look set, about 2 minutes.',
        'Flip and cook 1–2 more minutes until golden.',
        'Serve with butter and maple syrup.',
      ],
    },
    r5: {
      id: 'r5',
      name: 'Garden Confetti Pasta',
      description: 'A vibrant tangle of zucchini ribbons, cherry tomatoes, roasted peppers, purple cabbage, and sweet corn tossed in a bright lemon-herb dressing. Every forkful is a burst of color and garden-fresh flavor.',
      cookTime: 20,
      serves: 4,
      rating: 4.8,
      calories: 420,
      tags: ['🍝 Lots of leftovers', "👦🏼 Noah's favorite"],
      imageUrl: '/mock/pasta.jpg',
      ingredients: [
        { name: '1 lb pasta', state: 'in pantry' },
        { name: '2 cups cherry tomatoes', state: 'in pantry' },
        { name: '1 zucchini, diced', state: 'missing item' },
        { name: '1 cucumber, diced', state: 'missing item' },
        { name: '3 cloves garlic', state: 'in pantry' },
        { name: '2 tbsp olive oil', state: 'in pantry' },
        { name: '1/4 cup parmesan', state: 'missing item' },
        { name: 'salt and pepper', state: 'in pantry' },
      ],
      accordions: [
        {
          color: 'yellow',
          title: '🌟 New food alert for Noah',
          body: 'Zucchini is hidden in this recipe — great sneaky intro!',
        },
        {
          color: 'purple',
          title: '🌟 Customized for your family',
          body: 'Avocado swapped for cucumber for Lily.',
          ctaLabel: 'See all changes',
        },
      ],
      instructions: [
        'Cook pasta in salted boiling water until al dente. Reserve ½ cup pasta water.',
        'Heat olive oil in a large skillet over medium-high heat.',
        'Add garlic and cook for 1 minute until fragrant.',
        'Add cherry tomatoes, zucchini, and red bell pepper. Sauté for 5-7 minutes.',
        'Toss in cooked pasta with a splash of pasta water.',
        'Season generously with salt and pepper.',
        'Top with parmesan and serve immediately.',
      ],
    },
  },
}))
