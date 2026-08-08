import { useColorScheme as _useColorScheme } from 'react-native';

/**
 * O app sempre usa o tema claro (light) para manter um layout claro e
 * consistente, independentemente do tema do sistema.
 */
export function useColorScheme(): 'light' {
  _useColorScheme();
  return 'light';
}
