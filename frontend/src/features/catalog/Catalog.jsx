import { useState, useEffect } from 'react'; 
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/cartSlice';
import { Plus } from 'lucide-react';
import api from '../../api/axios'; 
import { motion, AnimatePresence } from 'framer-motion';

// INCLUSION DES IMAGES DE PÉTALES
import petalPink from "../../assets/petal-pink.png";
import petalLavender from "../../assets/petal-lavender.png";
import petalMint from "../../assets/petal-mint.png";

const sources = [petalPink, petalLavender, petalMint];

// ─── FONCTION DE GÉNÉRATION HORS RENDU ───
const generateStaticPetals = (count) => {
  return Array.from({ length: count }).map((_, i) => ({
    src: sources[i % sources.length],
    left: Math.random() * 100,
    size: 20 + Math.random() * 25,
    duration: 12 + Math.random() * 12,
    delay: -Math.random() * 20,
    dx: (Math.random() - 0.5) * 150,
    opacity: 0.4 + Math.random() * 0.4,
  }));
};

// ─── COMPOSANT PLUIE DE PÉTALES EN ARRIÈRE-PLAN ───
function PetalRain({ count = 16 }) {
  const [petals] = useState(() => generateStaticPetals(count));

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      
      {/* 💡 INJECTION INJECTÉE DU STYLE DE L'ANIMATION POUR LE CDN TAILWIND */}
      <style>{`
        @keyframes drift {
          0% { 
            transform: translateY(-10%) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: var(--petal-opacity, 0.7); }
          90% { opacity: var(--petal-opacity, 0.7); }
          100% { 
            transform: translateY(110vh) translateX(var(--dx, 100px)) rotate(360deg);
            opacity: 0;
          }
        }
        .custom-petal-animation {
          animation: drift linear infinite;
        }
      `}</style>

      {petals.map((p, i) => (
        <img
          key={i}
          src={p.src}
          alt=""
          className="absolute custom-petal-animation will-change-transform"
          style={{
            left: `${p.left}%`,
            top: '-5%',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--dx": `${p.dx}px`,
            "--petal-opacity": p.opacity,
          }}
        />
      ))}
    </div>
  );
}

