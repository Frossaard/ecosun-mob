# TODO — Refatoração EcoSun AI

## Etapas do plano

- [x] 1. Criar `lib/solar.ts` — lógica de cálculo da "IA" (dimensionamento de kit)
- [x] 2. Criar componentes reutilizáveis em `components/` (FormField, PrimaryButton, ChipSelect, ScreenHeader, StatCard)
- [x] 3. Atualizar `app/_layout.tsx` — Stack raiz (Login → App)
- [x] 4. Criar `app/index.tsx` — Tela de login (mock auth)
- [x] 5. Criar `app/(app)/_layout.tsx` — Stack da área autenticada
- [x] 6. Criar `app/(app)/form.tsx` — Inserção de dados da residência
- [x] 7. Criar `app/(app)/result.tsx` — Resumo do kit gerado
- [x] 8. Criar `app/(app)/detail.tsx` — Detalhamento do kit + custo/investimento
- [x] 9. Atualizar `app.json` — nome/slug do app
- [x] 10. Remover arquivos antigos (budget, tabs, modal + componentes não usados)
- [x] 11. Verificar com `npx tsc --noEmit`
- [x] 12. Testar com `npx expo export --platform web`

## Estrutura final

```
app/
  _layout.tsx        → Stack raiz (index = login, (app) = área autenticada)
  index.tsx          → Tela de login (mock auth)
  (app)/
    _layout.tsx      → Stack interno (form, result, detail)
    form.tsx         → Inserção de dados da residência
    result.tsx       → Resumo do kit gerado
    detail.tsx       → Detalhamento do kit + custo/investimento
components/
  chip-select.tsx    → Seletor de chips (tipo de residência, equipamentos)
  form-field.tsx     → Campo de input rotulado
  primary-button.tsx → Botão principal
  screen-header.tsx  → Cabeçalho de tela com título/subtítulo
  stat-card.tsx      → Cartão de métrica
  themed-text.tsx    → Texto com tema claro/escuro
  themed-view.tsx    → View com tema claro/escuro
lib/
  solar.ts           → Lógica de cálculo da "IA" (dimensionamento)
  store.ts           → Armazenamento em memória entre telas
```

## Fluxo

Login → Formulário → Resultado → Detalhe do kit
