import type { Metadata } from "next"
import { ContactForm } from "@/components/ContactForm"

export const metadata: Metadata = { title: "Холбоо барих" }

export default function ContactPage() {
  return <ContactForm />
}
