import React from 'react';
import { useSelector } from 'react-redux';
import { ShoppingBag, ChevronUp } from 'lucide-react';

export default function StickyCartBanner({ onOpenCart }) {
  // ─── ON LIT LE PANIER DEPUIS REDUX COMME AVANT ───
  const items = useSelector((state) => state.cart?.items) || [];
  
  // Calcul du nombre total d'articles et du prix total
  const totalArticles = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Si le panier est vide, on n'affiche rien
  if (totalArticles === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden pointer-events-none">
      <button
        onClick={onOpenCart}
        className="w-full h-14 bg-sage-600 text-white rounded-2xl flex items-center justify-between px-5 shadow-xl shadow-sage-900/20 active:scale-95 transition-all pointer-events-auto"
      >
        <div className="flex items-center gap-3">
          <div className="relative p-1 bg-white/10 rounded-lg">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div className="text-left flex flex-col">
            <span className="text-xs font-light text-sage-100 leading-none">Mon Panier</span>
            <span className="text-sm font-semibold mt-0.5">
              {totalArticles} {totalArticles > 1 ? 'articles' : 'article'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight">
            {totalPrice.toLocaleString('fr-FR')} DA
          </span>
          <ChevronUp className="h-4 w-4 text-sage-200 animate-bounce" style={{ animationDuration: '2s' }} />
        </div>
      </button>
    </div>
  );
}