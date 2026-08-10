import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { ThemedView } from '@/components/themed-view';

interface ChipSelectProps<T extends string> {
  label: string;
  options: { value: T; label: string; icon?: keyof typeof MaterialCommunityIcons.glyphMap }[];
  value: T | null;
  onChange: (value: T) => void;
}

export function ChipSelect<T extends string>({
  label,
  options,
  value,
  onChange,
}: ChipSelectProps<T>) {
  return (
    <ThemedView lightColor="transparent" style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <ThemedView lightColor="transparent" style={styles.row}>
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.78}
              style={[styles.chip, selected && styles.chipSelected]}>
              {opt.icon ? (
                <MaterialCommunityIcons
                  name={opt.icon}
                  size={17}
                  color={selected ? '#FFFFFF' : '#526072'}
                />
              ) : null}
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 9,
    marginBottom: 18,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: 'transparent',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  chipSelected: {
    backgroundColor: '#0B3D91',
    borderColor: '#0B3D91',
  },
  chipText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#fff',
  },
});
