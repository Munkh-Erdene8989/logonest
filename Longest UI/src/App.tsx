import { lazy, Suspense, useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import { BlockSkeleton } from "./components/Skeleton"
import { Section } from "./components/ui"

const Landing = lazy(() => import("./pages/Landing"))
const Products = lazy(() => import("./pages/Products"))
const ProductDetail = lazy(() => import("./pages/ProductDetail"))
const CalculatorPage = lazy(() => import("./pages/CalculatorPage"))
const OrderPage = lazy(() => import("./pages/OrderPage"))
const TrackPage = lazy(() => import("./pages/TrackPage"))
const News = lazy(() => import("./pages/News"))
const Contact = lazy(() => import("./pages/Contact"))
const Admin = lazy(() => import("./pages/Admin"))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PageFallback() {
  return (
    <Section className="py-16">
      <BlockSkeleton />
    </Section>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
