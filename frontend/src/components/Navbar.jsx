// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const COLLECTIONS = [
//   { label: "All Collections", to: "/shop", sub: "Browse everything" },
//   { label: "Men", to: "/shop?category=Men", sub: "Tailored essentials" },
//   { label: "Women", to: "/shop?category=Women", sub: "Timeless pieces" },
//   { label: "Kids", to: "/shop?category=Kids", sub: "Fun & comfort" },
// ];

// const NAV_LINKS = [
//   { label: "Home", to: "/" },
//   { label: "Shop", to: "/shop" },
//   { label: "New Arrivals", to: "/shop/" },
// ];

// export default function Navbar() {
//   const { items } = useSelector((state) => state.cart);
//   const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [scrolled, setScrolled]           = useState(false);
//   const [menuOpen, setMenuOpen]           = useState(false);
//   const [collectionsOpen, setCollectionsOpen] = useState(false);
//   const [accountOpen, setAccountOpen]     = useState(false);
//   const [searchQuery, setSearchQuery]     = useState("");
//   const searchRef = useRef(null);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     setMenuOpen(false);
//     setCollectionsOpen(false);
//     setAccountOpen(false);
//   }, [location]);

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/");
//     window.location.reload();
//   };

//   const isActive = (to) => location.pathname + location.search === to;

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
//       setSearchQuery("");
//     }
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&display=swap');
//         .nav-luxora { font-family: 'Inter', sans-serif; }
//         .logo-luxora { font-family: 'Playfair Display', serif; }
//         .nav-link-luxora {
//           position: relative; font-size: 12px; font-weight: 500;
//           letter-spacing: 0.08em; text-transform: uppercase;
//           color: #5C5548; text-decoration: none;
//           padding: 6px 14px; transition: color 0.2s;
//         }
//         .nav-link-luxora:hover, .nav-link-luxora.active { color: #1C1A17; }
//         .nav-link-luxora.active::after {
//           content: ''; position: absolute; bottom: -2px; left: 14px;
//           right: 14px; height: 1.5px; background: #1C1A17;
//         }
//         .collections-dropdown {
//           position: absolute; top: calc(100% + 12px); left: 0;
//           background: #FAF8F5; border: 1px solid #E8E0D5;
//           border-radius: 12px; padding: 8px; min-width: 220px;
//           box-shadow: 0 12px 40px rgba(0,0,0,0.08); z-index: 999;
//         }
//         .dropdown-item {
//           display: block; padding: 10px 14px; border-radius: 8px;
//           text-decoration: none; transition: background 0.15s;
//         }
//         .dropdown-item:hover { background: #F2EDE6; }
//         .dropdown-item-label {
//           font-size: 13px; font-weight: 500; color: #1C1A17;
//           letter-spacing: 0.03em;
//         }
//         .dropdown-item-sub { font-size: 11px; color: #C4B8A8; margin-top: 1px; }
//         .search-pill {
//           display: flex; align-items: center; gap: 8px;
//           background: #F2EDE6; border: 1px solid #E8E0D5;
//           border-radius: 24px; padding: 8px 16px;
//           transition: border-color 0.2s; width: 200px;
//         }
//         .search-pill:focus-within { border-color: #C4B8A8; }
//         .search-pill input {
//           background: none; border: none; outline: none;
//           font-size: 12px; color: #1C1A17; width: 100%;
//           font-family: inherit; letter-spacing: 0.03em;
//         }
//         .search-pill input::placeholder { color: #C4B8A8; }
//         .icon-btn-luxora {
//           background: none; border: none; cursor: pointer;
//           width: 36px; height: 36px; border-radius: 8px;
//           display: flex; align-items: center; justify-content: center;
//           color: #5C5548; transition: background 0.15s, color 0.15s;
//           position: relative;
//         }
//         .icon-btn-luxora:hover { background: #F2EDE6; color: #1C1A17; }
//         .mobile-nav-link {
//           display: flex; align-items: center; justify-content: space-between;
//           padding: 13px 16px; border-radius: 10px; font-size: 14px;
//           font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
//           color: #5C5548; text-decoration: none; transition: background 0.15s;
//         }
//         .mobile-nav-link:hover, .mobile-nav-link.active {
//           background: #F2EDE6; color: #1C1A17;
//         }
//         @media (max-width: 768px) {
//           .hidden-mobile { display: none !important; }
//           .show-mobile { display: flex !important; }
//         }
//       `}</style>

