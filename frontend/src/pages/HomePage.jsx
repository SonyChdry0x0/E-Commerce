import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../services/api";
import { addToCart, removeFromCart } from "../store/cartSlice";

import AuthModal from "../components/AuthModal";
import "@fontsource/cormorant-garamond";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function resolveImage(product) {
  const raw = product.images?.[0] || product.image || product.img;
  if (!raw) return "https://placehold.co/600x800/f4f4f5/a1a1aa?text=No+Image";
  if (raw.startsWith("http")) return raw;
  return `${BACKEND_URL}/${raw.replace(/^\//, "")}`;
}

const CATEGORIES = [
  { label: "Men", to: "/shop?category=Men", img: "/boys.png" },
  { label: "Women", to: "/shop?category=Women", img: "/girlsphoto.png" },
  { label: "Kids", to: "/shop?category=Kids", img: "/cute.png" },
  { label: "Shoes", to: "/shop?category=Shoes", img: "/shoessss.png" },
];

const PERKS = [
  { icon: "🚚", title: "Fast Delivery", desc: "Reliable shipping to your doorstep, every time." },
  { icon: "🔒", title: "Secure Payments", desc: "100% secure checkout with trusted providers." },
  { icon: "⭐", title: "Premium Quality", desc: "Carefully curated products made to last." },
  { icon: "♻️", title: "Easy Returns", desc: "Hassle-free 30-day returns, no questions asked." },
];

