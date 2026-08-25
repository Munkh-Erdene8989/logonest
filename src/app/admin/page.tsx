import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/session"
import { getMessages, getNews, getOrders, getPricing, getProducts } from "@/lib/data"
import { AdminDashboard } from "@/components/admin/AdminDashboard"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const session = await getAdminSession()
  if (!session) redirect("/admin/login")

  const [orders, products, pricing, messages, news] = await Promise.all([
    getOrders(),
    getProducts(),
    getPricing(),
    getMessages(),
    getNews(),
  ])

  return (
    <AdminDashboard
      orders={orders}
      products={products}
      pricing={pricing}
      messages={messages}
      news={news}
    />
  )
}
