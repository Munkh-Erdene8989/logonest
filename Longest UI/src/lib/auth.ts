import { usePersistentState } from "./storage"

// Demo зорилгын энгийн админ нэвтрэлт (localStorage). Бодит нууцлал биш.
export const DEMO_ADMIN_PASSWORD = "admin123"

export function useAdminAuth() {
  const [authed, setAuthed] = usePersistentState<boolean>("hg_admin_auth", false)
  return {
    authed,
    login: (password: string) => {
      if (password === DEMO_ADMIN_PASSWORD) {
        setAuthed(true)
        return true
      }
      return false
    },
    logout: () => setAuthed(false),
  }
}
