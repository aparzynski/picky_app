export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export type PlannerMeal = {
  type: MealType;
  name: string;
  emoji: string;
  cookTime: number;
  hasMeal: boolean;
  recipeId?: string;
  family?: string[];
};

export type PlannerDay = {
  id: string;
  name: string;
  date: string;
  isPast: boolean;
  isToday: boolean;
  meals: PlannerMeal[];
};

export type DayTile = {
  date: string;
  dayLabel: string;
  emojis: string[];
  mealCount: number;
  isToday: boolean;
};

export function noMeal(type: MealType): PlannerMeal {
  return { type, name: '', emoji: '', cookTime: 0, hasMeal: false };
}

export function hasMeal(
  type: MealType,
  name: string,
  emoji: string,
  cookTime: number,
  recipeId?: string,
  family?: string[],
): PlannerMeal {
  return { type, name, emoji, cookTime, hasMeal: true, recipeId, family };
}

// Meals by Mon-based day index (0=Mon…6=Sun this week, 7=Mon…13=Sun next week).
export const MEALS_BY_DAY_IDX: Record<number, PlannerMeal[]> = {
  // This week
  0: [hasMeal('BREAKFAST','Strawberry Chia Pudding','🍓',5,'pw1',['S','D','M','N','L']), hasMeal('LUNCH','Turkey & Avocado Wrap','🥑',10,'pw2',['S','M']), hasMeal('DINNER','Lemon Herb Sheet Pan Chicken','🍋',35,'pw3',['S','D','N','L'])],
  1: [hasMeal('BREAKFAST','Blueberry Smoothie Bowl','🫐',10,'pw4',['S','D','N','L']), hasMeal('LUNCH','Tomato Soup & Grilled Cheese','🍅',20,'pw5',['S','N','L']), hasMeal('DINNER','Creamy Tuscan Pasta','🍝',35,'r1',['S','D','M','N','L'])],
  2: [hasMeal('BREAKFAST','Cheesy Egg Muffins','🧀',25,'pw7',['S','D']), hasMeal('LUNCH','Rainbow Sushi Bowl','🍱',15,'pw8',['S','M']), hasMeal('DINNER','Honey Garlic Salmon Bowls','🐟',30,'pw6',['S','D','N','L'])],
  3: [hasMeal('BREAKFAST','Coconut Granola Parfait','🥥',5,'pw10',['S','D','M','N','L']), hasMeal('LUNCH','Turkey Club Sandwich','🥪',10,'pw11',['S','D']), hasMeal('DINNER','Slow Cooker Pulled Pork Tacos','🌮',360,'pw9',['S','D','N','L'])],
  4: [hasMeal('BREAKFAST','Cinnamon French Toast Sticks','🍞',25,'pw13',['S','D','M','N','L']), hasMeal('LUNCH','Sesame Noodle Salad','🍜',15,'pw14',['S','M']), hasMeal('DINNER','Pan-Seared Tilapia & Asparagus','🐟',25,'pw12',['S','D','M','N','L'])],
  5: [noMeal('BREAKFAST'), noMeal('LUNCH'), hasMeal('DINNER',"David's Birthday Burgers",'🎂',30,'pw16',['S','D','M','N','L'])],
  6: [noMeal('BREAKFAST'), noMeal('LUNCH'), hasMeal('DINNER','Sunday Roast Chicken','🍗',90,'pw17',['S','D','M','N','L'])],
  // Next week
  7:  [hasMeal('BREAKFAST','Banana Oatmeal','🍌',10,'lily8',['S','M','N','L']), hasMeal('LUNCH','Quinoa Power Bowl','🥗',15,'d16',['S','M']), hasMeal('DINNER','Cast Iron Ribeye','🥩',45,'d5',['S','D'])],
  8:  [hasMeal('BREAKFAST','Berry Overnight Oats','🫐',5,'d15',['S','D','M','N','L']), hasMeal('LUNCH','Fresh Garden Caprese','🍅',10,'d10',['S','M']), hasMeal('DINNER','Garlic Shrimp Stir-Fry','🦐',15,'d11',['S','D','N','L'])],
  9:  [hasMeal('BREAKFAST','Fluffy Pancakes','🥞',15,'d20',['S','D','M','N','L']), hasMeal('LUNCH','Mango Coconut Rice Bowl','🥥',10,'d3',['S','M']), hasMeal('DINNER','One-Pot Tomato Linguine','🍝',20,'d14',['S','D','M','N','L'])],
  10: [hasMeal('BREAKFAST','Everything Avocado Toast','🥑',5,'d9',['S','M']), hasMeal('LUNCH','One-Pan Roasted Salmon','🐟',25,'d13',['S','D','N','L']), hasMeal('DINNER','Meatloaf & Potatoes','🥔',55,'r4',['S','D','N','L'])],
  11: [hasMeal('BREAKFAST','Veggie Scrambled Eggs','🥚',10,'pw18',['S','D','M']), hasMeal('LUNCH','BLT Wrap','🥓',10,'pw19',['S','D']), hasMeal('DINNER','Mini Pizza Cups','🍕',30,'d1',['S','D','M','N','L'])],
  12: [noMeal('BREAKFAST'), noMeal('LUNCH'), hasMeal('DINNER','Slow-Baked BBQ Ribs','🔥',120,'d6',['S','D','N','L'])],
  13: [noMeal('BREAKFAST'), noMeal('LUNCH'), hasMeal('DINNER','Veggie Stir-Fry','🥦',25,'r3',['S','D','M','N','L'])],
};

