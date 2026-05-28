import { Image } from 'expo-image';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Collapsible } from '@/components/ui/collapsible';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { Link, useRouter } from 'expo-router';

const NAV = {
  inicial: '/budget/config/index',
  sobre: '/budget/config/sobre-nos',
  'por-que': '/budget/config/energia-renovavel',
  conta: '/budget/config/minha-conta',
} as const;

const SECTION_1 = 'kit';

function MenuButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Menu" onPress={onPress}>
      <ThemedView style={styles.menuButton}>
        <IconSymbol name="line.3.horizontal" size={22} color={Colors.light.text} />
      </ThemedView>
    </Pressable>
  );
}

function SegmentedMenu({
  active,
  onNavigate,
}: {
  active: 'inicial' | 'sobre' | 'por-que' | 'conta';
  onNavigate: (to: 'inicial' | 'sobre' | 'por-que' | 'conta') => void;
}) {
  return (
    <ThemedView style={styles.menuCard}>
      <ThemedText type="defaultSemiBold" style={styles.menuTitle}>
        Configurações
      </ThemedText>

      <ThemedView style={styles.menuList}>
        <Pressable
          style={[styles.menuItem, active === 'inicial' && styles.menuItemActive]}
          onPress={() => onNavigate('inicial')}>
          <ThemedText style={styles.menuItemText}>Inicial</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.menuItem, active === 'sobre' && styles.menuItemActive]}
          onPress={() => onNavigate('sobre')}>
          <ThemedText style={styles.menuItemText}>Sobre nós</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.menuItem, active === 'por-que' && styles.menuItemActive]}
          onPress={() => onNavigate('por-que')}>
          <ThemedText style={styles.menuItemText}>Por que usar renovável</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.menuItem, active === 'conta' && styles.menuItemActive]}
          onPress={() => onNavigate('conta')}>
          <ThemedText style={styles.menuItemText}>Minha conta</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

