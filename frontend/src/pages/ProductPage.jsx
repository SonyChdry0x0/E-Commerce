import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const gradientPrimary = "linear-gradient(135deg, #7c3aed, #ec4899)";

// ── Responsive hook ──────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

export default function ProductPage() {
  const { id }       = useParams();
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const isMobile     = useIsMobile();

  const [product,         setProduct]         = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [selectedSize,    setSelectedSize]    = useState("");
  const [quantity,        setQuantity]        = useState(1);
  const [addedAlert,      setAddedAlert]      = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/api/products/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) { navigate(`/login?redirect=/product/${id}`); return; }
        if (!response.ok) throw new Error("Failed to load product");

        const data = await response.json();
        setProduct(data);

        try {
          const recRes  = await fetch(`${BACKEND_URL}/api/products?category=${data.category}&limit=4`);
          const recData = await recRes.json();
          setRecommendations(
            (Array.isArray(recData) ? recData : recData.products || [])
              .filter((p) => p._id !== id)
              .slice(0, 4)
          );
        } catch (_) { /* non-critical */ }
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "var(--bg-primary)",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", marginBottom: 16,
          border: "4px solid var(--border-card)",
          borderTopColor: "var(--text-primary)",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
          textTransform: "uppercase", color: "var(--text-muted)" }}>
          Loading Drop Details…
        </p>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!product) {
    return (
      <div style={{
        minHeight: "100vh", textAlign: "center", paddingTop: 96,
        background: "var(--bg-primary)",
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16,
          color: "var(--text-primary)" }}>Product Not Found</h2>
        <Link to="/shop" style={{
          display: "inline-block", background: gradientPrimary,
          color: "#fff", padding: "12px 24px", borderRadius: 100,
          fontWeight: 900, fontSize: 11, textTransform: "uppercase",
          letterSpacing: "0.1em", textDecoration: "none",
        }}>
          Back to Catalogue
        </Link>
      </div>
    );
  }

  // ── Image src ──────────────────────────────────────────────────────────────
  const rawImage = product.images?.[0] || product.image || null;
  const imageSrc = rawImage
    ? rawImage.startsWith("http") ? rawImage : `${BACKEND_URL}/${rawImage.replace(/^\//, "")}`
    : "https://placehold.co/600x800/13131a/6b6b85?text=No+Image";

  // ── Add to bag ─────────────────────────────────────────────────────────────
  const handleAddToBag = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size before adding to your bag.");
      return;
    }
    dispatch(addToCart({
      _id: product._id, name: product.name, price: product.price,
      brand: product.brand || "DRIP Essentials", image: rawImage,
      selectedSize, qty: quantity,
    }));
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-primary)",
      color: "var(--text-primary)", fontFamily: "-apple-system, 'Inter', sans-serif",
    }}>
      <main style={{ maxWidth: 1280, margin: "0 auto", marginTop: 55, padding: isMobile ? "24px 16px" : "48px 24px" }}>

        {/* Breadcrumbs */}
        <nav style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 40,
          fontSize: 12, fontWeight: 700, letterSpacing: "0.15em",
          textTransform: "uppercase", color: "var(--text-muted)",
        }}>
          <BreadLink to="/">Home</BreadLink>
          <span>/</span>
          <BreadLink to="/shop">Catalogue</BreadLink>
          <span>/</span>
          <span style={{
            color: "var(--text-primary)", overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200,
          }}>
            {product.name}
          </span>
        </nav>

        {/* ── OUTER GRID: product card + purchase panel ──────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 280px",
          gap: 24,
          alignItems: "start",
          paddingBottom: 50,
        }}>

          {/* ── LEFT: image + details card ─────────────────────────────── */}
          <div style={{
            background: "gray-150",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: isMobile ? 16 : 24,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",   // ← stack on mobile
            gap: isMobile ? 20 : 32,
            alignItems: "flex-start",
          }}>

            {/* IMAGE */}
            <div style={{
              width: "100%",
              maxWidth: isMobile ? "100%" : 420,
              flexShrink: 0,
            }}>
              <img
                src={imageSrc}
                alt={product.name}
                style={{
                  width: "100%",
                  height: isMobile ? "auto" : 450,
                  maxHeight: isMobile ? 360 : "none",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>

            {/* DETAILS */}
            <div style={{ flex: 1, width: "100%" }}>
              <h1 style={{ fontSize: isMobile ? 20 : 25, fontWeight: 700, marginBottom: 12, color: "#222" }}>
                {product.name}
              </h1>

              <p style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
                Brand: {product.brand || "DIPE Fashion"}
              </p>

              <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: "#b89d86", marginBottom: 20 }}>
                Rs. {product.price}
              </h2>

              <hr style={{ margin: "20px 0" }} />

              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: "#333" }}>
                Description
              </h3>
              <p style={{ color: "#555", lineHeight: 1.7, marginBottom: 25 }}>
                {product.description}
              </p>

              {/* SIZE */}
              {product.sizes?.length > 0 && (
                <>
                  <h3 style={{ marginBottom: 10, fontSize: 14, fontWeight: 600, color: "#333" }}>
                    Size
                  </h3>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: "10px 16px",
                          border: selectedSize === size ? "2px solid #f57224" : "1px solid #ddd",
                          background: "#fff",
                          cursor: "pointer",
                          borderRadius: 4,
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* QUANTITY */}
              <h3 style={{ marginBottom: 10, fontSize: 14, fontWeight: 600, color: "#333" }}>
                Quantity
              </h3>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: 40, height: 40, borderRadius: 4,
                    border: "1px solid #ddd", background: "#fff",
                    fontSize: 18, cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  −
                </button>
                <span style={{ fontSize: 18, fontWeight: 600, minWidth: 24, textAlign: "center" }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: 40, height: 40, borderRadius: 4,
                    border: "1px solid #ddd", background: "#fff",
                    fontSize: 18, cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  +
                </button>
              </div>

              {/* ADD TO CART — shown inline on mobile (inside card), hidden on desktop */}
              {isMobile && (
                <button
                  onClick={handleAddToBag}
                  style={{
                    marginTop: 28, width: "100%", background: "#b89d86",
                    color: "#fff", border: "none", padding: 14,
                    fontWeight: 600, borderRadius: 6, cursor: "pointer",
                    fontSize: 15,
                  }}
                >
                  Add To Cart
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT: purchase panel (desktop only) ─────────────────────── */}
          {!isMobile && (
            <div style={{
              background: "gray-150",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 20,
              position: "sticky",
              top: 100,
            }}>
              <h3 style={{ marginBottom: 15, color: "#333" }}>Delivery</h3>
              <p style={{ color: "#666", marginBottom: 20 }}>2–5 Business Days</p>
              <hr />
              <h3 style={{ marginTop: 20, marginBottom: 10 }}>Returns</h3>
              <p style={{ color: "#666", marginBottom: 20 }}>14 Days Free Return</p>
              <hr />
              <h3 style={{ marginTop: 20, marginBottom: 10 }}>Facility</h3>
              <p style={{ color: "#666", marginBottom: 20 }}>Cash On Delivery Available</p>
              <button
                onClick={handleAddToBag}
                style={{
                  width: "100%", background: "#b89d86", color: "#fff",
                  border: "none", padding: 14, fontWeight: 600,
                  borderRadius: 6, cursor: "pointer",
                }}
              >
                Add To Cart
              </button>
            </div>
          )}

          {/* ── MOBILE: delivery info below the card ─────────────────────── */}
          {isMobile && (
            <div style={{
              background: "#fffbf5",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              textAlign: "center",
            }}>
              {[
                { label: "Delivery",  value: "2–5 Business Days" },
                { label: "Returns",   value: "14 Days Free" },
                { label: "Payment",   value: "Cash On Delivery" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                  <p style={{ fontSize: 12, color: "#555", lineHeight: 1.4 }}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RECOMMENDATIONS ──────────────────────────────────────────────── */}
        {recommendations.length > 0 && (
          <div style={{ paddingTop: 80 }}>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.03em",
                color: "var(--text-primary)", marginBottom: 4 }}>
                You may also like
              </h2>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>
                More fresh drops from our{" "}
                <span style={{ fontWeight: 700, color: "var(--text-secondary)" }}>{product.category}</span> lineup.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(180px, 1fr))",
              gap: isMobile ? 12 : 20,
            }}>
              {recommendations.map((rec) => {
                const recRaw = rec.image || rec.images?.[0];
                const recSrc = recRaw
                  ? recRaw.startsWith("http") ? recRaw : `${BACKEND_URL}/${recRaw.replace(/^\//, "")}`
                  : "https://placehold.co/400x533/13131a/6b6b85?text=No+Image";
                return (
                  <Link key={rec._id} to={`/product/${rec._id}`}
                    style={{ textDecoration: "none", display: "block" }}>
                    <div style={{
                      aspectRatio: "3/4", borderRadius: 16, overflow: "hidden",
                      border: "1px solid var(--border-card)", background: "var(--bg-card)",
                      marginBottom: 10,
                    }}>
                      <img
                        src={recSrc} alt={rec.name} loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover",
                          display: "block", transition: "transform 0.5s ease" }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                      />
                    </div>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                      textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 2 }}>
                      {rec.brand || "DRIP Essentials"}
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {rec.name}
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 900, color: "var(--text-primary)", marginTop: 4 }}>
                      ${rec.price ? rec.price.toFixed(2) : "0.00"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function BreadLink({ to, children }) {
  const [hov, setHov] = useState(false);
  return (
    <Link to={to} style={{
      color: hov ? "var(--text-primary)" : "var(--text-muted)",
      textDecoration: "none", transition: "color 0.15s",
    }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </Link>
  );
}
