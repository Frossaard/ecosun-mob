import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface SettingsMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SettingsMenuContext = createContext<SettingsMenuContextValue | null>(null);

export function SettingsMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <SettingsMenuContext.Provider value={value}>{children}</SettingsMenuContext.Provider>;
}

export function useSettingsMenu() {
  const context = useContext(SettingsMenuContext);
  if (!context) throw new Error('useSettingsMenu deve ser usado dentro de SettingsMenuProvider');
  return context;
}