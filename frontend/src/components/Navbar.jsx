import { ShoppingBag, User, LogOut, BookOpen } from 'lucide-react';

export default function Navbar({ onOpenCart, userRole, onLogout, onNavigate, currentPage }) {
  const isAdmin = userRole === 'admin';

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* ─── LOGO (DYNAMIQUE SELON LE RÔLE) ─── */}
          <div 
            onClick={() => onNavigate(isAdmin ? 'admin-dashboard' : 'catalog')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="font-serif text-xl font-medium tracking-wide text-dark transition-colors group-hover:text-sage-600">
              Maison Florale
            </span>
          </div>

          {/* ─── LIENS DE NAVIGATION ─── */}
          <div className="hidden md:flex items-center gap-8 text-sm font-light text-muted">
            
            {/* On affiche ces liens UNIQUEMENT si l'utilisateur n'est PAS un admin */}
            {!isAdmin && (
              <>
                {/* BOUTON BOUTIQUE */}
                <button 
                  onClick={() => onNavigate('catalog')}
                  className={`transition-colors hover:text-dark ${currentPage === 'catalog' ? 'text-dark font-medium' : ''}`}
                >
                  Boutique
                </button>
                
                {/* BOUTON GUIDE D'ENTRETIEN */}
                <button 
                  onClick={() => onNavigate('care-guide')}
                  className={`flex items-center gap-1.5 transition-colors hover:text-dark ${currentPage === 'care-guide' ? 'text-dark font-medium' : ''}`}
                >
                  <BookOpen className="h-3.5 w-3.5" /> Guide d'Entretien
                </button>
              </>
            )}

            {/* Espace commandes pour le client connecté */}
            {userRole && !isAdmin && (
              <button 
                onClick={() => onNavigate('my-orders')}
                className={`transition-colors hover:text-dark ${currentPage === 'my-orders' ? 'text-dark font-medium' : ''}`}
              >
                Mes Commandes
              </button>
            )}
          </div>

          {/* ─── ACTIONS (PANIER / COMPTE) ─── */}
          <div className="flex items-center gap-4">
            {/* Panier masqué pour l'admin */}
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