// ─── COMPOSANT CATALOGUE PRINCIPAL ───
export default function Catalog({ onOpenCart }) {
  const dispatch = useDispatch();
  const [flowers, setFlowers] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [search, setSearch] = useState('');
  const [category] = useState('Tous');

  const [base, setBase] = useState(1200);
  const [flowerType, setFlowerType] = useState(2500);
  const [size, setSize] = useState(1);

  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/products/all');
        if (Array.isArray(response.data)) {
          setFlowers(response.data);
        } else if (response.data && Array.isArray(response.data.products)) {
          setFlowers(response.data.products);
        } else {
          setFlowers([]); 
        }
      } catch (err) {
        console.error("Erreur API :", err);
        setFlowers([]); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlowers();
  }, []);

  const customPrice = (base + flowerType) * size;

  const handleAddCustomBouquet = () => {
    const flowerNames = { 2500: "Roses Poudrées", 3500: "Pivoines Royales", 1800: "Fleurs Sauvages" };
    const flowerImages = {
      2500: "https://images.unsplash.com/photo-1533616688419-b7a585564566?w=400&q=80",
      3500: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&q=80",
      1800: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=80"
    };

    const customProduct = {
      _id: `custom_${Date.now()}`, 
      name: `Sur-mesure : ${flowerNames[flowerType]}`,
      isCustom: true,
      price: Number(customPrice),
      imageUrl: flowerImages[flowerType],
      quantity: 1,
      stock: 999, 
      customDetails: { 
        base: base === 1200 ? "Feuillage Linéaire" : "Eucalyptus Premium",
        flower: flowerNames[flowerType],
        size: size === 1 ? "Format Délicat" : "Majestueux"
      }
    };
    dispatch(addItem(customProduct));
    onOpenCart();
  };

  const filteredFlowers = (Array.isArray(flowers) ? flowers : []).filter(flower => {
    if (!flower || !flower.name) return false;
    return flower.name.toLowerCase().includes(search.toLowerCase()) && 
           (category === 'Tous' || flower.category === category);
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-light text-muted font-serif italic">Maison Florale charge ses plus belles tiges...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative bg-transparent">
      
      {/* PLUIE DE PÉTALES EN ARRIÈRE-PLAN */}
      <PetalRain count={16} />

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 relative z-10">
        
        {/* ─── 1. HERO SECTION ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[80vh] items-center gap-12 pt-4">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 h-[50vh] lg:h-[75vh] w-full relative overflow-hidden rounded-[2rem] shadow-sm ring-1 ring-sage-100 bg-white/10 backdrop-blur-sm"
          >
            <img 
              src="https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=1200&q=80" 
              alt="Atelier Floral Premium" 
              className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105" 
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col justify-center space-y-8 pr-4"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-sage-600 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-powder-500 animate-ping"></span> Maison Florale
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight text-dark leading-[1.1]">
              L'élégance à l'état <br />
              <span className="italic font-normal text-powder-500 bg-gradient-to-r from-powder-500 to-sage-500 bg-clip-text text-transparent">premium.</span>
            </h1>
            <p className="text-base font-light leading-relaxed text-muted max-w-md">Des tiges sourcées avec passion, infusées de douceur et assemblées pour créer l'accord parfait.</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#pret-a-vendre" className="inline-flex h-12 items-center justify-center rounded-full bg-sage-600 px-8 text-sm font-medium text-white transition-all hover:bg-sage-700 hover:shadow-lg">
                Découvrir la collection
              </a>
              <a href="#sur-mesure" className="inline-flex h-12 items-center justify-center rounded-full border border-powder-100 bg-white/60 px-8 text-sm font-medium text-powder-600 transition-all hover:bg-powder-100/40">
                Ouvrir l'Atelier 🌸
              </a>
            </div>
          </motion.div>
        </section>

        {/* ─── 2. L'ATELIER DE CREATION SUR-MESURE ─── */}
        <section id="sur-mesure" className="max-w-5xl mx-auto space-y-12 scroll-mt-24">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold tracking-widest text-sage-600 bg-sage-100 px-3 py-1 rounded-full uppercase">Atelier d'Artiste</span>
            <h2 className="font-serif text-4xl font-medium text-dark">Façonnez votre poésie</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            <div className="md:col-span-7 bg-white/60 backdrop-blur-md rounded-[2rem] border border-sage-100 p-6 sm:p-8 space-y-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-sage-600">01. Fond de Verdure Sauvage</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onClick={() => setBase(1200)} className={`w-full min-h-[4.5rem] py-3 px-4 rounded-xl text-left text-sm transition-all border ${base === 1200 ? 'border-sage-500 bg-white shadow-md text-sage-700 font-semibold' : 'border-transparent bg-white/40 hover:bg-white'}`}>
                      🌿 Feuillage Linéaire (+1 200 DA)
                    </button>
                    <button onClick={() => setBase(1800)} className={`w-full min-h-[4.5rem] py-3 px-4 rounded-xl text-left text-sm transition-all border ${base === 1800 ? 'border-sage-500 bg-white shadow-md text-sage-700 font-semibold' : 'border-transparent bg-white/40 hover:bg-white'}`}>
                      🍃 Eucalyptus Premium (+1 800 DA)
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-powder-600">02. Cœur de Fleurs Rose Poésie</span>
                  <div className="flex flex-wrap gap-2.5 w-full">
                    {[[2500, "Roses Blanches"], [3500, "Pivoines Poudrées"], [1800, "Fleurs Sauvages"]].map(([price, name]) => (
                      <button key={price} onClick={() => setFlowerType(price)} className={`flex-1 min-w-[100px] py-3 px-2 rounded-xl text-center text-xs transition-all border ${flowerType === price ? 'border-powder-500 bg-white shadow-md text-powder-600 font-semibold' : 'border-transparent bg-white/40 hover:bg-white'}`}>
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-sage-600">03. Envergure de la Composition</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setSize(1)} className={`w-full min-h-[3.5rem] py-2 px-3 rounded-xl text-center text-sm transition-all border ${size === 1 ? 'border-sage-500 bg-white shadow-md font-semibold text-sage-700' : 'border-transparent bg-white/40 hover:bg-white'}`}>Format Délicat</button>
                    <button onClick={() => setSize(1.5)} className={`w-full min-h-[3.5rem] py-2 px-3 rounded-xl text-center text-sm transition-all border ${size === 1.5 ? 'border-sage-500 bg-white shadow-md font-semibold text-sage-700' : 'border-transparent bg-white/40 hover:bg-white'}`}>Majestueux (x1.5)</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 bg-gradient-to-br from-sage-900 to-sage-950 rounded-[2rem] overflow-hidden flex flex-col justify-between text-left shadow-xl min-h-[450px] border border-sage-800">
              <div className="relative w-full h-[230px] bg-black/20">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={flowerType} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    src={flowerType === 2500 ? "https://images.unsplash.com/photo-1533616688419-b7a585564566?w=600&q=80" : flowerType === 3500 ? "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&q=80" : "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&q=80"} 
                    alt="Aperçu" className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-end text-white">
                  <div>
                    <h3 className="font-serif text-xl font-light">Votre Signature</h3>
                  </div>
                  <p className="text-xl font-bold">{customPrice.toLocaleString('fr-FR')} DA</p>
                </div>
                <button onClick={handleAddCustomBouquet} className="w-full h-12 rounded-xl bg-white text-sage-900 font-bold text-sm shadow-md">
                  Ajouter ma création au panier
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. CATALOGUE DES PRODUITS ─── */}
        <section id="pret-a-vendre" className="space-y-12 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-stone-200 pb-6 gap-6">
            <h2 className="font-serif text-3xl font-medium text-dark">Les Prêts-à-Emporter</h2>
            <div className="flex flex-wrap gap-4 items-center">
              <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 rounded-full border border-stone-200 bg-white/60 pl-4 pr-4 text-xs focus:outline-none w-48" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {filteredFlowers.map((flower) => (
              <div key={flower._id} className="group relative flex flex-col space-y-4 bg-white/60 backdrop-blur-sm p-3 rounded-[1.8rem] border border-stone-100 shadow-sm">
                <div className="w-full aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-stone-100 relative">
                  <img src={flower.imageUrl} alt={flower.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-col flex-1 space-y-2 px-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-sm font-medium text-dark line-clamp-1">{flower.name}</h3>
                    <span className="font-semibold text-sage-600 text-xs">{flower.price?.toLocaleString('fr-FR')} DA</span>
                  </div>
                  <p className="text-xs font-light text-muted line-clamp-2 leading-relaxed h-8">{flower.description}</p>
                  <button onClick={() => { dispatch(addItem(flower)); onOpenCart(); }} className="w-full h-9 rounded-xl border border-powder-100 bg-powder-100/40 text-powder-600 text-xs font-semibold hover:bg-powder-500 hover:text-white transition-all">
                    <Plus className="inline mr-1 h-3 w-3" /> Sélectionner ce bouquet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 4. SECTION PROMESSE ─── */}
        <section className="mt-28 border-t border-rose-100/70 pt-20 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-serif text-3xl text-dark">Là où les fleurs murmurent...</h2>
              <p className="text-sm font-light leading-relaxed text-muted">
                Chaque création de <strong>FloraConnect</strong> est assemblée avec amour et passion pour transformer vos instants en souvenirs inoubliables.
              </p>
            </div>
            <div className="lg:col-span-5 bg-white/60 border border-rose-100/80 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-4">Notre Engagement</h3>
              <p className="text-xs font-light text-muted leading-relaxed">Fleurs fraîches coupées le matin même, emballages éco-conçus et livraison soignée.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}