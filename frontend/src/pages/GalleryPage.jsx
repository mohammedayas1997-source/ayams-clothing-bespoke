import React, { useState } from 'react';
import { Play, Sparkles, Scissors, ShoppingBag } from 'lucide-react';
import CustomerAuthModal from '../components/CustomerAuthModal';
import CheckoutPaymentModal from '../components/CheckoutPaymentModal';
import { createDirectPurchase } from '../services/api';

const GalleryPage = ({ onSelectStyleForOrder }) => {
  const [filter, setFilter] = useState('All');
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);

  // Samfuran kayan da aka tallata
  const collectionItems = [
    {
      id: 1,
      title: 'Royal Obsidian Kaftan',
      category: 'Men',
      type: 'image',
      price: '₦45,000',
      tag: 'Signature Bespoke',
      media: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
      desc: 'Hand-stitched collar detailing with structured imperial shoulders.',
    },
    {
      id: 2,
      title: 'Crimson Velvet Bridal Kaftan',
      category: 'Women',
      type: 'image',
      price: '₦85,000',
      tag: 'Haute Couture',
      media: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
      desc: 'Intricate crystal embroidery tailored for supreme elegance.',
    },
    {
      id: 3,
      title: 'The Sovereign Agbada Ensemble',
      category: 'Men',
      type: 'video',
      price: '₦120,000',
      tag: 'Bespoke Reel',
      thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      desc: 'Watch the fluid drape and fabric richness in dynamic motion.',
    },
    {
      id: 4,
      title: 'Monarch Gold Senator Suit',
      category: 'Men',
      type: 'image',
      price: '₦50,000',
      tag: 'Executive Fit',
      media: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&q=80&w=800',
      desc: 'Clean pocket geometric cut with custom bronze bespoke buttons.',
    },
    {
      id: 5,
      title: 'Emerald Silk Evening Gown',
      category: 'Women',
      type: 'video',
      price: '₦95,000',
      tag: 'Motion Reel',
      thumbnail: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      desc: 'Floor-length Italian silk silhouette crafted with seamless darts.',
    },
    {
      id: 6,
      title: 'Ivory Royal Linen Set',
      category: 'Men',
      type: 'image',
      price: '₦40,000',
      tag: 'Summer Bespoke',
      media: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=800',
      desc: 'Breathable imported Irish linen with precision cuff links.',
    },
  ];

  // Mataki na 1: Lokacin da customer ya danna Buy Now
  const handleBuyNow = (item) => {
    setSelectedItemForPurchase(item);
    setShowAuthModal(true);
  };

  // Mataki na 2: Karbar bayanan customer tare da cikakken adireshi
  const handleAuthSuccess = (customer, fullAddress) => {
    setCurrentCustomer(customer);
    setShowAuthModal(false);
    proceedToOrder(customer, selectedItemForPurchase, fullAddress);
  };

  // Mataki na 3: Bude oda a database (Kada a maimaita wannan aikin)
  const proceedToOrder = async (customer, item, deliveryAddress) => {
    try {
      const rawPrice = item.price
        ? Number(item.price.replace(/[^0-9.-]+/g, ''))
        : Number(item.base_price);

      const res = await createDirectPurchase({
        customer_id: customer.id,
        style_id: item.id,
        amount: rawPrice || 35000,
        delivery_address: deliveryAddress || 'Store Pickup',
      });

      if (res.data.success) {
        setActiveOrder(res.data.order);
        setShowPaymentModal(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating order.');
    }
  };

  const filteredItems =
    filter === 'All'
      ? collectionItems
      : filter === 'Reels'
      ? collectionItems.filter((item) => item.type === 'video')
      : collectionItems.filter((item) => item.category === filter);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Showcase Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-neutral-800 p-8 md:p-12 shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="h-3 w-3" /> Exclusive 2026 Collection
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Tailored To Perfection. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
              Crafted For Royalty.
            </span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            Explore our curated catalog of handcrafted bespoke kaftans, agbadas, suits, and gowns. Buy ready-to-wear pieces directly or book custom tailoring.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['All', 'Men', 'Women', 'Reels'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition ${
                filter === tab
                  ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
                  : 'bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700'
              }`}
            >
              {tab === 'Reels' ? '🎥 Video Reels' : tab}
            </button>
          ))}
        </div>
        <span className="text-xs text-neutral-500 font-mono">
          Showing {filteredItems.length} curated designs
        </span>
      </div>

      {/* Showcase Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden flex flex-col shadow-xl hover:border-amber-500/50 transition duration-300"
          >
            {/* Media Box */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-950">
              <img
                src={item.type === 'video' ? item.thumbnail : item.media}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
              />

              {/* Tag overlay */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {item.tag}
                </span>
              </div>

              {/* Video Play Button Overlay */}
              {item.type === 'video' && (
                <button
                  onClick={() => setActiveVideoModal(item.videoUrl)}
                  className="absolute inset-0 m-auto h-14 w-14 rounded-full bg-neutral-950/80 backdrop-blur-md border border-amber-500/40 text-amber-400 flex items-center justify-center hover:scale-110 transition shadow-2xl"
                >
                  <Play className="h-6 w-6 ml-1 fill-amber-400" />
                </button>
              )}
            </div>

            {/* Info Box */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-base tracking-tight">{item.title}</h3>
                  <span className="font-mono font-extrabold text-amber-400 text-sm">
                    {item.price}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Action Buttons: Buy Now & Bespoke Fitting */}
              <div className="pt-2 border-t border-neutral-800/80 flex items-center gap-2">
                <button
                  onClick={() => handleBuyNow(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-neutral-950 text-xs font-bold transition shadow-md shadow-amber-500/10 active:scale-98"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={() => onSelectStyleForOrder?.(item)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition"
                  title="Order custom tailoring with measurements"
                >
                  <Scissors className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Bespoke</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Popup */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-neutral-950/80 text-neutral-400 hover:text-white border border-neutral-700 text-xs font-bold"
            >
              Close ✕
            </button>
            <div className="aspect-video w-full bg-black">
              <video
                src={activeVideoModal}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modals for Client Purchase Flow */}
      <CustomerAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        selectedItem={selectedItemForPurchase}
      />

      <CheckoutPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderDetails={activeOrder}
        clientInfo={currentCustomer}
        item={selectedItemForPurchase}
      />
    </div>
  );
};

export default GalleryPage;