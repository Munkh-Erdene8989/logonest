import { Link } from "react-router-dom"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { COMPANY } from "../data/demo"
import { Logo } from "./Logo"

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo className="text-white" />
          <p className="mt-4 max-w-xs text-sm text-white/60">
            {COMPANY.established} оноос хойш чанартай хэвлэл, найдвартай үйлчилгээ.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest text-white/40">
            Үйлчилгээ
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li><Link to="/products" className="hover:text-primary">Бүтээгдэхүүн</Link></li>
            <li><Link to="/calculator" className="hover:text-primary">Үнэ тооцоолуур</Link></li>
            <li><Link to="/order" className="hover:text-primary">Захиалга өгөх</Link></li>
            <li><Link to="/track" className="hover:text-primary">Захиалга хянах</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest text-white/40">
            Компани
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li><Link to="/news" className="hover:text-primary">Мэдээ, урамшуулал</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Холбоо барих</Link></li>
            <li><Link to="/admin" className="hover:text-primary">Админ нэвтрэх</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest text-white/40">
            Холбоо барих
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {COMPANY.phone}
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {COMPANY.email}
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {COMPANY.address}
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {COMPANY.hours}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-white/40 sm:flex-row sm:px-8">
          <span>© {new Date().getFullYear()} {COMPANY.fullName}. Бүх эрх хуулиар хамгаалагдсан.</span>
          <span className="font-mono">Demo зорилгоор бүтээв</span>
        </div>
      </div>
    </footer>
  )
}
