import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden border-t"
      style={{
        background: "var(--bg-primary)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-16">
          
          {/* Brand — full width on mobile */}
          <div className="col-span-2 md:col-span-2 space-y-4">
            <Link
              to="/"
              className="text-3xl md:text-4xl font-black tracking-tighter uppercase"
              style={{
                background: "linear-gradient(135deg,#d8c2a8,#b89d86,#9d8268)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              DRIP
            </Link>

            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Premium garments and curated architectural silhouettes
              engineered for modern minimalism. Built to elevate everyday
              expression through timeless design.
            </p>
          </div>

          {/* Shop */}
          <div className="col-span-1">
            <h4
              className="text-[11px] font-black uppercase tracking-[0.28em] mb-4 md:mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Shop
            </h4>
            <ul className="space-y-3">
              {["Men", "Women", "Shoes", "Kids"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/shop?category=${item}`}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h4
              className="text-[11px] font-black uppercase tracking-[0.28em] mb-4 md:mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/orders"
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  Track Order
                </Link>
              </li>
              {["Shipping & Returns", "FAQ", "Size Guide"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company — spans 2 cols on mobile to fill the row */}
          <div className="col-span-2 md:col-span-1">
            <h4
              className="text-[11px] font-black uppercase tracking-[0.28em] mb-4 md:mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Company
            </h4>
            <ul className="space-y-3">
              {["About DRIP", "Sustainability", "Careers"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div
          className="rounded-2xl md:rounded-3xl border p-6 md:p-10 mb-10 md:mb-14"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border-card)",
          }}
        >
          <div className="flex flex-col gap-6">
            <div>
              <h3
                className="text-xl md:text-2xl font-black tracking-tight mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Stay Ahead of the Drop
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Exclusive launches, private sales, and early-access releases.
              </p>
            </div>

            {/* Input + Button: stacked on mobile, row on md+ */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:flex-1 md:w-72 px-5 py-3 rounded-full border bg-transparent outline-none text-sm"
                style={{
                  borderColor: "var(--border-card)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                className="w-full sm:w-auto px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 text-sm"
                style={{
                  background: "linear-gradient(135deg,#d8c2a8,#b89d86,#9d8268)",
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-t pt-6 md:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs uppercase tracking-[0.14em] md:tracking-[0.18em] text-center sm:text-left"
          style={{
            borderColor: "var(--border-subtle)",
            color: "var(--text-muted)",
          }}
        >
          <p>© {currentYear} DRIP — Crafted for Modern Minimalism</p>

          <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}