const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const FALLBACK =
  "https://placehold.co/600x800/f4f4f5/a1a1aa?text=No+Image";

function normaliseImageValue(raw) {
  if (!raw) return FALLBACK;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || typeof value !== "string") return FALLBACK;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${BACKEND_URL}/${value.replace(/^\/+/, "")}`;
}

export function getProductImage(product) {
  if (!product) return FALLBACK;
  const raw =
    product.image     ??
    product.images    ??
    product.imageUrl  ??
    product.image_url ??
    product.thumbnail ??
    product.photo     ??
    null;
  return normaliseImageValue(raw);
}

export const imgFallback = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = FALLBACK;
};
