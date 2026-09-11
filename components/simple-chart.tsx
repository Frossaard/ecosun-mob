import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SimpleChartProps {
  values: number[]; // 12 months
}

export function SimpleChart({ values }: SimpleChartProps) {
  const max = Math.max(...values, 1);

  return (
    <View style={styles.chartArea}>
      <View style={styles.row}>
        {values.map((v, i) => (
          <View key={i} style={styles.colWrap}>
            <View style={styles.track}>
              <View style={[styles.bar, { height: `${(v / max) * 100}%` }]} />
            </View>
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
    height: 112,
    gap: 5,
  },
  colWrap: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    backgroundColor: '#0B6672',
    borderRadius: 8,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  track: {
    alignSelf: 'stretch',
    backgroundColor: '#E7F0F0',
    borderRadius: 8,
    flex: 1,
    overflow: 'hidden',
  },
  chartArea: {
    marginTop: 2,
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    color: '#789097',
  },
});
