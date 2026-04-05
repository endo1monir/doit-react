import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Habit, useHabits } from "@/context/HabitsContext";
import { useColors } from "@/hooks/useColors";

interface StatsRowProps {
  habit: Habit;
}

export function StatsRow({ habit }: StatsRowProps) {
  const colors = useColors();
  const { getCleanStreak, getTotalCleanDays } = useHabits();

  const streak = getCleanStreak(habit);
  const total = getTotalCleanDays(habit);
  const createdDate = new Date(habit.createdAt);
  const daysSinceStart = Math.floor(
    (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  const successRate =
    daysSinceStart > 0 ? Math.round((total / daysSinceStart) * 100) : 0;

  const stats = [
    { icon: "zap" as const, label: "Current Streak", value: `${streak}`, unit: "days" },
    { icon: "calendar" as const, label: "Total Clean", value: `${total}`, unit: "days" },
    { icon: "trending-up" as const, label: "Success Rate", value: `${successRate}`, unit: "%" },
  ];

  return (
    <View style={styles.row}>
      {stats.map((s, i) => (
        <View
          key={s.label}
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              marginRight: i < stats.length - 1 ? 10 : 0,
            },
          ]}
        >
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: habit.color + "20" },
            ]}
          >
            <Feather name={s.icon} size={16} color={habit.color} />
          </View>
          <Text style={[styles.value, { color: colors.foreground }]}>
            {s.value}
            <Text style={[styles.unit, { color: colors.mutedForeground }]}>
              {" "}{s.unit}
            </Text>
          </Text>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  unit: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});