//       <nav
//         className="nav-luxora"
//         style={{
//           position: "fixed", top: 0, left: 0, right: 0,
//           zIndex: 9999,
//           background: "#FAF8F5",
//           borderBottom: `1px solid ${scrolled ? "#E8E0D5" : "transparent"}`,
//           boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
//         }}
//       >
//         <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

//             {/* ── LOGO ── */}
//             <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
//               <div className="logo-luxora" style={{ fontSize: 22, fontWeight: 700, color: "#b89d86", letterSpacing: "0.06em", lineHeight: 1 }}>
//                 DIPE
//               </div>
//               <div style={{ fontSize: 9, letterSpacing: "0.28em", color: "#C4B8A8", textTransform: "uppercase", fontWeight: 500, marginTop: 2, fontFamily: "Inter, sans-serif" }}>
//                 Fashion
//               </div>
//             </Link>

//             {/* ── DESKTOP LINKS ── */}
//             <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden-mobile">
//               {NAV_LINKS.map(({ label, to }) => (
//                 <Link key={to} to={to} className={`nav-link-luxora${isActive(to) ? " active" : ""}`}>
//                   {label}
//                 </Link>
//               ))}

//               {/* Collections Dropdown */}
//               <div
//                 style={{ position: "relative" }}
//                 onMouseEnter={() => setCollectionsOpen(true)}
//                 onMouseLeave={() => setCollectionsOpen(false)}
//               >
//                 <button
//                   className="nav-link-luxora"
//                   style={{
//                     background: "none", border: "none", cursor: "pointer",
//                     display: "flex", alignItems: "center", gap: 5,
//                     color: collectionsOpen ? "#1C1A17" : "#5C5548",
//                   }}
//                 >
//                   Collections
//                   <motion.svg
//                     width="10" height="10" viewBox="0 0 10 10" fill="none"
//                     animate={{ rotate: collectionsOpen ? 180 : 0 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//                   </motion.svg>
//                 </button>

//                 <AnimatePresence>
//                   {collectionsOpen && (
//                     <motion.div
//                       className="collections-dropdown"
//                       initial={{ opacity: 0, y: -8 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -8 }}
//                       transition={{ duration: 0.18 }}
//                     >
//                       {COLLECTIONS.map(({ label, to, sub }) => (
//                         <Link key={to} to={to} className="dropdown-item">
//                           <div className="dropdown-item-label">{label}</div>
//                           <div className="dropdown-item-sub">{sub}</div>
//                         </Link>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>

//             {/* ── RIGHT SIDE ── */}
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

//               {/* Search */}
//               <form onSubmit={handleSearch} className="search-pill hidden-mobile">
//                 <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#C4B8A8" strokeWidth="2">
//                   <circle cx="11" cy="11" r="8" />
//                   <path d="M21 21l-4.35-4.35" />
//                 </svg>
//                 <input
//                   ref={searchRef}
//                   type="text"
//                   placeholder="Search products…"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </form>

//               <div style={{ width: 1, height: 20, background: "#E8E0D5", margin: "0 4px" }} className="hidden-mobile" />

//               {/* Account */}
//               {token ? (
//                 <div
//                   style={{ position: "relative" }}
//                   onMouseEnter={() => setAccountOpen(true)}
//                   onMouseLeave={() => setAccountOpen(false)}
//                 >
//                   <button className="icon-btn-luxora hidden-mobile" aria-label="Account">
//                     <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                       <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
//                       <circle cx="12" cy="7" r="4" />
//                     </svg>
//                   </button>