export const DAY_IDS            = ['mon','tue','wed','thu','fri','sat','sun'] as const;
export const NEXT_WEEK_DAY_IDS  = ['mon2','tue2','wed2','thu2','fri2','sat2','sun2'] as const;
export const DAY_NAMES          = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] as const;
export const DAY_LABELS_SHORT   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const;

export const DAY_NAME_TO_IDX: Record<string, number> = {
  Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6,
};

export function getTodayIdx(): number {
  const dow = new Date().getDay();
  return dow === 0 ? 6 : dow - 1;
}

export function getDayIdByIdx(idx: number): string | null {
  if (idx < 0 || idx > 13) return null;
  return idx < 7 ? DAY_IDS[idx] : NEXT_WEEK_DAY_IDS[idx - 7];
}

export function getDayIdxById(id: string): number {
  const i1 = (DAY_IDS as readonly string[]).indexOf(id);
  if (i1 !== -1) return i1;
  const i2 = (NEXT_WEEK_DAY_IDS as readonly string[]).indexOf(id);
  if (i2 !== -1) return 7 + i2;
  return -1;
}

// Build the initial plannerMeals for the store — injects tonight's dinner.
export function buildInitialPlannerMeals(): Record<number, PlannerMeal[]> {
  const todayIdx = getTodayIdx();
  const result: Record<number, PlannerMeal[]> = {};
  for (let i = 0; i < 14; i++) {
    const base = MEALS_BY_DAY_IDX[i] ?? [noMeal('BREAKFAST'), noMeal('LUNCH'), noMeal('DINNER')];
    result[i] = i === todayIdx
      ? base.map((m) => m.type === 'DINNER'
          ? hasMeal('DINNER', 'Creamy Tuscan Pasta', '🍝', 35, 'r1', ['S','D','M','N','L'])
          : m)
      : [...base];
  }
  return result;
}

export function buildWeek(plannerMeals: Record<number, PlannerMeal[]>): {
  weekHeader: string;
  pastDays: PlannerDay[];
  weekdayDays: PlannerDay[];
  weekendDays: PlannerDay[];
  nextWeekHeader: string;
  nextWeekdayDays: PlannerDay[];
  nextWeekendDays: PlannerDay[];
} {
  const today = new Date();
  const dow = today.getDay();
  const todayIdx = dow === 0 ? 6 : dow - 1;

  const monday = new Date(today);
  monday.setDate(today.getDate() - todayIdx);
  monday.setHours(0, 0, 0, 0);

  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const weekHeader = `${fmt(dates[0])} – ${fmt(dates[6])}`;

  const plannerDays: PlannerDay[] = dates.map((date, i) => ({
    id: DAY_IDS[i],
    name: DAY_NAMES[i],
    date: fmt(date),
    isPast: i < todayIdx,
    isToday: i === todayIdx,
    meals: plannerMeals[i] ?? [noMeal('BREAKFAST'), noMeal('LUNCH'), noMeal('DINNER')],
  }));

  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);

  const nextDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(nextMonday);
    d.setDate(nextMonday.getDate() + i);
    return d;
  });

  const nextWeekHeader = `${fmt(nextDates[0])} – ${fmt(nextDates[6])}`;

  const nextPlannerDays: PlannerDay[] = nextDates.map((date, i) => ({
    id: NEXT_WEEK_DAY_IDS[i],
    name: DAY_NAMES[i],
    date: fmt(date),
    isPast: false,
    isToday: false,
    meals: plannerMeals[7 + i] ?? [noMeal('BREAKFAST'), noMeal('LUNCH'), noMeal('DINNER')],
  }));

  return {
    weekHeader,
    pastDays:         plannerDays.filter((_, i) => i < todayIdx),
    weekdayDays:      plannerDays.filter((_, i) => i >= todayIdx && i <= 4),
    weekendDays:      plannerDays.filter((_, i) => i >= 5),
    nextWeekHeader,
    nextWeekdayDays:  nextPlannerDays.filter((_, i) => i <= 4),
    nextWeekendDays:  nextPlannerDays.filter((_, i) => i >= 5),
  };
}

export function buildWeekTiles(plannerMeals: Record<number, PlannerMeal[]>): DayTile[] {
  const today = new Date();
  const dow = today.getDay();
  const todayIdx = dow === 0 ? 6 : dow - 1;

  const monday = new Date(today);
  monday.setDate(today.getDate() - todayIdx);
  monday.setHours(0, 0, 0, 0);

  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const meals = plannerMeals[i] ?? [noMeal('BREAKFAST'), noMeal('LUNCH'), noMeal('DINNER')];
    const planned = meals.filter((m) => m.hasMeal);
    return {
      date: fmt(d),
      dayLabel: DAY_LABELS_SHORT[i],
      emojis: planned.map((m) => m.emoji),
      mealCount: planned.length,
      isToday: i === todayIdx,
    };
  });
}