const REVIEWS = [
  {
    name: "Sarah Johnson", initials: "SJ",
    review: "The quality exceeded my expectations. Definitely ordering again. The fit is perfect.",
    location: "New York, US",
  },
  {
    name: "Michael Carter", initials: "MC",
    review: "Fast delivery and amazing customer support. I will be a customer for life.",
    location: "London, UK",
  },
  {
    name: "Emma Wilson", initials: "EW",
    review: "Stylish, comfortable, and exactly what I was looking for. The linen blazer is stunning.",
    location: "Sydney, AU",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Hero Slides Config ───────────────────────────────────────────────────────

const heroSlides = [
  {
    id: "new",
    badge: "✦ New Season",
    badgeStyle: "bg-[#1a1a1a] text-[#f5f0e8]",
    titleLine1: "Fresh",
    titleLine2: "Season",
    titleLine3: "Arrivals",
    accentColor: "#8B6F47",
    subtitle: "Premium styles crafted for everyday elegance — designed to elevate your wardrobe instantly.",
    subtitleColor: "text-[#5a4a3a]",
    titleColor: "text-[#1a1a1a]",
    bg: "bg-[#f5f0e8]",
    imgBg: "bg-[#e0d5c5]",
    imgSrc: "/girlsphoto.png",
    btn1: { text: "Shop Now →", to: "/shop", style: "bg-[#1a1a1a] text-[#f5f0e8] hover:opacity-80" },
    btn2: { text: "New Arrivals", to: "/shop?new=true", style: "border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white" },
    floatingTags: [
      {
        pos: "top-8 right-5",
        bg: "bg-white",
        icon: "🌿",
        label: "Just dropped",
        value: "Spring Edit",
        labelColor: "text-[#8a7a6a]",
        valueColor: "text-[#1a1a1a]",
      },
      {
        pos: "bottom-14 -left-2",
        bg: "bg-[#1a1a1a]",
        icon: "⭐",
        label: "4.9 Rating",
        value: "2.4k reviews",
        labelColor: "text-white",
        valueColor: "text-white/50",
      },
    ],
    dotActive: "bg-[#1a1a1a]",
    dotInactive: "bg-[#1a1a1a]/25",
    progressColor: "bg-[#1a1a1a]/40",
  },
  {
    id: "sale",
    badge: "🔥 Hot Deal",
    badgeStyle: "bg-[#E53935] text-white",
    titleLine1: "Mega",
    titleLine2: "Summer",
    titleLine3: "Sale",
    accentColor: "#F4A261",
    subtitle: "Don't miss our biggest seasonal discounts. Limited-time offers on trending fashion pieces.",
    subtitleColor: "text-white/60",
    titleColor: "text-white",
    bg: "bg-[#1B2A3B]",
    imgBg: "bg-[#263D52]",
    imgSrc: "/reals.png",
    btn1: { text: "Shop Sale →", to: "/shop?sale=true", style: "bg-[#E53935] text-white hover:bg-[#c62828]" },
    btn2: { text: "View Deals", to: "/shop", style: "border border-white/30 text-white/80 hover:bg-white/10" },
    saleBlock: true,
    floatingTags: [
      {
        pos: "top-8 right-4",
        bg: "bg-[#E53935]",
        icon: null,
        label: "Limited time",
        value: "Ends in 2 days",
        labelColor: "text-white/80",
        valueColor: "text-white",
      },
    ],
    dotActive: "bg-white",
    dotInactive: "bg-white/30",
    progressColor: "bg-white/40",
  },
  {
    id: "collection",
    badge: "✦ Premium Edit",
    badgeStyle: "bg-[#b89d86]/20 text-[#b89d86] border border-[#b89d86]/30",
    titleLine1: "The",
    titleLine2: "Premium",
    titleLine3: "Collection",
    accentColor: "#b89d86",
    subtitle: "A curated edit of modern essentials and timeless classics — made for those who wear confidence.",
    subtitleColor: "text-white/55",
    titleColor: "text-white",
    bg: "bg-[#805032]",
    imgBg: "bg-[#8f6043]",
    imgSrc: "/bioess.png",
    btn1: { text: "Explore →", to: "/shop", style: "bg-[#b89d86] text-white hover:bg-[#a88c75]" },
    btn2: { text: "Trending Now", to: "/shop?featured=true", style: "border border-white/20 text-white/80 hover:bg-white/10" },
    pills: ["🧵 Premium fabrics", "✂️ Tailored fit", "🌍 Ethically made"],
    floatingTags: [
      {
        pos: "bottom-14 right-4",
        bg: "bg-[#1e1a17]/95",
        icon: "👑",
        label: "Collection",
        value: "SS 2026",
        labelColor: "text-[#b89d86]/70",
        valueColor: "text-[#b89d86]",
        border: "border border-[#b89d86]/30",
      },
    ],
    dotActive: "bg-[#b89d86]",
    dotInactive: "bg-white/30",
    progressColor: "bg-white/30",
  },
];

// ─── ProductCardHome ──────────────────────────────────────────────────────────

function ProductCardHome({ product, favorites, onToggleFavorite, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [added, setAdded] = useState(false);

  const hasSizes = product.sizes?.length > 0;

  const handleQuickAdd = () => {
    if (hasSizes && !selectedSize) { setShowSizePicker(true); return; }
    onAddToCart(product, selectedSize);
    setAdded(true);
    setShowSizePicker(false);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setShowSizePicker(false);
    onAddToCart(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group cursor-pointer min-w-0 w-full overflow-hidden">
      <div className="relative bg-[#f0ebe3] overflow-hidden aspect-[3/4] w-full min-h-[160px] h-[200px] sm:h-[230px] md:h-[300px]">
        {product.isNew && (
          <span className="absolute top-3 left-3 z-10 bg-[#1a1a1a] text-white text-[10px] font-medium px-2.5 py-1 rounded-full">New</span>
        )}
        {product.stock < 5 && !product.isNew && (
          <span className="absolute top-3 left-3 z-10 bg-[#faeeda] text-[#633806] text-[10px] font-medium px-2.5 py-1 rounded-full">Low stock</span>
        )}
        <button
          onClick={() => onToggleFavorite(product)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center z-10 hover:scale-110 transition text-sm"
          aria-label={favorites[product._id] ? "Remove from wishlist" : "Add to wishlist"}
        >
          {favorites[product._id] ? "❤️" : "♡"}
        </button>
        <img
          src={resolveImage(product)}
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x800/f4f4f5/a1a1aa?text=No+Image"; }}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[0.16,1,0.3,1] filter contrast-105 brightness-95"
        />
        {showSizePicker && hasSizes && (
          <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center gap-3 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]">Select a size</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className="min-w-[36px] h-9 px-2.5 rounded-lg border text-xs font-medium transition-all hover:bg-[#1a1a1a] hover:text-white"
                  style={{ borderColor: "#1a1a1a", background: "white", color: "#1a1a1a" }}
                >
                  {size}
                </button>
              ))}
            </div>
            <button onClick={() => setShowSizePicker(false)} className="text-[11px] text-[#8a7a6a] underline mt-1">Cancel</button>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 py-3 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center z-10">
          <span className="text-xs font-medium text-[#1a1a1a]">{added ? "✓ Added!" : "Quick add"}</span>
          <button
            onClick={handleQuickAdd}
            className="w-7 h-7 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-lg leading-none hover:bg-[#333] transition"
            aria-label="Add to cart"
          >+</button>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between items-start gap-2">
          <p className="text-sm font-medium text-[#1a1a1a] truncate">{product.name}</p>
          <p className="text-sm font-bold whitespace-nowrap text-[#b89d86]">${product.price}</p>
        </div>
        {hasSizes && (
          <div className="flex gap-1 flex-wrap mt-2">
            {product.sizes.slice(0, 3).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(selectedSize === s ? "" : s)}
                className="text-[10px] border rounded px-1.5 py-0.5 transition-all"
                style={{
                  borderColor: selectedSize === s ? "#1a1a1a" : "#e0d8cc",
                  background: selectedSize === s ? "#1a1a1a" : "transparent",
                  color: selectedSize === s ? "#fff" : "#8a7a6a",
                }}
              >{s}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HeroSection ─────────────────────────────────────────────────────────────

function HeroSection() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const autoRef = useRef(null);
  const total = heroSlides.length;

  const goTo = (n) => {
    const next = (n + total) % total;
    setHeroIndex(next);
    setAnimKey((k) => k + 1);
  };

  useEffect(() => {
    if (isHovered) { clearInterval(autoRef.current); return; }
    autoRef.current = setInterval(() => goTo(heroIndex + 1), 2000);
    return () => clearInterval(autoRef.current);
  }, [heroIndex, isHovered]);

  const slide = heroSlides[heroIndex];

  return (
    <section className="px-3 md:px-6 pt-10 md:pt-20 pb-6 bg-white">
      <div
        className="max-w-6xl mx-auto overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.14)]"
        style={{ borderRadius: "16px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative ${slide.bg} transition-colors duration-700`}>

          {/* ── MOBILE layout ── */}
          <div className="flex flex-col md:hidden">
            <div className={`w-full ${slide.imgBg} relative overflow-hidden`} style={{ height: 320 }}>
              <img
                key={`mob-img-${heroIndex}`}
                src={slide.imgSrc}
                alt={slide.titleLine2}
                className="w-full h-full block"
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            </div>
            <div className="px-6 py-6">
              <span className={`inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[3px] font-medium px-3 py-1.5 rounded-full mb-4 ${slide.badgeStyle}`}>
                {slide.badge}
              </span>
              <h1 className={`font-serif text-3xl font-light leading-[1.05] ${slide.titleColor}`}>
                {slide.titleLine1}<br />
                <em className="not-italic font-light" style={{ color: slide.accentColor }}>{slide.titleLine2}</em><br />
                {slide.titleLine3}
              </h1>
              <div className="flex gap-2 mt-5 flex-wrap">
                <Link to={slide.btn1.to} className={`px-5 py-2.5 rounded-lg text-xs font-medium transition-all ${slide.btn1.style}`}>
                  {slide.btn1.text}
                </Link>
                <Link to={slide.btn2.to} className={`px-5 py-2.5 rounded-lg text-xs font-medium transition-all ${slide.btn2.style}`}>
                  {slide.btn2.text}
                </Link>
              </div>
              {/* Dots */}
              <div className="flex gap-2 mt-6">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIndex ? `w-5 ${slide.dotActive}` : `w-1.5 ${slide.dotInactive}`}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── DESKTOP layout ── */}
          <div className="hidden md:grid grid-cols-2 items-stretch" style={{ height: 560 }}>

            {/* Left: text */}
            <div className="flex flex-col justify-center px-12 lg:px-16 py-8 relative z-10">
              <motion.div
                key={`badge-${animKey}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[3px] font-medium px-4 py-1.5 rounded-full mb-4 ${slide.badgeStyle}`}>
                  {slide.badge}
                </span>
              </motion.div>

              <motion.h1
                key={`title-${animKey}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`font-serif font-light leading-[0.97] mb-4 ${slide.titleColor}`}
                style={{ fontSize: "clamp(38px, 4.2vw, 54px)" }}
              >
                {slide.titleLine1}<br />
                <em className="italic" style={{ color: slide.accentColor }}>{slide.titleLine2}</em><br />
                {slide.titleLine3}
              </motion.h1>

              <motion.p
                key={`sub-${animKey}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`text-sm font-light leading-relaxed max-w-sm mb-4 ${slide.subtitleColor}`}
              >
                {slide.subtitle}
              </motion.p>

              {/* Sale block */}
              {slide.saleBlock && (
                <motion.div
                  key={`sale-${animKey}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: 0.18 }}
                  className="flex items-center gap-4 mb-4"
                >
                  <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-center">
                    <div className="font-serif text-sm font-light text-white">UP TO</div>
                    <div className="font-serif font-semibold leading-none" style={{ fontSize: 36, color: slide.accentColor }}>60%</div>
                    <div className="text-[10px] tracking-[2px] uppercase text-white/50">OFF</div>
                  </div>
                  <div className={`text-xs leading-7 ${slide.subtitleColor}`}>
                    <div>✓ Free shipping over $50</div>
                    <div>✓ Easy 30-day returns</div>
                    <div>✓ 500+ items on sale</div>
                  </div>
                </motion.div>
              )}

              {/* Pill tags */}
              {slide.pills && (
                <motion.div
                  key={`pills-${animKey}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.18 }}
                  className="flex gap-2 flex-wrap mb-4"
                >
                  {slide.pills.map((p) => (
                    <span key={p} className="text-xs bg-white/8 border border-white/12 text-white/70 px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                      {p}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Buttons */}
              <motion.div
                key={`btns-${animKey}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.22 }}
                className="flex gap-3 flex-wrap"
              >
                <Link to={slide.btn1.to} className={`px-6 py-3 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5 ${slide.btn1.style}`}>
                  {slide.btn1.text}
                </Link>
                <Link to={slide.btn2.to} className={`px-6 py-3 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5 ${slide.btn2.style}`}>
                  {slide.btn2.text}
                </Link>
              </motion.div>

              {/* Dots */}
              <div className="flex gap-2 mt-6">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIndex ? `w-6 ${slide.dotActive}` : `w-1.5 ${slide.dotInactive}`}`}
                  />
                ))}
              </div>
            </div>

            {/* Right: image */}
            <div className={`relative overflow-hidden ${slide.imgBg}`} style={{ height: "100%" }}>
              {/* Decorative circle for sale slide */}
              {slide.id === "sale" && (
                <>
                  <div className="absolute top-6 right-6 w-20 h-20 rounded-full border border-[#F4A261]/30 opacity-60" />
                  <div className="absolute top-12 right-14 w-10 h-10 rounded-full border border-[#F4A261]/20 opacity-40" />
                </>
              )}
              {/* Gold shimmer for premium */}
              {slide.id === "collection" && (
                <div className="absolute bottom-0 left-0 right-0 h-3/5 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(184,157,134,0.1), transparent)" }} />
              )}

              <motion.img
                key={`img-${heroIndex}`}
                src={slide.imgSrc}
                alt={slide.titleLine2}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute",
                  top: slide.id === "sale" ? "0px" : "-20px",
                  left: 0,
                  width: "100%",
                  height: "110%",
                  objectFit: "contain",
                  objectPosition: "center top",
                  zIndex: 10,
                }}
              />

              {/* Floating tags */}
              {slide.floatingTags?.map((tag, ti) => (
                <div
                  key={ti}
                  className={`absolute z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-xl ${tag.bg} ${tag.pos} ${tag.border || ""}`}
                >
                  {tag.icon && <span className="text-base">{tag.icon}</span>}
                  <div>
                    <div className={`text-[10px] font-normal ${tag.labelColor}`}>{tag.label}</div>
                    <div className={`text-xs font-semibold ${tag.valueColor}`}>{tag.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nav arrows */}
          <button
            onClick={() => goTo(heroIndex - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full  items-center justify-center text-white text-lg transition-opacity hover:opacity-70 md:flex hidden"
            style={{ background: "rgba(0,0,0,0.18)", backdropFilter: "blur(4px)" }}
            aria-label="Previous slide"
          >‹</button>
          <button
            onClick={() => goTo(heroIndex + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full  items-center justify-center text-white text-lg transition-opacity hover:opacity-70 md:flex hidden"
            style={{ background: "rgba(0,0,0,0.18)", backdropFilter: "blur(4px)" }}
            aria-label="Next slide"
          >›</button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 z-30" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div
              key={`progress-${animKey}-${isHovered}`}
              className={`h-full rounded-none ${slide.progressColor}`}
              style={{
                animation: isHovered ? "none" : "heroProgress 2s linear forwards",
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [favorites, setFavorites] = useState({});
  const [featured, setFeatured] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => !!state.auth?.user);

  const requireAuth = (action) => {
    if (isLoggedIn) { action(); } else { setPendingAction(() => action); setShowAuth(true); }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    if (pendingAction) { pendingAction(); setPendingAction(null); }
  };

  const toggleFavorite = (product) => {
    requireAuth(() => {
      if (favorites[product._id]) {
        dispatch(removeFromCart(product._id));
        setFavorites((prev) => ({ ...prev, [product._id]: false }));
      } else {
        dispatch(addToCart({ ...product, qty: 1 }));
        setFavorites((prev) => ({ ...prev, [product._id]: true }));
      }
    });
  };

  const addToCartGuarded = (product, size) => {
    requireAuth(() => { dispatch(addToCart({ ...product, qty: 1, size })); });
  };

  useEffect(() => {
    getProducts({ featured: true })
      .then((res) => {
        const payload = res.data;
        const data = Array.isArray(payload) ? payload : (payload.products ?? payload.data ?? payload.items ?? []);
        setFeatured(data);
      })
      .finally(() => setLoaded(true));
  }, []);

  return (
    <>
      <AuthModal
        isOpen={showAuth}
        onClose={() => { setShowAuth(false); setPendingAction(null); }}
        onSuccess={handleAuthSuccess}
      />

      <div className="min-h-screen bg-white text-[#1a1a1a] antialiased">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <HeroSection />

        {/* ── SHOP BY CATEGORY ─────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          >
            <div>
              <p className="text-[11px] font-medium tracking-widest uppercase text-[#8a7a6a] mb-1">Browse</p>
              <h2 className="text-3xl md:text-4xl font-serif text-[#1a1a1a]">Shop by category</h2>
            </div>
            <Link to="/shop" className="mt-3 md:mt-0 text-sm text-[#8a7a6a] hover:underline">View all →</Link>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10"
          >
            {CATEGORIES.map(({ label, to, img }) => (
              <motion.div key={label} variants={fadeUp} whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
                <Link to={to} className="group flex flex-col items-center text-center">
                  <div className="w-28 h-28 md:w-44 md:h-44 rounded-full overflow-hidden bg-[#f0ebe3] shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <img src={img} alt={label} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="mt-5 text-base md:text-lg font-medium text-[#1a1a1a]">{label}</p>
                  <p className="mt-1 text-[11px] text-[#8a7a6a] uppercase tracking-widest">Explore →</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <hr className="border-none h-px bg-[#ede7de] mx-6" />

        {/* ── NEW ARRIVALS ─────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-[11px] font-medium tracking-widest uppercase text-[#8a7a6a] mb-1">Just dropped</p>
              <h2 className="text-3xl font-serif text-[#1a1a1a]">New arrivals</h2>
            </div>
            <Link to="/shop?new=true" className="text-sm text-[#8a7a6a] hover:underline">View all →</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full">
            {loaded &&
              featured
                .filter((product) => product.isNew)
                .slice(0, window.innerWidth < 768 ? 4 : 5)
                .map((product) => (
                  <div key={product._id} className="w-full">
                    <ProductCardHome product={product} favorites={favorites} onToggleFavorite={toggleFavorite} onAddToCart={addToCartGuarded} />
                  </div>
                ))}
            {!loaded &&
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-[#f0ebe3] rounded-xl aspect-[3/4]" />
                  <div className="mt-3 h-4 bg-[#f0ebe3] rounded w-3/4" />
                  <div className="mt-2 h-4 bg-[#f0ebe3] rounded w-1/3" />
                </div>
              ))}
          </div>
        </section>

        <hr className="border-none h-px bg-[#ede7de] mx-6" />

        {/* ── FEATURED DROPS ───────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] font-medium tracking-widest uppercase text-[#8a7a6a] mb-1">Handpicked</p>
              <h2 className="text-3xl font-serif text-[#1a1a1a]">Featured drops</h2>
            </div>
            <Link to="/shop" className="hidden md:inline text-sm text-[#8a7a6a] hover:underline ml-2">View all →</Link>
          </div>

          <div className="overflow-hidden">
            <motion.div
              animate={{ x: -currentIndex * 296 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-5 will-change-transform"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
                {featured.map((p) => (
                  <div key={p._id} className="w-full">
                    <ProductCardHome product={p} favorites={favorites} onToggleFavorite={toggleFavorite} onAddToCart={addToCartGuarded} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <hr className="border-none h-px bg-[#ede7de] mx-6" />

        {/* ── PERKS ────────────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-medium tracking-widest uppercase text-[#8a7a6a] mb-2">Why choose us</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a1a1a]">More than fashion</h2>
            <p className="text-sm text-[#8a7a6a] mt-3 max-w-md mx-auto leading-relaxed">
              Designed for comfort, built for confidence, and delivered with premium service.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {PERKS.map((item) => (
              <motion.div key={item.title} variants={fadeUp} className="bg-[#f7f3ee] rounded-2xl p-6 border border-[#ede7de]">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-sm font-semibold text-[#1a1a1a] mb-2">{item.title}</h3>
                <p className="text-xs text-[#8a7a6a] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <hr className="border-none h-px bg-[#ede7de] mx-6" />

        {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-[11px] font-medium tracking-widest uppercase text-[#8a7a6a] mb-2">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a1a1a]">Loved by customers</h2>
            <p className="text-sm text-[#8a7a6a] mt-3">Thousands trust DRIP for style, quality, and comfort.</p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid md:grid-cols-3 gap-5"
          >
            {REVIEWS.map((item) => (
              <motion.div
                key={item.name}
                variants={fadeUp}
                className="bg-[#f7f3ee] rounded-2xl p-6 border border-[#ede7de] flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-[#5a4a3a] leading-relaxed mb-6 italic">"{item.review}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">{item.name}</p>
                    <p className="text-xs text-[#8a7a6a]">{item.location} · Verified Customer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>

      <style>{`
        @keyframes heroProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-7px); }
        }
        .floating-card { animation: float 4s ease-in-out infinite; }
      `}</style>
    </>
  );
}
