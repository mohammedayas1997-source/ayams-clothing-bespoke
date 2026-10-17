import React, { useState, useEffect } from 'react';
import { X, Image, Video, Plus, Edit2, Trash2, Check, AlertCircle, Loader2 } from 'lucide-react';
import { getGalleryStyles, addGalleryStyle, updateGalleryStyle, deleteGalleryStyle } from '../services/api';

const ManageGalleryModal = ({ isOpen, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  // Fom din daura sabo ko gyara
  const [formData, setFormData] = useState({
    title: '',
    category: 'Men',
    media_type: 'image',
    media_url: '',
    thumbnail_url: '',
    description: '',
    base_price: '',
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const loadStyles = async () => {
    try {
      const res = await getGalleryStyles();
      setItems(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadStyles();
  }, [isOpen]);

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Men',
      media_type: 'image',
      media_url: '',
      thumbnail_url: '',
      description: '',
      base_price: '',
    });
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      media_type: item.media_type,
      media_url: item.media_url,
      thumbnail_url: item.thumbnail_url || '',
      description: item.description || '',
      base_price: item.base_price || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      if (editingItem) {
        // Gyara (Update)
        await updateGalleryStyle(editingItem.id, formData);
        setMsg('Successfully updated style!');
      } else {
        // Daurawa (Create)
        await addGalleryStyle(formData);
        setMsg('Successfully added new style to showcase!');
      }
      resetForm();
      loadStyles();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving style.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this showcase item?')) {
      try {
        await deleteGalleryStyle(id);
        loadStyles();
      } catch (err) {
        alert('Could not delete item.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-neutral-100 overflow-hidden">
        
        {/* Kan Modal */}
        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Image className="h-5 w-5 text-amber-400" />
              Manage Showcase & Media Gallery
            </h2>
            <p className="text-xs text-neutral-400">Upload new bespoke looks, update prices, or remove designs</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cikin Modal: Form a gefe, Jerin kaya a gefe */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Sashen Fom (Upload / Edit Form) - 5 Columns */}
          <div className="md:col-span-5 bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4 h-fit">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-amber-400">
                {editingItem ? 'Edit Style Details' : 'Upload New Design'}
              </h3>
              {editingItem && (
                <button onClick={resetForm} className="text-[11px] text-neutral-400 underline">
                  Cancel Edit
                </button>
              )}
            </div>

            {msg && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Style Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Imperial Navy Kaftan"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Media Type</label>
                  <select
                    value={formData.media_type}
                    onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  >
                    <option value="image">Photo (Image)</option>
                    <option value="video">Short Video (Reel)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Base Price (NGN)</label>
                <input
                  required
                  type="number"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  placeholder="45000"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white font-mono outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">
                  {formData.media_type === 'video' ? 'Video URL (MP4 / Stream Link)' : 'Photo Direct URL'}
                </label>
                <input
                  required
                  type="url"
                  value={formData.media_url}
                  onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white font-mono outline-none focus:border-amber-500"
                />
              </div>

              {formData.media_type === 'video' && (
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Video Cover Poster URL (Thumbnail)</label>
                  <input
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Description / Detailing</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fabric type, embroidery specifications..."
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20 active:scale-98"
              >
                {saving ? 'Saving...' : editingItem ? 'Save Changes' : '+ Publish to Showcase'}
              </button>
            </form>
          </div>

          {/* Sashen Jerin Kayan da Ke Ciki (Current Showcase List) - 7 Columns */}
          <div className="md:col-span-7 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Live Showcase Items ({items.length})
            </h3>

            {loading ? (
              <div className="py-12 text-center text-neutral-500 text-xs flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-amber-400" /> Loading styles...
              </div>
            ) : items.length > 0 ? (
              <div className="space-y-2.5">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800">
                        <img
                          src={it.media_type === 'video' ? (it.thumbnail_url || it.media_url) : it.media_url}
                          alt={it.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          {it.title}
                          {it.media_type === 'video' && <Video className="h-3 w-3 text-amber-400" />}
                        </h4>
                        <span className="text-[11px] text-amber-400 font-mono font-bold block">
                          ₦{Number(it.base_price).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-neutral-500">{it.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(it)}
                        className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 transition"
                        title="Edit Details & Price"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(it.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition"
                        title="Delete from Showcase"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic py-8 text-center border border-dashed border-neutral-800 rounded-xl">
                Babu kaya a gallery tukuna. Yi amfani da fom ɗin kusa don ɗora sabo!
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageGalleryModal;