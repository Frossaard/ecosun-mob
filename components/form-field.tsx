import { StyleSheet, Text, TextInput, type TextInputProps } from 'react-native';

import { ThemedView } from '@/components/themed-view';

interface FormFieldProps extends TextInputProps {
  label: string;
  hint?: string;
}

export function FormField({ label, hint, ...inputProps }: FormFieldProps) {
  return (
    <ThemedView style={styles.wrapper}>
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
    gap: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#37474f',
  },
  input: {
    backgroundColor: '#f5f7f8',
    borderWidth: 1,
    borderColor: '#e0e3e5',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#11181c',
  },
  hint: {
    fontSize: 12,
    color: '#8a9196',
  },
});
