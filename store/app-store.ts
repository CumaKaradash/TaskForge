import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Language } from "@/lib/i18n"

interface AppStore {
  language: Language
  setLanguage: (language: Language) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "taskforge-app-settings",
    },
  ),
)
