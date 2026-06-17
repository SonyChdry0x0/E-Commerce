import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category") || "";
    setSelectedCategory(cat);
    setLoading(true);
    getProducts({})
      .then((res) => setProducts(res.data || res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [location.search]);

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch = !selectedCategory || product.category === selectedCategory;
    const sizeMatch =
      selectedSizes.length === 0 ||
      (product.sizes && selectedSizes.some((s) => product.sizes.includes(s)));
    return categoryMatch && sizeMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low-high") return a.price - b.price;
    if (sortBy === "high-low") return b.price - a.price;
    return 0;
  });

  const hasActiveFilters = selectedCategory || selectedSizes.length > 0 || sortBy !== "featured";

  const clearAll = () => {
    setSelectedCategory("");
    setSelectedSizes([]);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen antialiased" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-x; mb-6" style={{ color: 'var(--text-muted)' }}>
          <span className="cursor-pointer hover:underline">Home</span>
          <span>›</span>
          <span style={{ color: 'var(--text-primary)' }}>
            {selectedCategory || "All Products"}
          </span>
        </div>

        <div className="flex gap-8">

          {/* SIDEBAR */}
          <aside className="w-48 shrink-0 hidden lg:block">

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Category</h3>
                {selectedCategory && (
                  <button onClick={() => setSelectedCategory("")} className="text-xs" style={{ color: 'var(--text-muted)' }}>Clear</button>
                )}
              </div>
              <div className="space-y-0.5">
                {["Men", "Women", "Shoes", "Kids"].map((cat) => (
                  <button key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                    className="block w-full text-left text-sm py-1 transition-colors"
                    style={{
                      color: selectedCategory === cat ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: selectedCategory === cat ? '600' : '400',
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t mb-0" style={{ borderColor: 'var(--border-subtle)' }} />

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Size</h3>
                {selectedSizes.length > 0 && (
                  <button onClick={() => setSelectedSizes([])} className="text-xs" style={{ color: 'var(--text-muted)' }}>Clear</button>
                )}
              </div>
              <div className="space-y-1">
                {['S', 'M', 'L', 'XL', '10', '11', '12'].map((size) => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer py-0.5">
                    <input type="checkbox" checked={selectedSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                      className="w-3.5 h-3.5 rounded-sm focus:ring-0 cursor-pointer"
                      style={{ accentColor: 'var(--text-primary)' }} />
                    <span className="text-sm" style={{
                      color: selectedSizes.includes(size) ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: selectedSizes.includes(size) ? '600' : '400',
                    }}>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t mb-0" style={{ borderColor: 'var(--border-subtle)' }} />

            <div className="mb-6">
              <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Availability</h3>
              <label className="flex items-center gap-2 cursor-pointer select-none py-0.5">
                <input type="checkbox" defaultChecked
                  className="w-3.5 h-3.5 rounded-sm focus:ring-0 cursor-pointer"
                  style={{ accentColor: 'var(--text-primary)' }} />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>In Stock Only</span>
              </label>
            </div>

            {hasActiveFilters && (
              <>
                <div className="border-t mb-4" style={{ borderColor: 'var(--border-subtle)' }} />
                <button onClick={clearAll} className="text-xs font-semibold underline"
                  style={{ color: 'var(--text-muted)' }}>
                  ✕ Clear All Filters
                </button>
              </>
            )}
          </aside>

          {/* RIGHT SIDE */}
          <div className="flex-1 min-w-0">

            {/* TOP BAR */}
            <div className="mb-6">
              <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {selectedCategory || "All Drops"}
              </h1>
              {!loading && (
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                  {sortedProducts.length} items found
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Sort By:</span>
                  <div className="relative">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm font-semibold pl-3 pr-8 py-1.5 rounded-lg appearance-none focus:outline-none cursor-pointer border"
                      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-primary)' }}>
                      <option value="featured">Best Match</option>
                      <option value="low-high">Price low to high</option>
                      <option value="high-low">Price high to low</option>
                    </select>
                    <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-xs mr-1 font-semibold" style={{ color: 'var(--text-muted)' }}>View:</span>
                  <button onClick={() => setViewMode("grid")} className="p-1.5 rounded transition-colors"
                    style={{ color: viewMode === "grid" ? 'var(--text-primary)' : 'var(--text-muted)', background: viewMode === "grid" ? 'var(--bg-card)' : 'transparent' }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                    </svg>
                  </button>
                  <button onClick={() => setViewMode("list")} className="p-1.5 rounded transition-colors"
                    style={{ color: viewMode === "list" ? 'var(--text-primary)' : 'var(--text-muted)', background: viewMode === "list" ? 'var(--bg-card)' : 'transparent' }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="3" rx="1"/><rect x="3" y="10.5" width="18" height="3" rx="1"/>
                      <rect x="3" y="17" width="18" height="3" rx="1"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* PRODUCTS */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl animate-pulse aspect-[3/4]"
                    style={{ background: 'var(--bg-card)' }} />
                ))}
              </div>
           ) : sortedProducts.length > 0 ? (
  <div className={
    viewMode === "grid"
      ? "grid grid-cols-2 sm:grid-cols-4 gap-2"
      : "flex flex-col gap-3"
  }>
    {sortedProducts.map((p) => (
      <div key={p._id}>
        {viewMode === "list" ? (
          <div
  className="flex gap-14 rounded-2xl border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
  style={{
    backgroundColor: "#ffffff",
    borderColor: "#e5ddd3"
  }}
>
            {/* Image — fixed width on the left */}
            <div className="w-36 sm:w-48 shrink-0 aspect-[3/4] overflow-hidden ">
              {/* Image — clickable, links to product page */}
<Link to={`/product/${p._id}`} className="w-36 sm:w-48 shrink-0 aspect-[3/4] overflow-hidden block">
  <img
    src={p.image}
    alt={p.name}
    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
  />
</Link>
            </div>

            {/* Details — right side */}
            {/* Details — right side */}
<div className="flex flex-col justify-center py-4 pr-4 gap-1.5 flex-1">
  {p.isNew && (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full w-fit"
      style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
    >
      NEW
    </span>
  )}
  <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
    {p.brand}
  </p>
  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
    {p.name}
  </h3>

  {/* Description */}
  {p.description && (
    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
      {p.description}
    </p>
  )}

  {p.sizes && (
    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
      {p.sizes.join('  ')}
    </p>
  )}

  {/* Price + Heart row */}
  <div className="flex items-center gap-3 mt-1">
    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
      ${p.price}
    </p>
    <button
      className="w-7 h-7 rounded-full flex items-center justify-center border transition-colors"
      style={{ borderColor: 'var(--border-card)', background: 'var(--bg-primary)', color: 'var(--text-muted)' }}
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  </div>
</div>
          </div>
        ) : (
          <ProductCard product={p} />
        )}
      </div>
    ))}
  </div>
            ) : (
              <div className="text-center py-24 rounded-2xl border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                <span className="text-4xl block mb-4">📦</span>
                <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>No products found</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}