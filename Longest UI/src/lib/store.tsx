import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react"
import { DEMO_ORDERS, PRICING_TYPES, PRODUCTS } from "../data/demo"
import type { Message, Order, OrderStatus, PricingType, Product } from "./types"
import { STATUS_LABEL, STATUS_ORDER } from "./types"
import { usePersistentState } from "./storage"

type Store = {
  products: Product[]
  orders: Order[]
  pricing: PricingType[]
  messages: Message[]
  addOrder: (o: Order) => void
  updateOrderStatus: (code: string, status: OrderStatus, note?: string) => void
  saveProduct: (p: Product) => void
  deleteProduct: (id: string) => void
  updatePricing: (p: PricingType[]) => void
  addMessage: (m: Message) => void
  markMessageRead: (id: string) => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = usePersistentState<Product[]>(
    "hg_products",
    PRODUCTS,
  )
  const [orders, setOrders] = usePersistentState<Order[]>("hg_orders", DEMO_ORDERS)
  const [pricing, setPricing] = usePersistentState<PricingType[]>(
    "hg_pricing",
    PRICING_TYPES,
  )
  const [messages, setMessages] = usePersistentState<Message[]>("hg_messages", [])

  const value = useMemo<Store>(
    () => ({
      products,
      orders,
      pricing,
      messages,
      addOrder: (o) => setOrders((prev) => [o, ...prev]),
      updateOrderStatus: (code, status, note) =>
        setOrders((prev) =>
          prev.map((o) =>
            o.code === code
              ? {
                  ...o,
                  status,
                  timeline: [
                    ...o.timeline,
                    { status, at: new Date().toISOString(), note },
                  ],
                }
              : o,
          ),
        ),
      saveProduct: (p) =>
        setProducts((prev) => {
          const exists = prev.some((x) => x.id === p.id)
          return exists ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev]
        }),
      deleteProduct: (id) =>
        setProducts((prev) => prev.filter((x) => x.id !== id)),
      updatePricing: (p) => setPricing(p),
      addMessage: (m) => setMessages((prev) => [m, ...prev]),
      markMessageRead: (id) =>
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
        ),
    }),
    [products, orders, pricing, messages, setProducts, setOrders, setPricing, setMessages],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}

export { STATUS_LABEL, STATUS_ORDER }
