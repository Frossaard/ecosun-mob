import { StyleSheet, Text, TextInput, type TextInputProps } from 'react-native';

import { ThemedView } from '@/components/themed-view';

interface FormFieldProps extends TextInputProps {
  label: string;
  hint?: string;
}

export function FormField({ label, hint, ...inputProps }: FormFieldProps) {
  return (
    <ThemedView lightColor="transparent" style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#9aa0a6"
        style={styles.input}
        {...inputProps}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 7,
    marginBottom: 18,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    minHeight: 52,
    fontSize: 16,
    color: '#111827',
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
  },
});
