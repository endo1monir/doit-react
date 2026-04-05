import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Habit, useHabits } from "@/context/HabitsContext";
import { useColors } from "@/hooks/useColors";

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const colors = useColors();
  const { deleteHabit, getCleanStreak, getTotalCleanDays } = useHabits();

  const streak = getCleanStreak(habit);
  const total = getTotalCleanDays(habit);

  const todayStr = new Date().toISOString().split("T")[0];
  const { isDayChecked, toggleDay } = useHabits();
  const isCheckedToday = isDayChecked(habit.id, todayStr);

  const handleToggleToday = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleDay(habit.id, todayStr);
  };

  const handleDelete = () => {
    Alert.alert("Delete Habit", `Remove "${habit.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteHabit(habit.id),
      },
    ]);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
      onPress={() => router.push(`/habit/${habit.id}` as any)}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: habit.color + "22" },
          ]}
        >
          <Text style={styles.icon}>{habit.icon}</Text>
        </View>
        <View style={styles.info}>
          <Text
            style={[styles.name, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {habit.name}
          </Text>
          {habit.description ? (
            <Text
              style={[styles.desc, { color: colors.mutedForeground }]}
              numberOfLines={1}
            >
              {habit.description}
            </Text>
          ) : null}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Feather name="zap" size={12} color={habit.color} />
              <Text style={[styles.statText, { color: habit.color }]}>
                {streak}d streak
              </Text>
            </View>
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <Text style={[styles.statText, { color: colors.mutedForeground }]}>
              {total} total
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.right}>
        <Pressable
          style={[
            styles.checkBtn,
            {
              backgroundColor: isCheckedToday
                ? habit.color
                : colors.background,
              borderColor: isCheckedToday ? habit.color : colors.border,
            },
          ]}
          onPress={handleToggleToday}
          hitSlop={8}
        >
          {isCheckedToday && (
            <Feather name="check" size={16} color="#fff" />
          )}
        </Pressable>
        <Pressable
          style={styles.deleteBtn}
          onPress={handleDelete}
          hitSlop={8}
        >
          <Feather name="trash-2" size={14} color={colors.mutedForeground} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  desc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  statText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    padding: 4,
  },
});
