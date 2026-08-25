import type { Metadata } from "next"
import { SportClient } from "@/components/sport/SportClient"

export const metadata: Metadata = {
  title: "3D Загвар",
  description: "Хүссэн загвараа 3D-р бүтээ. Үлдсэнийг бид хариуцъя.",
}

export default function SportPage() {
  return <SportClient />
}
