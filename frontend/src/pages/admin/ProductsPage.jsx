import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';

const EMPTY_FORM = {
  name: '', description: '', price: '', category: '',
  brand: '', stock: '', sizes: '', featured: false,
  isNewArrival: false, images: [],
};

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
const CLOUDINARY_CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
console.log("CLOUDINARY CONFIG:", 
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
);

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST', body: fd,
  });
  const data = await res.json();
  return data.secure_url;
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState('');

  const load = () => {
    setLoading(true);
    getProducts().then(r => setProducts(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditProduct(null); setShowModal(true); };
  const openEdit = (p) => {
    console.log("PRODUCT IMAGES FIELD:", p.images, p.image);
    setForm({
      name: p.name || '', description: p.description || '',
      price: p.price || '', category: p.category || '',
      brand: p.brand || '', stock: p.stock || '',
      sizes: (p.sizes || []).join(', '),
      featured: p.featured || false, isNewArrival: p.isNewArrival || false,
      images: p.images?.length ? p.images : p.image ? [p.image] : [],
    });
    setEditProduct(p);
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  setUploading(true);
  try {
    const urls = await Promise.all(files.map(uploadToCloudinary));
    // ✅ replace images instead of appending
    setForm(f => ({ ...f, images: urls }));
  } catch {
    alert('Image upload failed. Check Cloudinary config.');
  } finally {
    setUploading(false);
  }
};

  const removeImage = (idx) =>
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);

  const { images, ...rest } = form; 

  const payload = {
    ...rest,
    price: Number(form.price),
    stock: Number(form.stock),
    sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
    ...(images.length > 0 && { images }), // ← only include if non-empty
  };

  console.log("EDIT PRODUCT:", editProduct);
  console.log("PAYLOAD:", payload);

  try {
    if (editProduct) {
      const res = await updateProduct(editProduct._id, payload);
      console.log("UPDATE RESPONSE:", res.data);
    } else {
      await createProduct(payload);
    }

    setShowModal(false);
    load();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'Save failed');
  } finally {
    setSaving(false);
  }
};

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    load();
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <button onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Add Product
        </button>
      </div>

      <input
        type="text" placeholder="Search by name or category…"
        value={search} onChange={e => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
      />

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-800">
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No products found.</td></tr>
              ) : filtered.map(p => (
                <tr key={p._id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-3">
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                      : <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-600">—</div>
                    }
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-gray-400">{p.category || '—'}</td>
                  <td className="px-4 py-3 text-white">${p.price}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.stock > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {p.stock > 0 ? p.stock : 'Out'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => openEdit(p)}
                      className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)}
                      className="px-3 py-1 text-xs bg-red-900 hover:bg-red-800 text-red-300 rounded-lg transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                {editProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Price *</label>
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Category</label>
                  <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Brand</label>
                  <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Sizes (comma separated)</label>
                  <input placeholder="S, M, L, XL" value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 resize-none" />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="accent-indigo-500" />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={form.isNewArrival} onChange={e => setForm(f => ({ ...f, isNewArrival: e.target.checked }))}
                    className="accent-indigo-500" />
                  New Arrival
                </label>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">Images (Cloudinary)</label>
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors w-fit">
                  <span className="text-sm text-gray-400">
                    {uploading ? 'Uploading…' : '+ Upload images'}
                  </span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
                {form.images.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {form.images.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} className="w-16 h-16 object-cover rounded-lg" />
                        <button type="button" onClick={() => removeImage(i)}
                          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving || uploading}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
                  {saving ? 'Saving…' : editProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
