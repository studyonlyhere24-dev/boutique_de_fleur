import { useState, useEffect } from 'react'; 
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/cartSlice';
import { Search, Plus, Flower2, Sparkles, Heart, Sparkle } from 'lucide-react';
import api from '../../api/axios'; 

export default function Catalog({ onOpenCart }) {
  const dispatch = useDispatch();
  const [flowers, setFlowers] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');

  // États Atelier
  const [base, setBase] = useState(1200);
  const [flowerType, setFlowerType] = useState(2500);
  const [size, setSize] = useState(1);

  // ─── API : CHARGEMENT ET PROTECTION DU CATALOGUE ───
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
          console.error("Format de données inconnu :", response.data);
          setFlowers([]); 
        }
      } catch (err) {
        console.error("Impossible de récupérer les fleurs du catalogue :", err);
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

    dispatch(addItem({
      ...flowerImages,
      _id: `custom-${Date.now()}`,
      name: `Sur-mesure : ${flowerNames[flowerType]}`,
      isCustom: true,
      price: customPrice,
      imageUrl: flowerImages[flowerType],
      quantity: 1
    }));
    onOpenCart();
  };

  const safeFlowers = Array.isArray(flowers) ? flowers : [];
  const filteredFlowers = safeFlowers.filter(flower => {
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
    <div className="space-y-32">
      
      {/* ─── 1. HERO SECTION EDITORIALE ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[80vh] items-center gap-12 pt-4">
        <div className="lg:col-span-7 h-[50vh] lg:h-[75vh] w-full relative overflow-hidden rounded-[2rem] shadow-sm ring-1 ring-sage-100">
          <img src="https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=1200&q=80" alt="Atelier Floral Premium" className="h-full w-full object-cover object-center scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-sage-100/20 to-transparent"></div>
        </div>
        
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8 pr-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-sage-600 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-powder-500 animate-ping"></span> Maison Florale
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight text-dark leading-[1.1]">
            L'élégance à l'état <br />
            <span className="italic font-normal text-powder-500 bg-gradient-to-r from-powder-500 to-sage-500 bg-clip-text text-transparent">premium.</span>
          </h1>
          <p className="text-base font-light leading-relaxed text-muted max-w-md">Des tiges sourcées avec passion, infusées de douceur et assemblées pour créer l'accord parfait.</p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a href="#pret-a-vendre" className="inline-flex h-12 items-center justify-center rounded-full bg-sage-600 px-8 text-sm font-medium text-white transition-all hover:bg-sage-700 hover:shadow-lg hover:shadow-sage-500/10 active:scale-95">Découvrir la collection</a>
            <a href="#sur-mesure" className="inline-flex h-12 items-center justify-center rounded-full border border-powder-100 bg-powder-100/20 px-8 text-sm font-medium text-powder-600 transition-colors hover:bg-powder-100/40">Ouvrir l'Atelier 🌸</a>
          </div>
        </div>
      </section>

      {/* ─── 2. L'ATELIER DE CREATION SUR-MESURE ─── */}
      <section id="sur-mesure" className="max-w-5xl mx-auto space-y-12 scroll-mt-24">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold tracking-widest text-sage-600 bg-sage-100 px-3 py-1 rounded-full uppercase">Atelier d'Artiste</span>
          <h2 className="font-serif text-4xl font-medium text-dark">Façonnez votre poésie</h2>
          <p className="text-sm font-light text-muted max-w-md mx-auto">Un mix parfait de nuances vertes et de textures poudrées.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          <div className="md:col-span-7 bg-sage-100/30 rounded-[2rem] border border-sage-100 p-6 sm:p-8 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-sage-600">01. Fond de Verdure Sauvage</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button onClick={() => setBase(1200)} className={`w-full min-h-[4.5rem] py-3 px-4 rounded-xl text-left text-sm transition-all border flex items-center ${base === 1200 ? 'border-sage-500 bg-white shadow-sm text-sage-700 font-semibold' : 'border-transparent bg-white/60 hover:bg-white text-dark'}`}>
                    <span className="leading-tight">🌿 Feuillage Linéaire (+1 200 DA)</span>
                  </button>
                  <button onClick={() => setBase(1800)} className={`w-full min-h-[4.5rem] py-3 px-4 rounded-xl text-left text-sm transition-all border flex items-center ${base === 1800 ? 'border-sage-500 bg-white shadow-sm text-sage-700 font-semibold' : 'border-transparent bg-white/60 hover:bg-white text-dark'}`}>
                    <span className="leading-tight">🍃 Eucalyptus Premium (+1 800 DA)</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-powder-600">02. Cœur de Fleurs Rose Poésie</span>
                <div className="flex flex-wrap gap-2.5 w-full">
                  {[[2500, "Roses Blanches"], [3500, "Pivoines Poudrées"], [1800, "Fleurs Sauvages"]].map(([price, name]) => (
                    <button key={price} onClick={() => setFlowerType(price)} className={`flex-1 min-w-[95px] sm:min-w-[110px] py-3 px-2 rounded-xl text-center text-xs transition-all border break-words ${flowerType === price ? 'border-powder-500 bg-white shadow-sm text-powder-600 font-semibold' : 'border-transparent bg-white/60 hover:bg-white text-dark'}`}>{name}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-sage-600">03. Envergure de la Composition</span>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setSize(1)} className={`w-full min-h-[3.5rem] py-2 px-3 rounded-xl text-center text-sm transition-all border flex items-center justify-center ${size === 1 ? 'border-sage-500 bg-white shadow-sm font-semibold text-sage-700' : 'border-transparent bg-white/60 hover:bg-white'}`}>Format Délicat</button>
                  <button onClick={() => setSize(1.5)} className={`w-full min-h-[3.5rem] py-2 px-3 rounded-xl text-center text-sm transition-all border flex items-center justify-center ${size === 1.5 ? 'border-sage-500 bg-white shadow-sm font-semibold text-sage-700' : 'border-transparent bg-white/60 hover:bg-white'}`}>Majestueux (x1.5)</button>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-gradient-to-br from-sage-900 to-sage-950 rounded-[2rem] overflow-hidden flex flex-col justify-between text-left shadow-xl min-h-[450px] border border-sage-800">
            <div className="relative w-full h-[230px] overflow-hidden bg-black/20 group">
              <img 
                src={
                  flowerType === 2500 
                    ? "https://images.unsplash.com/photo-1533616688419-b7a585564566?w=600&q=80" 
                    : flowerType === 3500 
                    ? "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&q=80" 
                    : "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&q=80" 
                } 
                alt="Aperçu de votre création" 
                className="w-full h-full object-cover transition-transform duration-750 ease-out scale-100 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-950 via-transparent to-transparent"></div>
              <span className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                Aperçu en temps réel
              </span>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-light text-white tracking-wide">Votre Signature</h3>
                  <p className="text-xs text-sage-300 font-light">Un arrangement personnalisé par vos soins.</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-sage-400 font-mono">Total</span>
                  <p className="text-2xl font-bold tracking-tight text-white mt-1">{customPrice.toLocaleString('fr-FR')} DA</p>
                </div>
              </div>

              <button 
                onClick={handleAddCustomBouquet} 
                className="w-full h-12 rounded-xl bg-white text-sage-900 hover:bg-powder-100 font-bold text-sm shadow-md transition-all active:scale-98"
              >
                Ajouter ma création au panier
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. CATALOGUE SYNCHRONISÉ AVEC LE BACKEND ─── */}
      <section id="pret-a-vendre" className="space-y-12 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-gray-100 pb-6 gap-6">
          <div className="space-y-1">
            <h2 className="font-serif text-3xl font-medium text-dark">Les Prêts-à-Emporter</h2>
            <p className="text-sm font-light text-muted">Créations exclusives prêtes à fleurir votre intérieur.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
              <input type="text" placeholder="Rechercher une tige..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-full rounded-full border border-gray-200 pl-9 pr-4 text-xs focus:border-sage-500 focus:outline-none sm:w-48 bg-transparent" />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-full border border-gray-200 px-4 text-xs focus:border-sage-500 focus:outline-none bg-transparent cursor-pointer text-muted">
              <option value="Tous">Toutes les collections</option>
              <option value="Roses">Collection Roses</option>
              <option value="Champêtre">Esprit Champêtre</option>
              <option value="Lys">Les Lys d'Exception</option>
              <option value="Saison">Fleurs de Saison</option>
            </select>
          </div>
        </div>

        {filteredFlowers.length === 0 ? (
          <div className="text-center py-12 text-muted font-light italic">
            Auc bouquet ne correspond à votre recherche.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {filteredFlowers.map(flower => {
              const isOutOfStock = flower.stock === 0;

              return (
                <div key={flower._id} className="group relative flex flex-col space-y-4">
                  <div className="w-full aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-surface ring-1 ring-gray-100 relative">
                    <img src={flower.imageUrl} alt={flower.name} className={`h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 ${isOutOfStock ? 'opacity-40 grayscale' : ''}`} />
                    
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
                          Rupture
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-medium text-dark tracking-tight">{flower.name}</h3>
                      <span className="font-semibold text-sage-600 whitespace-nowrap">
                        {flower.price ? flower.price.toLocaleString('fr-FR') : 0} DA
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {isOutOfStock ? (
                        <span className="text-[10px] font-medium text-rose-500">Victime de son succès</span>
                      ) : flower.stock <= 3 ? (
                        <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md animate-pulse">
                          Plus que {flower.stock} disponibles !
                        </span>
                      ) : (
                        <span className="text-[10px] font-light text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          En stock
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-light text-muted line-clamp-2 leading-relaxed">{flower.description}</p>
                    
                    <div className="pt-2">
                      <button 
                        disabled={isOutOfStock}
                        onClick={() => {
                          dispatch(addItem(flower));
                          onOpenCart();
                        }}
                        className={`w-full inline-flex h-9 items-center justify-center rounded-xl border text-xs font-semibold transition-all ${
                          isOutOfStock 
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'border-powder-100 bg-powder-100/20 text-powder-600 hover:bg-powder-500 hover:text-white hover:border-powder-500'
                        }`}
                      >
                        {isOutOfStock ? 'Indisponible' : <><Plus className="mr-1 h-3 w-3" /> Sélectionner ce bouquet</>}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ─── 4. SECTION : À PROPOS DE NOUS (ÉDITION ROSE POÉTIQUE) ─── */}
      <section className="mt-28 border-t border-rose-100/70 pt-20 pb-12 relative overflow-hidden">
        {/* Lueurs d'arrière-plan roses et douces pour réchauffer l'UI */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-rose-100/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 -left-10 w-60 h-60 bg-sage-50/50 rounded-full blur-2xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* TEXTE / HISTOIRE D'AMOUR FLORALE */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50/80 border border-rose-100 rounded-full text-rose-600 backdrop-blur-sm">
              <Flower2 className="h-3.5 w-3.5 animate-pulse" />
              <span className="text-[10px] font-semibold uppercase tracking-widest font-sans">Notre Philosophie</span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl text-dark font-medium leading-[1.2]">
              Là où les fleurs murmurent <br />
              <span className="text-rose-600/90 italic">les secrets de votre cœur.</span>
            </h2>
            
            <div className="space-y-4 text-sm font-light leading-relaxed text-muted max-w-2xl">
              <p>
                Né de la passion pour l'art de vivre et la poésie végétale, 
                <span className="font-medium text-dark font-serif mx-1 text-base">FloraConnect</span> 
                n'est pas une simple boutique de fleurs. C'est un atelier digital engagé où la délicatesse rencontre la modernité. Nous pensons que chaque pétale, chaque nuance de rose, chaque parfum porte en lui un message suspendu.
              </p>
              <p>
                Nous sélectionnons nos variétés auprès de producteurs passionnés, en privilégiant la fraîcheur absolue et le rythme des saisons. Pour nous, composer un bouquet est un dialogue artistique : harmoniser la force d'une tige avec la fragilité d'une corolle.
              </p>
              <p className="font-serif italic text-rose-700/80 text-base border-l-2 border-rose-200 pl-4 my-4">
                « Offrir des fleurs, c'est offrir un morceau de poésie à l'état pur. »
              </p>
            </div>
          </div>

          {/* BLOC ENGAGEMENTS / DESIGN PREMIUM */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-rose-50/60 via-white to-stone-50/40 border border-rose-100/80 rounded-2xl p-6 sm:p-8 shadow-sm backdrop-blur-sm relative">
              <div className="absolute -top-3 -right-3 h-10 w-10 bg-rose-100/50 rounded-full flex items-center justify-center text-rose-500">
                <Sparkle className="h-4 w-4" />
              </div>

              <h3 className="text-xs font-semibold text-dark uppercase tracking-widest mb-6 pb-2 border-b border-rose-100/60">
                Nos Promesses Dorées
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="h-9 w-9 rounded-xl bg-rose-100/60 flex items-center justify-center text-rose-600 shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-dark uppercase tracking-wider">Sélection Éco-Responsable</h4>
                    <p className="text-[11px] font-light text-muted leading-relaxed">
                      Des fleurs de saison cueillies à maturité parfaite, respectant le cycle bienveillant de la Terre.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="h-9 w-9 rounded-xl bg-rose-100/60 flex items-center justify-center text-rose-600 shrink-0">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-dark uppercase tracking-wider">Créations sur-mesure</h4>
                    <p className="text-[11px] font-light text-muted leading-relaxed">
                      Chaque création est confectionnée à la main avec un amour infini par nos artisans fleuristes partenaires.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-rose-100/50 text-center">
                <span className="font-serif text-xs italic text-rose-600/70">
                  FloraConnect — Cueilleurs d'instants précieux.
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}