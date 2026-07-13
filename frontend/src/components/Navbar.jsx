import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ShoppingBag, User, Menu, X, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenCart, onNavigate, userRole, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ─── LECTURE DU STORE REDUX (Adapté aux noms de l'API) ───
  const items = useSelector((state) => state.cart?.items) || [];
  const totalArticles = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* 1. LA NAVBAR FIXÉE */}
      <nav className="w-full bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* LOGO */}
            <button 
              onClick={() => onNavigate('catalog')} 
              className="flex items-center gap-2 flex-shrink-0 bg-transparent border-0 cursor-pointer"
            >
              <span className="text-xl font-serif font-semibold tracking-wide text-dark">
                Fleuriste<span className="text-sage-500">.</span>
              </span>
            </button>

            {/* LIENS PC */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => onNavigate('catalog')} 
                className="text-sm font-medium text-dark hover:text-sage-600 transition-colors bg-transparent border-0 cursor-pointer"
              >
                Catalogue
              </button>
              {userRole === 'admin' && (
                <button 
                  onClick={() => onNavigate('admin-dashboard')} 
                  className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors bg-transparent border-0 cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck className="h-4 w-4" /> Dashboard Admin
                </button>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={onOpenCart}
                className="relative p-2 text-dark hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Ouvrir le panier"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalArticles > 0 && (
                  <span className="absolute top-1 right-1 bg-sage-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {totalArticles}
                  </span>
                )}
              </button>

              {/* BOUTON DYNAMIQUE CONNEXION / COMPTE / DECONNEXION */}
              {userRole ? (
                <button 
                  onClick={onLogout}
                  className="hidden sm:flex items-center gap-2 px-4 h-10 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              ) : (
                <button 
                  onClick={() => onNavigate('login')}
                  className="hidden sm:flex items-center gap-2 px-4 h-10 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-dark"
                >
                  <User className="h-4 w-4 text-muted" />
                  Connexion
                </button>
              )}

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-dark hover:bg-gray-50 rounded-full md:hidden transition-colors"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* MENU MOBILE */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-50 bg-white px-6 py-5 space-y-4 shadow-inner flex flex-col items-start">
            <button 
              onClick={() => { setIsMenuOpen(false); onNavigate('catalog'); }}
              className="text-base font-medium text-dark hover:text-sage-600 transition-colors py-1 block w-full text-left bg-transparent border-0"
            >
              Catalogue
            </button>
            {userRole === 'admin' && (
              <button 
                onClick={() => { setIsMenuOpen(false); onNavigate('admin-dashboard'); }}
                className="text-base font-medium text-purple-600 hover:text-purple-700 transition-colors py-1 block w-full text-left bg-transparent border-0"
              >
                Dashboard Admin
              </button>
            )}
            {userRole ? (
              <button 
                onClick={() => { setIsMenuOpen(false); onLogout(); }}
                className="flex items-center gap-2 text-base font-medium text-rose-600 hover:text-rose-700 transition-colors py-1 w-full text-left bg-transparent border-0"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            ) : (
              <button 
                onClick={() => { setIsMenuOpen(false); onNavigate('login'); }}
                className="flex items-center gap-2 text-base font-medium text-dark hover:text-sage-600 transition-colors py-1 w-full text-left bg-transparent border-0"
              >
                <User className="h-4 w-4 text-muted" />
                Se connecter
              </button>
            )}
          </div>
        )}
      </nav>

      {/* 2. LE COUSSIN INVISIBLE */}
      <div className="h-16 w-full" />
    </>
  );
}