//                   <AnimatePresence>
//                     {accountOpen && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -6 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -6 }}
//                         transition={{ duration: 0.18 }}
//                         style={{
//                           position: "absolute", top: "calc(100% + 8px)", right: 0,
//                           background: "#FAF8F5", border: "1px solid #E8E0D5",
//                           borderRadius: 10, padding: 8, minWidth: 160,
//                           boxShadow: "0 8px 24px rgba(0,0,0,0.07)", zIndex: 999,
//                         }}
//                       >
//                         <div style={{ padding: "8px 14px 10px", borderBottom: "1px solid #F2EDE6", marginBottom: 4 }}>
//                           <div style={{ fontSize: 12, fontWeight: 600, color: "#1C1A17" }}>
//                             {user?.name || "Account"}
//                           </div>
//                           <div style={{ fontSize: 11, color: "#C4B8A8", marginTop: 1 }}>
//                             {user?.email || ""}
//                           </div>
//                         </div>
//                         <Link to="/orders" className="dropdown-item">
//                           <span className="dropdown-item-label">My Orders</span>
//                         </Link>
//                         <Link to="/profile" className="dropdown-item">
//                           <span className="dropdown-item-label">Profile</span>
//                         </Link>
//                         <button
//                           onClick={logout}
//                           className="dropdown-item"
//                           style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
//                         >
//                           <span className="dropdown-item-label" style={{ color: "#B05A3A" }}>Sign Out</span>
//                         </button>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               ) : (
//                 <>
//                   <Link
//                     to="/login"
//                     className="hidden-mobile"
//                     style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5C5548", textDecoration: "none", padding: "8px 12px", transition: "color 0.2s" }}
//                     onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1A17")}
//                     onMouseLeave={(e) => (e.currentTarget.style.color = "#5C5548")}
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     to="/register"
//                     className="hidden-mobile"
//                     style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "white", background: "#b89d86", textDecoration: "none", padding: "9px 20px", borderRadius: 24, transition: "background 0.2s" }}
//                     onMouseEnter={(e) => (e.currentTarget.style.background = "#8B6F47")}
//                     onMouseLeave={(e) => (e.currentTarget.style.background = "#b89d86")}
//                   >
//                     Sign Up
//                   </Link>
//                 </>
//               )}

//               {/* Cart */}
//               <Link to="/cart" className="icon-btn-luxora" aria-label={`Cart, ${totalItems} items`}>
//                 <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                   <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
//                   <line x1="3" y1="6" x2="21" y2="6" />
//                   <path d="M16 10a4 4 0 01-8 0" />
//                 </svg>
//                 <AnimatePresence mode="popLayout">
//                   {totalItems > 0 && (
//                     <motion.span
//                       key={totalItems}
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       exit={{ scale: 0 }}
//                       transition={{ type: "spring", stiffness: 500, damping: 25 }}
//                       style={{
//                         position: "absolute", top: 3, right: 3,
//                         width: 16, height: 16, borderRadius: "50%",
//                         background: "#8B6F47", color: "white",
//                         fontSize: 9, fontWeight: 700,
//                         display: "flex", alignItems: "center", justifyContent: "center",
//                         border: "1.5px solid #FAF8F5",
//                       }}
//                     >
//                       {totalItems > 9 ? "9+" : totalItems}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </Link>

//               {/* Hamburger */}
//               <button
//                 onClick={() => setMenuOpen(!menuOpen)}
//                 className="icon-btn-luxora show-mobile"
//                 aria-label="Toggle menu"
//                 style={{ display: "none" }}
//               >
//                 <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                   {menuOpen ? (
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                   ) : (
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//                   )}
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ── MOBILE MENU ── */}
//         <AnimatePresence>
//           {menuOpen && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
//               style={{ overflow: "hidden", borderTop: "1px solid #E8E0D5", background: "#FAF8F5" }}
//             >
//               <div style={{ padding: "16px 24px 24px" }}>

//                 {/* Mobile Search */}
//                 <form onSubmit={handleSearch} className="search-pill" style={{ width: "100%", marginBottom: 16 }}>
//                   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#C4B8A8" strokeWidth="2">
//                     <circle cx="11" cy="11" r="8" />
//                     <path d="M21 21l-4.35-4.35" />
//                   </svg>
//                   <input
//                     type="text"
//                     placeholder="Search products…"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </form>

//                 <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                   {NAV_LINKS.map(({ label, to }) => (
//                     <Link key={to} to={to} className={`mobile-nav-link${isActive(to) ? " active" : ""}`}>
//                       {label}
//                       {isActive(to) && (
//                         <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B6F47" }} />
//                       )}
//                     </Link>
//                   ))}

