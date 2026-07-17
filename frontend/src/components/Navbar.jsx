import { ShoppingBag, User, LogOut, BookOpen } from 'lucide-react';

export default function Navbar({ onOpenCart, userRole, onLogout, onNavigate, currentPage }) {
  const isAdmin = userRole === 'admin';

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* ─── LOGO (RETOUR STRICT AU CATALOGUE) ─── */}
          <div 
            onClick={() => onNavigate('catalog')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="font-serif text-xl font-medium tracking-wide text-dark transition-colors group-hover:text-sage-600">
              Maison Florale
            </span>
          </div>

          {/* ─── LIENS DE NAVIGATION ─── */}
          <div className="hidden md:flex items-center gap-8 text-sm font-light text-muted">
            
            {/* BOUTON BOUTIQUE -> VA VERS 'catalog' */}
            <button 
              onClick={() => onNavigate('catalog')}
              className={`transition-colors hover:text-dark ${currentPage === 'catalog' ? 'text-dark font-medium' : ''}`}
            >
              Boutique
            </button>
            
            {/* BOUTON GUIDE -> VA VERS 'care-guide' */}
            <button 
              onClick={() => onNavigate('care-guide')}
              className={`flex items-center gap-1.5 transition-colors hover:text-dark ${currentPage === 'care-guide' ? 'text-dark font-medium' : ''}`}
            >
              <BookOpen className="h-3.5 w-3.5" /> Guide d'Entretien
            </button>

            {userRole && !isAdmin && (
              <button 
                onClick={() => onNavigate('my-orders')}
                className={`transition-colors hover:text-dark ${currentPage === 'my-orders' ? 'text-dark font-medium' : ''}`}
              >
                Mes Commandes
              </button>
            )}

            {isAdmin && (
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                Mode Admin
              </span>
            )}
          </div>

          {/* ─── ACTIONS (PANIER / COMPTE) ─── */}
          <div className="flex items-center gap-4">
            {!isAdmin && (
              <button 
                onClick={onOpenCart}
                className="p-2 text-stone-600 hover:text-dark transition-colors relative"
                aria-label="Ouvrir le panier"
              >
                <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
              </button>
            )}

            {userRole ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={onLogout}
                  className="p-2 text-stone-500 hover:text-rose-600 transition-colors flex items-center gap-1 text-xs font-light"
                  title="Se déconnecter"
                >
                  <LogOut className="h-4 w-4 stroke-[1.5]" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="inline-flex h-9 items-center justify-center rounded-full bg-stone-900 px-4 text-xs font-medium text-white transition-all hover:bg-stone-800"
              >
                <User className="h-3.5 w-3.5 mr-1.5" /> Connexion
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}