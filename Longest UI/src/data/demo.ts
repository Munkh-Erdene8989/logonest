import type { Order, PricingType, Product } from "../lib/types"

const IMG = {
  card: "https://images.unsplash.com/photo-1628891439478-c613e85af7d6?w=900&h=650&fit=crop&auto=format",
  banner:
    "https://images.unsplash.com/photo-1593238404535-cda7ae2fe50b?w=900&h=650&fit=crop&auto=format",
  brochure:
    "https://images.unsplash.com/photo-1591351659190-6258bbec984d?w=900&h=650&fit=crop&auto=format",
  press:
    "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=1600&h=1000&fit=crop&auto=format",
  cut: "https://images.unsplash.com/photo-1693031630146-568e2f72db0e?w=900&h=650&fit=crop&auto=format",
  sheet:
    "https://images.unsplash.com/photo-1623305465231-d884ce752d59?w=900&h=650&fit=crop&auto=format",
  fold: "https://images.unsplash.com/photo-1695634621375-0b66a9d5d1bc?w=900&h=650&fit=crop&auto=format",
}

export const PRODUCTS: Product[] = [
  {
    id: "business-card",
    name: "Нэрийн хуудас",
    category: "Оффсет хэвлэл",
    tagline: "350гр цаас, тансаг өнгөлгөө",
    description:
      "Бизнесийн нэрийн хуудсыг өндөр нягтралтай, зузаан цаасан дээр хэвлэнэ. Матт, гялгар лак болон дэвүүн эффект сонгох боломжтой.",
    image: IMG.card,
    basePrice: 90,
    unit: "ш",
    popular: true,
    features: ["350гр art цаас", "2 талын хэвлэл", "Матт / гялгар лак", "1-2 ажлын өдөр"],
  },
  {
    id: "banner",
    name: "Хулдаасан баннер",
    category: "Өргөн формат",
    tagline: "Гадаа тэсвэртэй, м² тооцоотой",
    description:
      "Гадна болон дотор орчны сурталчилгааны хулдаасан баннер. UV бэхээр хэвлэх тул наранд бүдгэрэхгүй, усанд тэсвэртэй.",
    image: IMG.banner,
    basePrice: 18000,
    unit: "м²",
    popular: true,
    features: ["440гр хулдаас", "UV тэсвэртэй бэх", "Люверс/цоолбор", "Дурын хэмжээ"],
  },
  {
    id: "brochure",
    name: "Брошур / танилцуулга",
    category: "Оффсет хэвлэл",
    tagline: "A4/A5, эвхмэл болон товхимол",
    description:
      "Компанийн танилцуулга, каталог, брошурыг олон хуудсаар товхимол хэлбэрээр үдэж хэвлэнэ.",
    image: IMG.brochure,
    basePrice: 1200,
    unit: "ш",
    features: ["Эвхмэл / товхимол", "150-250гр цаас", "Үдэлт", "Бүрэн өнгөт"],
  },
  {
    id: "sticker",
    name: "Наалт / шошго",
    category: "Өргөн формат",
    tagline: "Тайрч бэлдсэн, дурын хэлбэр",
    description:
      "Бүтээгдэхүүний шошго, лого наалт зэргийг contour cut хийж дурын хэлбэрээр тайрч бэлдэнэ.",
    image: IMG.sheet,
    basePrice: 350,
    unit: "ш",
    features: ["Vinyl наалт", "Contour cut", "Ус тэсвэртэй", "Дурын хэлбэр"],
  },
  {
    id: "roll-up",
    name: "Roll-up стенд",
    category: "Өргөн формат",
    tagline: "85x200см, авсаархан хайрцагтай",
    description:
      "Үзэсгэлэн, эвент, дэлгүүрийн үүдэнд тавих зөөврийн roll-up баннер. Хийхэд хялбар, тээвэрлэхэд авсаархан.",
    image: IMG.cut,
    basePrice: 95000,
    unit: "ш",
    popular: true,
    features: ["Алюмин суурь", "Зөөврийн цүнх", "85x200см", "Дахин ашиглах"],
  },
  {
    id: "poster",
    name: "Постер / зурагт хуудас",
    category: "Оффсет хэвлэл",
    tagline: "A3-A0, гялгар фото цаас",
    description:
      "Өндөр нягтралтай фото чанарын постер. Дотор орчны сурталчилгаа, чимэглэлд тохиромжтой.",
    image: IMG.fold,
    basePrice: 3500,
    unit: "ш",
    features: ["Фото чанар", "A3-A0 хэмжээ", "Гялгар/матт", "Хурдан хэвлэл"],
  },
]

