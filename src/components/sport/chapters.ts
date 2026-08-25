export type Chapter = {
  id: string
  kicker?: string
  title: string
  body?: string
  align: "left" | "right" | "center"
  fadeIn: number
  fadeOut: number
  showCta?: boolean
  showBenefits?: boolean
}

export const CHAPTERS: Chapter[] = [
  {
    id: "hero",
    kicker: "LOGONEST",
    title: "3D загвар",
    body: "Хүссэн загвараа 3D-р бүтээ.\nҮлдсэнийг бид хариуцъя.",
    align: "left",
    fadeIn: 0,
    fadeOut: 0.11,
    showCta: true,
  },
  {
    id: "identity",
    kicker: "Гүйцэтгэл онцлогтойгоо нийлнэ",
    title: "Илүү том зорилгод зориулсан",
    body: "Нэг цамц — бүхэл бүтэн түүх. Гүйлгэх тусам цамцыг гартаа авч үзэж байгаа мэт мэдрэгдэнэ.",
    align: "left",
    fadeIn: 0.12,
    fadeOut: 0.26,
  },
  {
    id: "fabric",
    kicker: "01 — Даавуу",
    title: "Амьсгалдаг даавуу",
    body: "Техникийн сархиаг тор агаарын урсгалыг нээж, хөдөлгөөнийг хөнгөн байлгана.",
    align: "right",
    fadeIn: 0.28,
    fadeOut: 0.4,
  },
  {
    id: "stitch",
    kicker: "02 — Бүтэц",
    title: "Бат бөх оёдол",
    body: "Мөр, зах, хажуугийн оёдол өндөр ачаалалд зориулагдсан. Нарийн бүтцийг ойртуулж харна уу.",
    align: "left",
    fadeIn: 0.42,
    fadeOut: 0.53,
  },
  {
    id: "vent",
    kicker: "03 — Агааржуулалт",
    title: "Агааржуулалтын бүс",
    body: "Хажуугийн тор хэсгүүд биеийн халууныг гадагшлуулж, тоглоомын турш сэрүүн байлгана.",
    align: "right",
    fadeIn: 0.55,
    fadeOut: 0.66,
  },
  {
    id: "construct",
    kicker: "04 — Давхарга",
    title: "Хөнгөн, техникийн бүтэц",
    body: "Даавуу, доторлогоо, оёдлын давхаргыг нэг дор харж, энэ цамц яагаад хөнгөн хэвээрээ бат бөх байдгийг ойлгоно.",
    align: "left",
    fadeIn: 0.68,
    fadeOut: 0.8,
  },
  {
    id: "finale",
    kicker: "LOGONEST спорт",
    title: "Загвараа 3D-р бүтээ",
    body: "Өнгө, лого, хэмжээ — бүгдийг нь бид хариуцна.",
    align: "center",
    fadeIn: 0.82,
    fadeOut: 1,
    showCta: true,
    showBenefits: true,
  },
]

export type JerseyKeyframe = {
  t: number
  rotationY: number
  rotationX: number
  rotationZ: number
  camX: number
  camY: number
  camZ: number
  lookX: number
  lookY: number
  lookZ: number
  fov: number
  fabric: number
  stitch: number
  vent: number
  construct: number
}

export const KEYFRAMES: JerseyKeyframe[] = [
  {
    t: 0,
    rotationY: 0.22,
    rotationX: 0.06,
    rotationZ: 0,
    camX: 0.12,
    camY: 0.42,
    camZ: 5.35,
    lookX: 0,
    lookY: 0.12,
    lookZ: 0,
    fov: 32,
    fabric: 0,
    stitch: 0,
    vent: 0,
    construct: 0,
  },
  {
    t: 0.12,
    rotationY: 0.88,
    rotationX: 0.1,
    rotationZ: -0.04,
    camX: -0.45,
    camY: 0.48,
    camZ: 4.15,
    lookX: 0,
    lookY: 0.18,
    lookZ: 0,
    fov: 30,
    fabric: 0,
    stitch: 0,
    vent: 0,
    construct: 0,
  },
  {
    t: 0.28,
    rotationY: 0.12,
    rotationX: 0.38,
    rotationZ: 0,
    camX: 0.05,
    camY: 0.15,
    camZ: 2.28,
    lookX: 0,
    lookY: 0.05,
    lookZ: 0,
    fov: 26,
    fabric: 1,
    stitch: 0.15,
    vent: 0,
    construct: 0,
  },
  {
    t: 0.42,
    rotationY: -0.42,
    rotationX: 0.52,
    rotationZ: 0.06,
    camX: 0.55,
    camY: 1.15,
    camZ: 2.05,
    lookX: 0.15,
    lookY: 0.85,
    lookZ: 0,
    fov: 28,
    fabric: 0.2,
    stitch: 1,
    vent: 0,
    construct: 0,
  },
  {
    t: 0.55,
    rotationY: 1.42,
    rotationX: 0.04,
    rotationZ: 0,
    camX: 1.65,
    camY: 0.28,
    camZ: 3.15,
    lookX: 0.2,
    lookY: 0.08,
    lookZ: 0,
    fov: 30,
    fabric: 0,
    stitch: 0.25,
    vent: 1,
    construct: 0,
  },
  {
    t: 0.68,
    rotationY: 3.05,
    rotationX: 0.12,
    rotationZ: 0,
    camX: 0,
    camY: 0.22,
    camZ: 3.55,
    lookX: 0,
    lookY: 0.05,
    lookZ: 0,
    fov: 31,
    fabric: 0.1,
    stitch: 0.35,
    vent: 0.2,
    construct: 1,
  },
  {
    t: 0.82,
    rotationY: 6.2,
    rotationX: 0.07,
    rotationZ: 0,
    camX: 0.08,
    camY: 0.45,
    camZ: 5.2,
    lookX: 0,
    lookY: 0.12,
    lookZ: 0,
    fov: 32,
    fabric: 0.2,
    stitch: 0.2,
    vent: 0.2,
    construct: 0.15,
  },
  {
    t: 1,
    rotationY: 6.55,
    rotationX: 0.05,
    rotationZ: 0,
    camX: 0,
    camY: 0.4,
    camZ: 5.05,
    lookX: 0,
    lookY: 0.1,
    lookZ: 0,
    fov: 32,
    fabric: 0,
    stitch: 0,
    vent: 0,
    construct: 0,
  },
]

export const BENEFITS = [
  { id: "breath", label: "Амьсгалдаг даавуу" },
  { id: "stitch", label: "Бат бөх оёдол" },
  { id: "light", label: "Хөнгөн тав тух" },
] as const
