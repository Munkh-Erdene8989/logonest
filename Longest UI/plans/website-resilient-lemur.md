# Хэвлэлийн газрын вэбсайт — Төлөвлөгөө

## Context
Хэрэглэгч хэвлэлийн газрын (printing house) вэбсайт бүтээхийг хүсэж байна. Одоогийн repo нь цэвэр Figma Make scaffold (React 19 + Vite + Tailwind v4, router байхгүй, `App.tsx` дотор зөвхөн demo dot-grid). Зорилго: захиалагч нэвтрэхгүйгээр бүтээгдэхүүн үзэж, үнэ тооцож, захиалга өгч, захиалгын явцаа утас/имэйлээр хянадаг, мөн бүх зүйлийг удирддаг админ самбартай, хурдан ачаалдаг, бүх төхөөрөмж дээр эвдрэлгүй SPA бүтээх. Бүх дата demo (client-side, localStorage) байна.

Дизайн: орчин үеийн, цэвэрхэн — цагаан суурь, тод accent өнгө.

## Approach
SPA-г `react-router-dom`-оор олон route болгон бүтээнэ. Бүх дата client-side: анхны demo дата (`src/data/*.ts`) + localStorage-д хадгалагдах захиалга/бүтээгдэхүүн (custom hook-оор). Backend байхгүй.

Хэрэгжүүлэхээс өмнө: `Skill('make:aesthetic-stance')` дуудаж, дараа нь `create_make_theme`-ийг 1-2 өгүүлбэрийн brief-тэй дуудаж, font/token сонголтыг `src/index.css`-д тохируулна.

### Dependencies (шинээр)
- `react-router-dom` — routing
- `lucide-react` — icon-ууд
- (шаардлагатай бол) `recharts` — админ дашбордын график

### Файлын бүтэц
- `src/main.tsx` — `<BrowserRouter>`-оор App-г ороож өгнө
- `src/App.tsx` — `<Routes>` + layout (public shell vs admin shell)
- `src/index.css` — фонт wiring, дизайн token (accent өнгө, radius, shadow)
- `src/data/` — `products.ts`, `orders.ts`, `pricing.ts` (demo дата + үнийн формул)
- `src/lib/` — `storage.ts` (localStorage hook), `pricing.ts` (тооцоолуурын логик), `format.ts` (₮ форматлах)
- `src/components/` — дундын UI: `Navbar`, `Footer`, `Skeleton` (skeleton bone), `ProductCard`, `Section`, `Button`, `Input` гэх мэт
- `src/components/admin/` — админ самбарын дундын хэсгүүд
- `src/pages/` — доорх route бүрд нэг компонент

### Route-ууд (public)
1. `/` — **Landing page**: hero, компанийн танилцуулга, үйлчилгээ, онцлох бүтээгдэхүүн, статистик, сэтгэгдэл, CTA, footer
2. `/products` — **Бүтээгдэхүүний жагсаалт**: категори filter, хайлт, grid, ачаалахад skeleton
3. `/products/:id` — бүтээгдэхүүний дэлгэрэнгүй + "Захиалах" / "Үнэ тооцох"
4. `/calculator` — **Тооцоолуур**: хэвлэлийн төрөл (өргөн формат м², хулдаасан, дэвүүн/лаклах гэх мэт), хэмжээ, материал, тоо ширхэг → үнэ бодит хугацаанд бодогдоно
5. `/order` — **Захиалга хийх**: multi-step (бүтээгдэхүүн/параметр → файл хавсаргах (demo) → холбоо барих мэдээлэл → баталгаажуулалт). Захиалга үүсэхэд захиалгын дугаар + утас/имэйл өгнө
6. `/track` — **Захиалга хянах**: захиалгын дугаар ЭСВЭЛ утас/имэйлээр хайж явцын timeline (Хүлээн авсан → Дизайн → Хэвлэлт → Бэлэн → Хүргэсэн) харуулна — нэвтрэх шаардлагагүй
7. Нэмэлт (доор)

### Route-ууд (admin) — `/admin`
Энгийн demo нэвтрэлт (localStorage flag, demo нууц үг). Дашбордоос БҮХ зүйлийг удирдана:
- Тойм: захиалгын тоо, орлого, статусын хуваарилалт (recharts)
- Захиалгын удирдлага: жагсаалт, статус өөрчлөх, дэлгэрэнгүй
- Бүтээгдэхүүний CRUD (нэмэх/засах/устгах — localStorage)
- Тооцоолуурын үнэ/материалын тохиргоо (м² үнэ гэх мэт)
- Хэрэглэгчийн зурвас/холбоо барих хүсэлтүүд

### Нэмэлт санал болгож буй модулиуд
- **Файл хавсаргах** (захиалгад дизайн файл оруулах — demo preview)
- **Мэдээ / блог** (`/news`) — хэвлэлийн зөвлөгөө, урамшуулал
- **Түгээмэл асуулт (FAQ)** ба **Холбоо барих** (`/contact`) — газрын зураг, форм
- **Портфолио галерей** — өмнөх ажлууд
- **Урамшуулал / хямдралын баннер**
- **Хэл сонголт бэлтгэл** (MN анхдагч)

### Performance ба resilience (хэрэглэгчийн шаардлага)
- **Route-level code splitting**: `React.lazy` + `<Suspense>` бүх page-д → эхний ачаалал хөнгөн
- **Skeleton bone**: жагсаалт/дэлгэрэнгүй/дашборд ачаалах үед `Skeleton` компонент (`animate-pulse`) — demo дата-г богино delay-тэй симуляц хийж skeleton харуулна
- **Responsive**: mobile-first Tailwind, hamburger цэс, grid `sm/md/lg` breakpoint-ууд, ямар ч төхөөрөмж дээр эвдрэлгүй
- Зураг lazy-load (`loading="lazy"`), Unsplash-аас чанартай зураг (`Skill('make:unsplash')`)

## Verification
- Dev server аль хэдийн ажиллаж байгаа (`$PORT`), preview-д шалгана
- `pnpm build` амжилттай эсэхийг шалгах (route splitting, TS алдаагүй)
- Гарын авлагаар: landing → products → calculator (үнэ бодогдох) → order (захиалга үүсэх, дугаар авах) → track (тэр дугаар/утсаар хайж явц харах) → admin (нэвтрэх, захиалгын статус солих → track дээр тусгалаа олох)
- Mobile ба desktop өргөнд responsive-ыг шалгах
