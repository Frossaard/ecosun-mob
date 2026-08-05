import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: string;
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  style,
  icon,
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        (disabled || loading) && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
        style,
      ]}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={styles.label}>{loading ? 'Processando…' : title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    paddingHorizontal: 24,
borderRadius: 16,
    boxShadow: '0 5px 10px rgba(10, 126, 164, 0.3)',
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  icon: {
    color: '#fff',
    fontSize: 18,
  },
  label: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

export function useSolarColors() {
  return {
    primary: Colors.light.tint,
    background: Colors.light.background,
    text: Colors.light.text,
  };
}
