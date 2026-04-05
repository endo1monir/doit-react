import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Habit {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: string;
  cleanDays: string[];
}

interface HabitsContextType {
  habits: Habit[];
  addHabit: (
    name: string,
    description: string,
    color: string,
    icon: string
  ) => void;
  updateHabit: (
    id: string,
    name: string,
    description: string,
    color: string,
    icon: string
  ) => void;
  deleteHabit: (id: string) => void;
  toggleDay: (habitId: string, dateStr: string) => void;
  isDayChecked: (habitId: string, dateStr: string) => boolean;
  getCleanStreak: (habit: Habit) => number;
  getTotalCleanDays: (habit: Habit) => number;
  isLoading: boolean;
}

const HabitsContext = createContext<HabitsContextType | null>(null);

const STORAGE_KEY = "@habit_breaker_habits";

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHabits(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load habits", e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHabits = async (updatedHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHabits));
    } catch (e) {
      console.error("Failed to save habits", e);
    }
  };

  const addHabit = useCallback(
    (name: string, description: string, color: string, icon: string) => {
      const newHabit: Habit = {
        id: generateId(),
        name,
        description,
        color,
        icon,
        createdAt: new Date().toISOString(),
        cleanDays: [],
      };
      const updated = [...habits, newHabit];
      setHabits(updated);
      saveHabits(updated);
    },
    [habits]
  );

  const updateHabit = useCallback(
    (
      id: string,
      name: string,
      description: string,
      color: string,
      icon: string
    ) => {
      const updated = habits.map((h) =>
        h.id === id ? { ...h, name, description, color, icon } : h
      );
      setHabits(updated);
      saveHabits(updated);
    },
    [habits]
  );

  const deleteHabit = useCallback(
    (id: string) => {
      const updated = habits.filter((h) => h.id !== id);
      setHabits(updated);
      saveHabits(updated);
    },
    [habits]
  );

  const toggleDay = useCallback(
    (habitId: string, dateStr: string) => {
      const updated = habits.map((h) => {
        if (h.id !== habitId) return h;
        const cleanDays = h.cleanDays.includes(dateStr)
          ? h.cleanDays.filter((d) => d !== dateStr)
          : [...h.cleanDays, dateStr];
        return { ...h, cleanDays };
      });
      setHabits(updated);
      saveHabits(updated);
    },
    [habits]
  );

  const isDayChecked = useCallback(
    (habitId: string, dateStr: string) => {
      const habit = habits.find((h) => h.id === habitId);
      return habit ? habit.cleanDays.includes(dateStr) : false;
    },
    [habits]
  );

  const getCleanStreak = useCallback((habit: Habit): number => {
    const today = new Date();
    let streak = 0;
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    while (true) {
      const dateStr = d.toISOString().split("T")[0];
      if (habit.cleanDays.includes(dateStr)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, []);

  const getTotalCleanDays = useCallback((habit: Habit): number => {
    return habit.cleanDays.length;
  }, []);

  return (
    <HabitsContext.Provider
      value={{
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleDay,
        isDayChecked,
        getCleanStreak,
        getTotalCleanDays,
        isLoading,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within HabitsProvider");
  return ctx;
}
