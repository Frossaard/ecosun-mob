import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth';
import { useSettingsMenu } from '@/lib/settings-menu';
import { kitStore } from '@/lib/store';

interface SettingsDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsDrawer({ visible, onClose }: SettingsDrawerProps) {
  const router = useRouter();
  const { usuario, sair } = useAuth();
  const { setOpen } = useSettingsMenu();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(width * 0.75, 340);
  const translateX = useRef(new Animated.Value(-drawerWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : -drawerWidth,
        duration: 260,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: visible ? 1 : 0,
        duration: 220,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [drawerWidth, overlayOpacity, translateX, visible]);

  async function logout() {
    onClose();
    setOpen(false);
    kitStore.clear();
    await sair();
    router.replace('/');
  }

  function open(route: '/(app)/perfil' | '/(app)/sobre') {
    onClose();
    setOpen(false);
    router.push(route);
    setOpen(true);
  }

  return (
    <View pointerEvents={visible ? 'auto' : 'none'} style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable accessibilityLabel="Fechar configurações" onPress={onClose} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[styles.drawer, { width: drawerWidth, transform: [{ translateX }] }]}>
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.topRow}>
            <Pressable accessibilityLabel="Fechar configurações" onPress={onClose} hitSlop={10} style={styles.close}><MaterialIcons name="close" size={22} color="#60767D" /></Pressable>
          </View>
          <Text style={styles.greeting}>Olá, {usuario?.nome.trim().split(/\s+/)[0] || 'usuário'}</Text>
          <Text style={styles.email}>{usuario?.email}</Text>
          <View style={styles.divider} />
          <DrawerOption icon="person-outline" label="Minha conta" onPress={() => open('/(app)/perfil')} />
          <DrawerOption icon="info-outline" label="Sobre nós" onPress={() => open('/(app)/sobre')} />
          <View style={styles.spacer} />
          <Pressable onPress={logout} style={styles.logout}><MaterialIcons name="logout" size={21} color="#C0392B" /><Text style={styles.logoutText}>Sair</Text></Pressable>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

function DrawerOption({ icon, label, onPress }: { icon: React.ComponentProps<typeof MaterialIcons>['name']; label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.option}><MaterialIcons name={icon} size={23} color="#0B6672" /><Text style={styles.optionText}>{label}</Text><MaterialIcons name="chevron-right" size={22} color="#9AAEB2" /></Pressable>;
}

const styles = StyleSheet.create({ overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(10, 25, 30, 0.4)' }, drawer: { backgroundColor: '#fff', bottom: 0, elevation: 18, left: 0, position: 'absolute', shadowColor: '#102F36', shadowOffset: { height: 0, width: 7 }, shadowOpacity: 0.2, shadowRadius: 18, top: 0 }, safe: { flex: 1, paddingHorizontal: 22 }, topRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 12 }, close: { alignItems: 'center', height: 36, justifyContent: 'center', width: 36 }, greeting: { color: '#172B31', fontSize: 23, fontWeight: '800', marginTop: 18 }, email: { color: '#789097', fontSize: 13, marginTop: 4 }, divider: { backgroundColor: '#E8EEEE', height: 1, marginVertical: 26 }, option: { alignItems: 'center', borderRadius: 13, flexDirection: 'row', gap: 14, paddingHorizontal: 12, paddingVertical: 15 }, optionText: { color: '#263C43', flex: 1, fontSize: 16, fontWeight: '700' }, spacer: { flex: 1 }, logout: { alignItems: 'center', borderTopColor: '#E8EEEE', borderTopWidth: 1, flexDirection: 'row', gap: 14, paddingHorizontal: 12, paddingVertical: 18 }, logoutText: { color: '#C0392B', fontSize: 16, fontWeight: '700' } });