import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor = '#FFFFFF', ...otherProps }: ThemedViewProps) {
  return <View style={[{ backgroundColor: lightColor }, style]} {...otherProps} />;
}
