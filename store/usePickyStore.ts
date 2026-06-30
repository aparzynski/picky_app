// store/usePickyStore.ts
import { create } from 'zustand'

type Recipe = {
  id: string
  name: string
  description: string
  cookTime: number
  serves: number
  rating?: number
  tags: string[]
  imageUrl: string
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
    tags: ['Lots of leftovers', "Noah's favorite"],
    imageUrl: '/mock/pasta.jpg',
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
    { id: 'r2', name: 'Buttered Pasta',      description: "Lily's safe food.",     cookTime: 15, serves: 6, tags: ['Lily-Approved 💜'], imageUrl: '/mock/pasta.jpg'    },
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
}))
