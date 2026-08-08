import { MaterialIcons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { kitStore } from '@/lib/store';

const MENU_ITENS = [
  { rota: 'form', label: 'Início', icon: 'home' as const },
  { rota: 'perfil', label: 'Meu Perfil', icon: 'person' as const },
  { rota: 'sobre', label: 'Sobre Nós', icon: 'info-outline' as const },
];

export function AppDrawer(props: DrawerContentComponentProps) {
  const { state, navigation } = props;
  const router = useRouter();

  // Rota atualmente ativa dentro do drawer.
  const rotaAtiva = state.routes[state.index]?.name;

  function navegar(rota: string) {
    navigation.navigate(rota);
  }

  function sair() {
    kitStore.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: 'form' }],
    });
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {/* Cabeçalho da marca */}
        <View style={styles.brand}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="solar-power" size={30} color="#fff" />
          </View>
          <View>
            <Text style={styles.brandName}>EcoSun</Text>
            <Text style={styles.brandTagline}>Energia solar inteligente</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Itens do menu */}
        <View style={styles.menu}>
          {MENU_ITENS.map((item) => {
            const ativo = rotaAtiva === item.rota;
            return (
              <Pressable
                key={item.rota}
                onPress={() => navegar(item.rota)}
                style={[styles.item, ativo && styles.itemAtivo]}>
                <MaterialIcons
                  name={item.icon}
                  size={22}
                  color={ativo ? '#0a7ea4' : '#5f6b7a'}
                />
                <Text style={[styles.itemLabel, ativo && styles.itemLabelAtivo]}>
                  {item.label}
                </Text>
                {ativo ? <View style={styles.itemDot} /> : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.divider} />

        {/* Rodapé / Sair */}
        <View style={styles.footerArea}>
          <Pressable onPress={sair} style={styles.sairItem}>
            <MaterialIcons name="logout" size={22} color="#d32f2f" />
            <Text style={styles.sairLabel}>Sair</Text>
          </Pressable>
          <Text style={styles.versao}>EcoSun AI • v1.0.0</Text>
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

// Mantém o DrawerItem importado para não quebrar possíveis integrações futuras.
export const _DrawerItem = DrawerItem;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flexGrow: 1,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
  },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0a7ea4',
  },
  brandTagline: {
    fontSize: 13,
    color: '#7a8288',
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eef0f2',
    marginHorizontal: 20,
  },
  menu: {
    paddingVertical: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    borderRadius: 14,
  },
  itemAtivo: {
    backgroundColor: '#e8f6fb',
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#37474f',
  },
  itemLabelAtivo: {
    color: '#0a7ea4',
    fontWeight: '700',
  },
  itemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0a7ea4',
  },
  footerArea: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  sairItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  sairLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d32f2f',
  },
  versao: {
    fontSize: 12,
    color: '#b0b8c1',
    paddingLeft: 8,
  },
} as const);