export default function BudgetHomeScreen() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const active: 'inicial' | 'sobre' | 'por-que' | 'conta' = 'inicial';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E9F3FF', dark: '#0B1220' }}
      headerImage={
        <ThemedView style={{ height: 1 }} />
      }>
      <ThemedView style={styles.screen}>
        <ThemedView style={styles.topRow}>
          <MenuButton onPress={() => setMenuOpen((s) => !s)} />
          <ThemedText type="title" style={styles.pageTitle}>
            Orçamentos
          </ThemedText>
        </ThemedView>

        {menuOpen && (
          <ThemedView style={styles.menuWrap}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuOpen(false)} />
            <SegmentedMenu
              active={active}
              onNavigate={(to) => {
                setMenuOpen(false);
                router.push(
                NAV[to]
                );
              }}
            />
          </ThemedView>
        )}

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.headerImageWrap}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.houseImage}
              contentFit="cover"
            />
            <ThemedView style={styles.headerGradient} />
            <ThemedView style={styles.headerOverlay}>
              <ThemedText type="title" style={styles.headerTitle}>
                Kit Solar
              </ThemedText>
              <ThemedText style={styles.headerSubtitle}>
                Visualize o orçamento criado no site e acompanhe detalhes do seu sistema.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {`Orçamento do seu kit (${SECTION_1})`}
            </ThemedText>

            {/* Primeiro section aberto (obrigatório) */}
            <Collapsible title="Kit Solar (detalhes)">
              <ThemedView style={styles.kitGrid}>
                <ThemedView style={styles.kitItem}>
                  <ThemedText type="defaultSemiBold" style={styles.kitItemTitle}>
                    Painéis Solares
                  </ThemedText>
                  <ThemedText style={styles.kitItemValue}>12 módulos</ThemedText>
                  <ThemedText style={styles.kitItemMeta}>Potência: 550 Wp cada</ThemedText>
                </ThemedView>

                <ThemedView style={styles.kitItem}>
                  <ThemedText type="defaultSemiBold" style={styles.kitItemTitle}>
                    Inversores
                  </ThemedText>
                  <ThemedText style={styles.kitItemValue}>1 inversor string</ThemedText>
                  <ThemedText style={styles.kitItemMeta}>Potência: 6,0 kW</ThemedText>
                </ThemedView>

                <ThemedView style={styles.kitItem}>
                  <ThemedText type="defaultSemiBold" style={styles.kitItemTitle}>
                    Gerador/Backup
                  </ThemedText>
                  <ThemedText style={styles.kitItemValue}>Opcional</ThemedText>
                  <ThemedText style={styles.kitItemMeta}>Disponível conforme seu orçamento</ThemedText>
                </ThemedView>

                <ThemedView style={styles.kitItem}>
                  <ThemedText type="defaultSemiBold" style={styles.kitItemTitle}>
                    Estrutura & Instalação
                  </ThemedText>
                  <ThemedText style={styles.kitItemValue}>Suporte fixo</ThemedText>
                  <ThemedText style={styles.kitItemMeta}>Inclui mão de obra e cabeamento</ThemedText>
                </ThemedView>

                <ThemedView style={styles.kitTotal}>
                  <ThemedText type="defaultSemiBold" style={styles.kitItemTitle}>
                    Total estimado
                  </ThemedText>
                  <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
                    R$ 28.900
                  </ThemedText>
                  <ThemedText style={styles.kitItemMeta}>
                    Valores sujeitos à validação técnica (telhado, padrão e região).
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </Collapsible>
          </ThemedView>

          <ThemedView style={styles.sectionMin}>
            <Collapsible title="Detalhes do sistema">
              <ThemedText style={{ opacity: 0.85 }}>
                Informações técnicas e especificações do seu sistema.
              </ThemedText>
            </Collapsible>
            <Collapsible title="Instalação">
              <ThemedText style={{ opacity: 0.85 }}>
                Etapas de instalação e validações necessárias.
              </ThemedText>
            </Collapsible>
            <Collapsible title="Garantia">
              <ThemedText style={{ opacity: 0.85 }}>
                Condições de garantia para módulos, inversores e estrutura.
              </ThemedText>
            </Collapsible>
            <Collapsible title="Financiamento">
              <ThemedText style={{ opacity: 0.85 }}>
                Simulações e opções de pagamento disponíveis.
              </ThemedText>
            </Collapsible>
          </ThemedView>

          <ThemedView style={styles.bottomHint}>
            <ThemedText style={styles.bottomHintText}>
              Seu orçamento pode ser atualizado a qualquer momento pelo site.
            </ThemedText>
            <Link href="/modal" asChild>
              <Pressable style={styles.primaryButton}>
                <IconSymbol name="chevron.right" size={18} color={Colors.light.tint} />
                <ThemedText type="defaultSemiBold" style={styles.primaryButtonText}>
                  Ver documentos
                </ThemedText>
              </Pressable>
            </Link>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 6,
    zIndex: 2,
  },
  menuButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  pageTitle: {
    flex: 1,
    textAlign: 'left',
    fontFamily: Fonts.rounded,
  },
  menuWrap: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 16,
  },
  menuCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.96)',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  menuTitle: {
    marginBottom: 12,
  },
  menuList: {
    gap: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  menuItemActive: {
    backgroundColor: 'rgba(24,119,242,0.12)',
  },
  menuItemText: {
    fontFamily: Fonts.rounded,
  },
  headerImageWrap: {
    height: 210,
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 14,
    position: 'relative',
  },
  houseImage: {
    width: '100%',
    height: '100%',
    opacity: Platform.OS === 'web' ? 0.85 : 0.95,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  headerOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
  },
  headerTitle: {
    color: Colors.light.background,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: Colors.light.background,
    opacity: 0.95,
  },
  section: {
    borderRadius: 18,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 6,
  },
  kitGrid: {
    gap: 10,
  },
  kitItem: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  kitItemTitle: {
    marginBottom: 6,
  },
  kitItemValue: {
    fontSize: 16,
    marginBottom: 2,
  },
  kitItemMeta: {
    opacity: 0.8,
  },
  kitTotal: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(24,119,242,0.08)',
    marginTop: 4,
    alignItems: 'flex-start',
  },
  sectionMin: {
    gap: 10,
    paddingBottom: 10,
  },
  bottomHint: {
    marginTop: 18,
    gap: 10,
  },
  bottomHintText: {
    opacity: 0.7,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(24,119,242,0.14)',
  },
  primaryButtonText: {
    color: Colors.light.tint,
  },
});

