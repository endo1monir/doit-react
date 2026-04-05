import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HabitCalendar } from "@/components/HabitCalendar";
import { StatsRow } from "@/components/StatsRow";
import { useHabits } from "@/context/HabitsContext";
import { useColors } from "@/hooks/useColors";

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits } = useHabits();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const habit = habits.find((h) => h.id === id);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 20;

  if (!habit) {
    return (
      <View
        style={[styles.notFound, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>
          Habit not found
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.primary }]}>
            Go back
          </Text>
        </Pressable>
      </View>
    );
  }

  const createdDate = new Date(habit.createdAt);
  const since = createdDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 8,
            paddingBottom: 16,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
        >
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.habitIcon}>{habit.icon}</Text>
          <View>
            <Text
              style={[styles.habitName, { color: colors.foreground }]}
              numberOfLines={1}
            >
              {habit.name}
            </Text>
            {habit.description ? (
              <Text
                style={[styles.habitDesc, { color: colors.mutedForeground }]}
                numberOfLines={1}
              >
                {habit.description}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.sinceTag,
            {
              backgroundColor: habit.color + "15",
              borderColor: habit.color + "40",
            },
          ]}
        >
          <Feather name="flag" size={12} color={habit.color} />
          <Text style={[styles.sinceText, { color: habit.color }]}>
            Started {since}
          </Text>
        </View>

        <StatsRow habit={habit} />

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          CALENDAR
        </Text>
        <Text style={[styles.sectionHint, { color: colors.mutedForeground }]}>
          Tap a day to mark it as clean
        </Text>
        <HabitCalendar habit={habit} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  habitIcon: {
    fontSize: 28,
  },
  habitName: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  habitDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  scroll: {
    padding: 20,
    gap: 0,
  },
  sinceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  sinceText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginTop: 24,
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 12,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  backLink: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
});
