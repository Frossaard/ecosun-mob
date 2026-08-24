import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SimpleChartProps {
  values: number[]; // 12 months
}

export function SimpleChart({ values }: SimpleChartProps) {
  const max = Math.max(...values, 1);

  return (
    <View>
      <View style={styles.row}>
        {values.map((v, i) => (
          <View key={i} style={styles.colWrap}>
            <View style={[styles.bar, { height: `${(v / max) * 100}%` }]} />
            <Text style={styles.label}>{i + 1}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 6,
  },
  colWrap: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: '70%',
    backgroundColor: '#0B3D91',
    borderRadius: 6,
    alignSelf: 'stretch',
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    color: '#6B7280',
  },
});
