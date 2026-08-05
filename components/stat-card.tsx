import { StyleSheet, Text, View } from 'react-native';

interface StatCardProps {
  value: string;
  label: string;
  icon?: string;
  highlight?: boolean;
  big?: boolean;
}

export function StatCard({ value, label, icon, highlight, big }: StatCardProps) {
  return (
    <View style={[styles.card, highlight && styles.cardHighlight, big && styles.cardBig]}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={[styles.value, highlight && styles.valueHighlight, big && styles.valueBig]}>
        {value}
      </Text>
      <Text style={[styles.label, highlight && styles.labelHighlight]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eef0f2',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    flex: 1,
    minWidth: 120,
  },
  cardHighlight: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  cardBig: {
    flex: 1.6,
  },
  icon: {
    fontSize: 22,
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0a7ea4',
  },
  valueHighlight: {
    color: '#fff',
  },
  valueBig: {
    fontSize: 30,
  },
  label: {
    fontSize: 13,
    color: '#7a8288',
    marginTop: 4,
    lineHeight: 17,
  },
  labelHighlight: {
    color: '#d9f2fa',
  },
});