//                   {/* Collections mobile */}
//                   <div style={{ marginTop: 4 }}>
//                     <button
//                       onClick={() => setCollectionsOpen(!collectionsOpen)}
//                       className="mobile-nav-link"
//                       style={{ width: "100%", background: "none", border: "none", cursor: "pointer" }}
//                     >
//                       Collections
//                       <motion.svg
//                         width="12" height="12" viewBox="0 0 12 12" fill="none"
//                         animate={{ rotate: collectionsOpen ? 180 : 0 }}
//                       >
//                         <path d="M3 4.5L6 7.5L9 4.5" stroke="#5C5548" strokeWidth="1.5" strokeLinecap="round" />
//                       </motion.svg>
//                     </button>
//                     <AnimatePresence>
//                       {collectionsOpen && (
//                         <motion.div
//                           initial={{ height: 0, opacity: 0 }}
//                           animate={{ height: "auto", opacity: 1 }}
//                           exit={{ height: 0, opacity: 0 }}
//                           style={{ overflow: "hidden", paddingLeft: 16 }}
//                         >
//                           {COLLECTIONS.map(({ label, to }) => (
//                             <Link key={to} to={to} className="mobile-nav-link" style={{ fontSize: 13 }}>
//                               {label}
//                             </Link>
//                           ))}
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 </div>

//                 <div style={{ borderTop: "1px solid #E8E0D5", marginTop: 16, paddingTop: 16, display: "flex", gap: 10 }}>
//                   {token ? (
//                     <>
//                       <Link
//                         to="/orders"
//                         style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, border: "1px solid #E8E0D5", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1C1A17", textDecoration: "none" }}
//                       >
//                         Orders
//                       </Link>
//                       <button
//                         onClick={logout}
//                         style={{ flex: 1, padding: "10px", borderRadius: 10, background: "#1C1A17", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#FAF8F5" }}
//                       >
//                         Sign Out
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <Link
//                         to="/login"
//                         style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, border: "1px solid #E8E0D5", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1C1A17", textDecoration: "none" }}
//                       >
//                         Login
//                       </Link>
//                       <Link
//                         to="/register"
//                         style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, background: "#1C1A17", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#FAF8F5", textDecoration: "none" }}
//                       >
//                         Sign Up
//                       </Link>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </nav>
//     </>
//   );
// }



import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clearUser } from "../store/authSlice";
import AuthModal from "./AuthModal";

const COLLECTIONS = [
  { label: "All Collections", to: "/shop",                sub: "Browse everything"  },
  { label: "Men",             to: "/shop?category=Men",   sub: "Tailored essentials" },
  { label: "Women",           to: "/shop?category=Women", sub: "Timeless pieces"     },
  { label: "Kids",            to: "/shop?category=Kids",  sub: "Fun & comfort"       },
];

const NAV_LINKS = [
  { label: "Home",         to: "/"      },
  { label: "Shop",         to: "/shop"  },
  { label: "New Arrivals", to: "/shop/" },
];