export const PRICING_TYPES: PricingType[] = [
  {
    id: "wide",
    name: "Өргөн хэвлэл (м²)",
    description: "Хулдаас, наалт, торон баннерыг талбайгаар тооцно.",
    mode: "area",
    materials: [
      { id: "flex", name: "Флекс хулдаас 440гр", pricePerM2: 18000 },
      { id: "mesh", name: "Торон баннер (mesh)", pricePerM2: 22000 },
      { id: "vinyl", name: "Vinyl наалт", pricePerM2: 32000 },
      { id: "backlit", name: "Backlit (гэрэлтэй)", pricePerM2: 38000 },
    ],
    finishes: [
      { id: "none", name: "Энгийн", multiplier: 1 },
      { id: "eyelet", name: "Люверстэй", multiplier: 1.1 },
      { id: "lam", name: "Ламинат", multiplier: 1.25 },
    ],
  },
  {
    id: "offset",
    name: "Оффсет хэвлэл (ширхэг)",
    description: "Нэрийн хуудас, брошур, постер зэрэг ширхэгээр тооцно.",
    mode: "unit",
    basePricePerUnit: 90,
    finishes: [
      { id: "none", name: "Энгийн", multiplier: 1 },
      { id: "matte", name: "Матт лак", multiplier: 1.3 },
      { id: "gloss", name: "Гялгар лак", multiplier: 1.35 },
      { id: "emboss", name: "Дэвүүн (emboss)", multiplier: 1.8 },
      { id: "foil", name: "Алтадмал (foil)", multiplier: 2.2 },
    ],
  },
]

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export const DEMO_ORDERS: Order[] = [
  {
    code: "LN-8QK2P1",
    createdAt: daysAgo(2),
    status: "printing",
    productName: "Хулдаасан баннер",
    spec: "3.0 x 2.0м · Флекс 440гр · Люверстэй",
    quantity: 1,
    total: 118800,
    customer: {
      name: "Батболд",
      phone: "99112233",
      email: "batbold@example.mn",
      note: "Логог төвд байрлуулна уу",
    },
    fileName: "banner-final.pdf",
    timeline: [
      { status: "received", at: daysAgo(2), note: "Захиалга хүлээн авлаа" },
      { status: "design", at: daysAgo(1), note: "Файл шалгагдаж баталгаажлаа" },
      { status: "printing", at: daysAgo(0), note: "Хэвлэлт эхэллээ" },
    ],
  },
  {
    code: "LN-3MW7Z2",
    createdAt: daysAgo(5),
    status: "delivered",
    productName: "Нэрийн хуудас",
    spec: "500ш · 350гр · Матт лак · 2 тал",
    quantity: 500,
    total: 58500,
    customer: { name: "Сараа", phone: "88445566", email: "saraa@example.mn" },
    fileName: "namecard.ai",
    timeline: [
      { status: "received", at: daysAgo(5) },
      { status: "design", at: daysAgo(5) },
      { status: "printing", at: daysAgo(4) },
      { status: "ready", at: daysAgo(3) },
      { status: "delivered", at: daysAgo(2), note: "Хүлээлгэн өглөө" },
    ],
  },
  {
    code: "LN-5RT9LK",
    createdAt: daysAgo(0),
    status: "received",
    productName: "Roll-up стенд",
    spec: "2ш · 85x200см",
    quantity: 2,
    total: 190000,
    customer: { name: "Тэмүүлэн", phone: "95012345", email: "temka@example.mn" },
    timeline: [{ status: "received", at: daysAgo(0), note: "Төлбөр хүлээгдэж байна" }],
  },
]

