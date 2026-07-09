import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, addItem, deleteItem, clearCart } from '../../store/cartSlice';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

export default function SidebarCart({ isOpen, onClose }) {
  const dispatch = useDispatch();
  
  // ─── LECTURE DU PANIER REDUX (Variables API) ───
  const items = useSelector((state) => state.cart?.items) || [];
  
  // Calculs dynamiques (quantity et price)
  const totalArticles = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // ─── FONCTION DE VALIDATION DE LA COMMANDE (Liaison API) ───
  const handleCheckout = async () => {
    // Structure exacte attendue par le modèle "Order" de ton amie :
    const orderPayload = {
      // client: "ID_DU_CLIENT_CONNECTE", // À récupérer via ton store Auth plus tard
      items: items.map(item => ({
        product: item._id,            // Référence à l'_id MongoDB du produit
        quantity: item.quantity,       // Quantité minimale : 1
        priceAtPurchase: item.price    // On fige le prix au moment de l'achat
      })),
      totalAmount: totalPrice          // Prix total de la commande
    };

    console.log("Payload prêt pour l'envoi au backend (POST /api/orders) :", orderPayload);
    
    // Exemple d'appel que tu feras avec Axios :
    // try {
    //   await api.post('/orders', orderPayload);
    //   dispatch(clearCart());
    //   alert("Commande validée avec succès !");
    //   onClose();
    // } catch (error) { ... }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fond sombre transparent */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* EN-TÊTE DU PANIER */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-sage-600" />
              <h2 className="text-lg font-serif font-medium text-dark">Mon Panier ({totalArticles})</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full text-muted transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* LISTE DES ARTICLES */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <span className="text-4xl">🌸</span>
                <p className="text-sm font-light text-muted">Votre panier est encore vide.<br />Laissez-vous tenter par nos compositions.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  {/* Image du bouquet */}
                  <img src={item.imageUrl} alt={item.name} className="h-20 w-16 object-cover rounded-xl bg-stone-50 flex-shrink-0" />
                  
                  {/* Infos & Quantité */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-dark truncate">{item.name}</h3>
                    <p className="text-sm font-semibold text-sage-600 mt-0.5">
                      {(item.price * item.quantity).toLocaleString('fr-FR')} DA
                    </p>
                    
                    {/* Sélecteur de quantité */}
                    <div className="flex items-center gap-2 mt-3">
                      <button 
                        onClick={() => dispatch(removeItem(item._id))}
                        className="p-1 border border-gray-200 rounded-lg hover:bg-gray-50 text-muted transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-medium w-6 text-center text-dark">{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(addItem(item))}
                        className="p-1 border border-gray-200 rounded-lg hover:bg-gray-50 text-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Bouton supprimer (poubelle) */}
                  <button 
                    onClick={() => dispatch(deleteItem(item._id))}
                    className="p-2 text-gray-300 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                    aria-label="Supprimer l'article"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* PIED DE TIROIR (TOTAL & VALIDATION) */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-stone-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-light text-muted">Sous-total</span>
                <span className="text-xl font-bold text-dark">
                  {totalPrice.toLocaleString('fr-FR')} DA
                </span>
              </div>
              <p className="text-[11px] font-light text-muted leading-tight">
                Frais de livraison calculés lors de l'étape suivante. Commande préparée à la demande par nos artisans.
              </p>
              
              <button 
                onClick={handleCheckout}
                className="w-full h-12 bg-sage-600 text-white font-medium rounded-xl shadow-lg shadow-sage-600/10 hover:bg-sage-700 transition-colors active:scale-98 text-sm mt-2"
              >
                Valider ma commande
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}