export default function Navbar() {
  const { items }  = useSelector((state) => state.cart);
  const { user }   = useSelector((state) => state.auth);   // ← reads from Redux
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  const [scrolled,         setScrolled]         = useState(false);
  const [menuOpen,         setMenuOpen]         = useState(false);
  const [collectionsOpen,  setCollectionsOpen]  = useState(false);
  const [accountOpen,      setAccountOpen]      = useState(false);
  const [searchQuery,      setSearchQuery]      = useState("");
  const [showAuth,         setShowAuth]         = useState(false);
  const [authMode,         setAuthMode]         = useState("login"); // passed to modal
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setCollectionsOpen(false);
    setAccountOpen(false);
  }, [location]);

  const logout = () => {
    dispatch(clearUser());
    navigate("/");
  };

  const isActive = (to) => location.pathname + location.search === to;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const openLogin    = () => { setAuthMode("login");    setShowAuth(true); };
  const openRegister = () => { setAuthMode("register"); setShowAuth(true); };

  return (
    <>
      <AuthModal
        isOpen={showAuth}
        initialMode={authMode}
        onClose={() => setShowAuth(false)}
        onSuccess={() => setShowAuth(false)}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&display=swap');
        .nav-luxora { font-family: 'Inter', sans-serif; }
        .logo-luxora { font-family: 'Playfair Display', serif; }
        .nav-link-luxora {
          position: relative; font-size: 12px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #5C5548; text-decoration: none;
          padding: 6px 14px; transition: color 0.2s;
        }
        .nav-link-luxora:hover, .nav-link-luxora.active { color: #1C1A17; }
        .nav-link-luxora.active::after {
          content: ''; position: absolute; bottom: -2px; left: 14px;
          right: 14px; height: 1.5px; background: #1C1A17;
        }
        .collections-dropdown {
          position: absolute; top: calc(100% + 12px); left: 0;
          background: #FAF8F5; border: 1px solid #E8E0D5;
          border-radius: 12px; padding: 8px; min-width: 220px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.08); z-index: 999;
        }
        .dropdown-item {
          display: block; padding: 10px 14px; border-radius: 8px;
          text-decoration: none; transition: background 0.15s;
        }
        .dropdown-item:hover { background: #F2EDE6; }
        .dropdown-item-label { font-size: 13px; font-weight: 500; color: #1C1A17; letter-spacing: 0.03em; }
        .dropdown-item-sub   { font-size: 11px; color: #C4B8A8; margin-top: 1px; }
        .search-pill {
          display: flex; align-items: center; gap: 8px;
          background: #F2EDE6; border: 1px solid #E8E0D5;
          border-radius: 24px; padding: 8px 16px;
          transition: border-color 0.2s; width: 200px;
        }
        .search-pill:focus-within { border-color: #C4B8A8; }
        .search-pill input {
          background: none; border: none; outline: none;
          font-size: 12px; color: #1C1A17; width: 100%;
          font-family: inherit; letter-spacing: 0.03em;
        }
        .search-pill input::placeholder { color: #C4B8A8; }
        .icon-btn-luxora {
          background: none; border: none; cursor: pointer;
          width: 36px; height: 36px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #5C5548; transition: background 0.15s, color 0.15s;
          position: relative;
        }
        .icon-btn-luxora:hover { background: #F2EDE6; color: #1C1A17; }
        .mobile-nav-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 16px; border-radius: 10px; font-size: 14px;
          font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
          color: #5C5548; text-decoration: none; transition: background 0.15s;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active { background: #F2EDE6; color: #1C1A17; }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
      `}</style>

      <nav
        className="nav-luxora"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
          background: "#FAF8F5",
          borderBottom: `1px solid ${scrolled ? "#E8E0D5" : "transparent"}`,
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

            {/* ── LOGO ── */}
            <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
              <div className="logo-luxora" style={{ fontSize: 22, fontWeight: 700, color: "#b89d86", letterSpacing: "0.06em", lineHeight: 1 }}>
                DIPE
              </div>
              <div style={{ fontSize: 9, letterSpacing: "0.28em", color: "#C4B8A8", textTransform: "uppercase", fontWeight: 500, marginTop: 2, fontFamily: "Inter, sans-serif" }}>
                Fashion
              </div>
            </Link>

            {/* ── DESKTOP LINKS ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden-mobile">
              {NAV_LINKS.map(({ label, to }) => (
                <Link key={to} to={to} className={`nav-link-luxora${isActive(to) ? " active" : ""}`}>
                  {label}
                </Link>
              ))}

              {/* Collections Dropdown */}
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => setCollectionsOpen(true)}
                onMouseLeave={() => setCollectionsOpen(false)}
              >
                <button
                  className="nav-link-luxora"
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: collectionsOpen ? "#1C1A17" : "#5C5548" }}
                >
                  Collections
                  <motion.svg width="10" height="10" viewBox="0 0 10 10" fill="none" animate={{ rotate: collectionsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {collectionsOpen && (
                    <motion.div className="collections-dropdown" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                      {COLLECTIONS.map(({ label, to, sub }) => (
                        <Link key={to} to={to} className="dropdown-item">
                          <div className="dropdown-item-label">{label}</div>
                          <div className="dropdown-item-sub">{sub}</div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── RIGHT SIDE ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

              {/* Search */}
              <form onSubmit={handleSearch} className="search-pill hidden-mobile">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#C4B8A8" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input ref={searchRef} type="text" placeholder="Search products…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </form>

              <div style={{ width: 1, height: 20, background: "#E8E0D5", margin: "0 4px" }} className="hidden-mobile" />

              {/* ── ACCOUNT (logged in) or LOGIN / SIGNUP buttons ── */}
              {user ? (
                /* ── Account dropdown ── */
                <div style={{ position: "relative" }} onMouseEnter={() => setAccountOpen(true)} onMouseLeave={() => setAccountOpen(false)}>
                  <button className="icon-btn-luxora hidden-mobile" aria-label="Account">
                    {/* Person icon */}
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {accountOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
                        style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#FAF8F5", border: "1px solid #E8E0D5", borderRadius: 10, padding: 8, minWidth: 180, boxShadow: "0 8px 24px rgba(0,0,0,0.07)", zIndex: 999 }}
                      >
                        {/* User info header */}
                        <div style={{ padding: "8px 14px 10px", borderBottom: "1px solid #F2EDE6", marginBottom: 4 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#1C1A17" }}>{user.name || "Account"}</div>
                          <div style={{ fontSize: 11, color: "#C4B8A8", marginTop: 1 }}>{user.email || ""}</div>
                        </div>
                        <Link to="/orders" className="dropdown-item">
                          <span className="dropdown-item-label">My Orders</span>
                        </Link>
                        <Link to="/profile" className="dropdown-item">
                          <span className="dropdown-item-label">Profile</span>
                        </Link>
                        {user.isAdmin && (
                          <Link to="/admin" className="dropdown-item">
                            <span className="dropdown-item-label">Admin Panel</span>
                          </Link>
                        )}
                        <button
                          onClick={logout}
                          className="dropdown-item"
                          style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                        >
                          <span className="dropdown-item-label" style={{ color: "#B05A3A" }}>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* ── Login / Sign Up buttons (open modal) ── */
                <>
                  <button
                    onClick={openLogin}
                    className="hidden-mobile"
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5C5548", padding: "8px 12px", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1A17")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#5C5548")}
                  >
                    Login
                  </button>
                  <button
                    onClick={openRegister}
                    className="hidden-mobile"
                    style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "white", background: "#b89d86", border: "none", cursor: "pointer", padding: "9px 20px", borderRadius: 24, transition: "background 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#8B6F47")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#b89d86")}
                  >
                    Sign Up
                  </button>
                </>
              )}

              {/* Cart */}
              <Link to="/cart" className="icon-btn-luxora" aria-label={`Cart, ${totalItems} items`}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <AnimatePresence mode="popLayout">
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      style={{ position: "absolute", top: 3, right: 3, width: 16, height: 16, borderRadius: "50%", background: "#8B6F47", color: "white", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #FAF8F5" }}
                    >
                      {totalItems > 9 ? "9+" : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Hamburger */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="icon-btn-luxora show-mobile" aria-label="Toggle menu" style={{ display: "none" }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden", borderTop: "1px solid #E8E0D5", background: "#FAF8F5" }}
            >
              <div style={{ padding: "16px 24px 24px" }}>
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="search-pill" style={{ width: "100%", marginBottom: 16 }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#C4B8A8" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input type="text" placeholder="Search products…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </form>

                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {NAV_LINKS.map(({ label, to }) => (
                    <Link key={to} to={to} className={`mobile-nav-link${isActive(to) ? " active" : ""}`}>
                      {label}
                      {isActive(to) && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B6F47" }} />}
                    </Link>
                  ))}

                  {/* Collections mobile */}
                  <div style={{ marginTop: 4 }}>
                    <button onClick={() => setCollectionsOpen(!collectionsOpen)} className="mobile-nav-link" style={{ width: "100%", background: "none", border: "none", cursor: "pointer" }}>
                      Collections
                      <motion.svg width="12" height="12" viewBox="0 0 12 12" fill="none" animate={{ rotate: collectionsOpen ? 180 : 0 }}>
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="#5C5548" strokeWidth="1.5" strokeLinecap="round" />
                      </motion.svg>
                    </button>
                    <AnimatePresence>
                      {collectionsOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", paddingLeft: 16 }}>
                          {COLLECTIONS.map(({ label, to }) => (
                            <Link key={to} to={to} className="mobile-nav-link" style={{ fontSize: 13 }}>{label}</Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Mobile auth buttons */}
                <div style={{ borderTop: "1px solid #E8E0D5", marginTop: 16, paddingTop: 16, display: "flex", gap: 10 }}>
                  {user ? (
                    <>
                      <div style={{ flex: 1, padding: "10px 14px", borderRadius: 10, background: "#F2EDE6" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#1C1A17" }}>{user.name}</div>
                        <div style={{ fontSize: 11, color: "#C4B8A8" }}>{user.email}</div>
                      </div>
                      <button
                        onClick={logout}
                        style={{ padding: "10px 16px", borderRadius: 10, background: "#1C1A17", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#FAF8F5" }}
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={openLogin}
                        style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #E8E0D5", background: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1C1A17" }}
                      >
                        Login
                      </button>
                      <button
                        onClick={openRegister}
                        style={{ flex: 1, padding: "10px", borderRadius: 10, background: "#1C1A17", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#FAF8F5" }}
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
