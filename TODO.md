# TODO - Menu de navegação lateral (Drawer) + Perfil + Sobre Nós

- [x] Analisar repositório e entender a estrutura existente
- [x] Confirmar plano com o usuário

## Dependências

- [ ] Instalar `@react-navigation/drawer` e `expo-image-picker`

## Implementação

- [ ] `app/_layout.tsx` — envolver app em `GestureHandlerRootView`
- [ ] `app/(app)/_layout.tsx` — trocar Stack por Drawer Navigator
- [ ] `components/app-drawer.tsx` — conteúdo customizado do menu (Início, Meu Perfil, Sobre Nós, Sair)
- [ ] `components/screen-header.tsx` — botão hambúrguer (☰) para abrir o drawer
- [ ] `app/(app)/perfil.tsx` — tela Meu Perfil (foto circular, nome, email, alterar foto, editar dados)
- [ ] `app/(app)/sobre.tsx` — tela Sobre Nós (importância e objetivo do app)
- [ ] `lib/store.ts` — armazenar dados de perfil (nome, telefone, foto)

## Verificação

- [ ] Drawer abre pelo botão ☰, fecha ao clicar fora/arrastar, com animação suave
- [ ] Navegação correta entre Início, Meu Perfil e Sobre Nós
- [ ] Botão Sair retorna ao login e limpa o estado
- [ ] Visual claro, cards brancos e arrredondados mantidos
- [ ] Funciona no Expo Go

