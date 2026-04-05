import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useHabits } from "@/context/HabitsContext";
import { useColors } from "@/hooks/useColors";

const HABIT_COLORS = [
  "#0d7377", "#14a085", "#3b82f6", "#8b5cf6",
  "#ec4899", "#ef4444", "#f59e0b", "#10b981",
];

const HABIT_ICONS = [
  "🚭", "🍺", "📱", "🍔", "🎮", "☕", "💊", "🍰",
  "😤", "🛌", "💸", "🚗", "🍭", "📺", "🍟", "🧃",
];

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddHabitModal({ visible, onClose }: AddHabitModalProps) {
  const colors = useColors();
  const { addHabit } = useHabits();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);

  const handleSave = () => {
    if (!name.trim()) return;
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    addHabit(name.trim(), description.trim(), selectedColor, selectedIcon);
    setName("");
    setDescription("");
    setSelectedColor(HABIT_COLORS[0]);
    setSelectedIcon(HABIT_ICONS[0]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.border,
              paddingTop: Platform.OS === "web" ? 67 : insets.top + 8,
            },
          ]}
        >
          <Pressable onPress={onClose} style={styles.cancelBtn}>
            <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>
              Cancel
            </Text>
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>
            New Habit
          </Text>
          <Pressable
            onPress={handleSave}
            style={[
              styles.saveBtn,
              { backgroundColor: name.trim() ? selectedColor : colors.muted },
            ]}
          >
            <Text
              style={[
                styles.saveText,
                { color: name.trim() ? "#fff" : colors.mutedForeground },
              ]}
            >
              Add
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.body,
            { paddingBottom: insets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.previewCard,
              { backgroundColor: selectedColor + "15", borderColor: selectedColor + "40" },
            ]}
          >
            <Text style={styles.previewIcon}>{selectedIcon}</Text>
            <Text
              style={[
                styles.previewName,
                { color: name ? colors.foreground : colors.mutedForeground },
              ]}
            >
              {name || "Habit name"}
            </Text>
          </View>

          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            NAME
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.foreground,
              },
            ]}
            placeholder="e.g. Stop smoking"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
            returnKeyType="next"
            maxLength={40}
          />

          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            DESCRIPTION (OPTIONAL)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.foreground,
              },
            ]}
            placeholder="Why do you want to quit?"
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            maxLength={100}
          />

          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            COLOR
          </Text>
          <View style={styles.colorGrid}>
            {HABIT_COLORS.map((c) => (
              <Pressable
                key={c}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c },
                  selectedColor === c && styles.colorSelected,
                ]}
                onPress={() => setSelectedColor(c)}
              >
                {selectedColor === c && (
                  <Feather name="check" size={14} color="#fff" />
                )}
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            ICON
          </Text>
          <View style={styles.iconGrid}>
            {HABIT_ICONS.map((ic) => (
              <Pressable
                key={ic}
                style={[
                  styles.iconSwatch,
                  {
                    backgroundColor:
                      selectedIcon === ic
                        ? selectedColor + "22"
                        : colors.card,
                    borderColor:
                      selectedIcon === ic ? selectedColor : colors.border,
                  },
                ]}
                onPress={() => setSelectedIcon(ic)}
              >
                <Text style={styles.iconSwatchText}>{ic}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  cancelBtn: {
    padding: 4,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  title: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  body: {
    padding: 20,
    gap: 0,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  previewIcon: {
    fontSize: 32,
  },
  previewName: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  iconSwatch: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  iconSwatchText: {
    fontSize: 26,
  },
});
