import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';

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
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.88}
      style={[
        styles.button,
        (disabled || loading) && styles.buttonDisabled,
        style,
      ]}>
      <Text style={styles.label}>{loading ? 'Processando…' : title}</Text>
      {icon ? <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0B3D91',
    minHeight: 56,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowColor: '#0B3D91',
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.5,
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