export const COMPANY = {
  name: "LOGONEST",
  fullName: "LOGONEST ХХК",
  phone: "+(976) 77414477, 86006055",
  email: "info@logonest.mn",
  address: "Улаанбаатар, БЗД, 6-р хороо, Эрхэт худалдааны төв, 2 давхарт",
  hours: "Даваа–Бямба 09:00–19:00",
  established: 2009,
}

export const STATS = [
  { label: "Гүйцэтгэсэн захиалга", value: "42,000+" },
  { label: "Жилийн туршлага", value: "15" },
  { label: "Байнгын харилцагч", value: "1,200+" },
  { label: "Дундаж хугацаа", value: "24 цаг" },
]

export const NEWS = [
  {
    id: "n1",
    title: "Шинэ UV flatbed принтер суурилууллаа",
    date: "2026-07-28",
    excerpt:
      "Одоо шил, мод, металл зэрэг хатуу гадаргуу дээр шууд хэвлэх боломжтой боллоо.",
    tag: "Технологи",
  },
  {
    id: "n2",
    title: "Намрын урамшуулал: нэрийн хуудас 20% хямдрал",
    date: "2026-08-01",
    excerpt: "8-р сард 500-аас дээш нэрийн хуудас захиалбал 20% хямдралтай.",
    tag: "Урамшуулал",
  },
  {
    id: "n3",
    title: "Дизайн бэлдэх зөвлөмж: CMYK ба bleed",
    date: "2026-06-15",
    excerpt: "Хэвлэлд өгөх файлаа хэрхэн зөв бэлдэх талаар товч зөвлөгөө.",
    tag: "Зөвлөгөө",
  },
]

export const FAQS = [
  {
    q: "Захиалга хэдэн хоногт бэлэн болох вэ?",
    a: "Нэрийн хуудас, брошур зэрэг оффсет хэвлэл 1-2 ажлын өдөр, өргөн формат ихэвчлэн тухайн өдөртөө буюу 24 цагт бэлэн болно.",
  },
  {
    q: "Дизайн хийлгэх боломжтой юу?",
    a: "Тийм. Манай дизайнерууд таны санааг үндэслэн макет бэлдэж өгнө. Дизайны төлбөр захиалгын нийлбэрт нэмэгдэнэ.",
  },
  {
    q: "Файлаа ямар форматаар өгөх вэ?",
    a: "PDF (bleed-тэй), AI, PSD, эсвэл өндөр нягтралтай (300dpi) TIFF/JPG форматаар CMYK өнгөөр өгөхийг зөвлөж байна.",
  },
  {
    q: "Хүргэлт хийдэг үү?",
    a: "Улаанбаатар хотын дотор хүргэлттэй. Захиалгын хэмжээ, байршлаас хамаарч төлбөр тодорхойлогдоно.",
  },
]

export const TESTIMONIALS = [
  {
    name: "Э. Ганзориг",
    role: "Маркетингийн менежер, TechMongolia",
    body: "Хугацаандаа, амласан чанараар нь бэлэн болгодог. Өргөн форматын өнгө маш тод гардаг.",
  },
  {
    name: "Б. Оюунаа",
    role: "Эзэн, Coffee Lab",
    body: "Меню, наалт, баннераа энд хэвлүүлдэг. Онлайн тооцоолуур нь төсвөө урьдчилан мэдэхэд их тусалдаг.",
  },
  {
    name: "Д. Мөнхбат",
    role: "Ивент зохион байгуулагч",
    body: "Roll-up болон том баннерыг яаралтай хийлгэхэд үргэлж аварч байсан. Найдвартай хамтрагч.",
  },
]
