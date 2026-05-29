export interface SavedPreferences {
  senderName: string;
  senderPhone: string;
  defaultLocation: string;
  dietaryRestriction: string;
}

export interface SimulatedOrder {
  id: string;
  packageName: string;
  quantity: number;
  receiverName: string;
  receiverPhone: string;
  receiverLocation: string;
  note: string;
  paymentMethod: string;
  total: number;
  timestamp: string;
  status: 'placed' | 'cooking' | 'dispatched' | 'delivered';
  lastUpdated: number;
}

export interface DailyLog {
  dateKey: string; // "YYYY-MM-DD"
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  waterCups: number; // slider/tap targeting 8 cups
  isHighProtein: boolean;
  isHighFiber: boolean;
  isLowSugar: boolean;
  calorieEst: number;
}

export interface FavoriteMeal {
  id: string;
  name: string;
  category: 'High Protein' | 'Low Carb' | 'Fiber Packed' | 'Balanced';
  calories: number;
  proteinGrams: number;
  notes?: string;
}

