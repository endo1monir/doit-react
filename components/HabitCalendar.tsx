import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Habit, useHabits } from "@/context/HabitsContext";
import { useColors } from "@/hooks/useColors";

interface HabitCalendarProps {
  habit: Habit;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function dateStr(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function HabitCalendar({ habit }: HabitCalendarProps) {
  const colors = useColors();
  const { toggleDay, isDayChecked } = useHabits();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = today.toISOString().split("T")[0];

  const handlePrev = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const handleNext = () => {
    const now = new Date();
    const isCurrentOrFuture = year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth());
    if (isCurrentOrFuture) return;
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const isFuture = (day: number): boolean => {
    const d = new Date(year, month, day);
    d.setHours(23, 59, 59, 999);
    return d > today;
  };

  const handleToggle = (day: number) => {
    if (isFuture(day)) return;
    const ds = dateStr(year, month, day);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleDay(habit.id, ds);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const checkedCount = cells.filter((d) => {
    if (!d) return false;
    return isDayChecked(habit.id, dateStr(year, month, d));
  }).length;

  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const canGoNext = !isCurrentMonth;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Pressable onPress={handlePrev} style={styles.navBtn} hitSlop={12}>
          <Feather name="chevron-left" size={20} color={colors.foreground} />
        </Pressable>
        <View style={styles.monthInfo}>
          <Text style={[styles.monthTitle, { color: colors.foreground }]}>
            {MONTHS[month]} {year}
          </Text>
          <Text style={[styles.checkedCount, { color: habit.color }]}>
            {checkedCount} clean days
          </Text>
        </View>
        <Pressable
          onPress={handleNext}
          style={[styles.navBtn, !canGoNext && styles.navBtnDisabled]}
          hitSlop={12}
          disabled={!canGoNext}
        >
          <Feather
            name="chevron-right"
            size={20}
            color={canGoNext ? colors.foreground : colors.border}
          />
        </Pressable>
      </View>

      <View style={styles.daysRow}>
        {DAYS.map((d) => (
          <Text key={d} style={[styles.dayLabel, { color: colors.mutedForeground }]}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, idx) => {
          if (!day) {
            return <View key={`empty-${idx}`} style={styles.cell} />;
          }
          const ds = dateStr(year, month, day);
          const checked = isDayChecked(habit.id, ds);
          const isToday = ds === todayStr;
          const future = isFuture(day);

          return (
            <Pressable
              key={ds}
              style={({ pressed }) => [
                styles.cell,
                checked && { backgroundColor: habit.color },
                isToday && !checked && { borderColor: habit.color, borderWidth: 2 },
                !checked && !isToday && { backgroundColor: colors.background },
                future && { opacity: 0.35 },
                pressed && !future && { opacity: 0.7, transform: [{ scale: 0.92 }] },
              ]}
              onPress={() => handleToggle(day)}
              disabled={future}
            >
              <Text
                style={[
                  styles.dayNum,
                  { color: checked ? "#fff" : isToday ? habit.color : colors.foreground },
                  future && { color: colors.mutedForeground },
                ]}
              >
                {day}
              </Text>
              {checked && (
                <Feather name="check" size={9} color="#fff" style={styles.checkMark} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navBtn: {
    padding: 6,
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  monthInfo: {
    alignItems: "center",
    gap: 2,
  },
  monthTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  checkedCount: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  daysRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: "14.285714%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 4,
  },
  dayNum: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  checkMark: {
    position: "absolute",
    bottom: 3,
    right: 3,
  },
});
