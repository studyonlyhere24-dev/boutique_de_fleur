import { useState } from 'react'; // 💡 Ajout de useState pour gérer un état de chargement local
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, addItem, deleteItem, clearCart } from '../../store/cartSlice';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import api from '../../api/axios'; // 💡 Importation de l'instance Axios connectée au backend

export default function SidebarCart({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false); // Bloque le bouton pendant l'envoi
  
  // ─── LECTURE DU PANIER REDUX ───
  const items = useSelector((state) => state.cart?.items) || [];
  
  // Calculs dynamiques
  const totalArticles = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // ─── LIAISON API REELLE POUR LA VALIDATION ───
  const handleCheckout = async () => {
    if (items.length === 0) return;

    // Structure exacte attendue par le modèle "Order" de ton amie
    const orderPayload = {
      items: items.map(item => ({
        product: item._id,            // Référence à l'_id MongoDB
        quantity: item.quantity,       // Quantité commandée
        priceAtPurchase: item.price    // Prix figé
      })),
      totalAmount: totalPrice          // Prix total
    };

    try {
      setIsSubmitting(true);
      
      // Envoi de la commande par requête HTTP POST au backend Node.js
      await api.post('/api/orders', orderPayload);
      
      // Si le serveur répond 200/201 (Succès) :
      alert("✨ Commande validée avec succès ! Vos artisans fleuristes préparent votre bouquet.");
      
      dispatch(clearCart()); // On vide le panier côté Front (Redux)
      onClose();             // Ferme le tiroir du panier
    } catch (error) {
      console.error("Erreur de validation de la commande", error);
      alert(
        "Impossible d'enregistrer la commande : " + 
        (error.response?.data?.message || "Problème de connexion avec le serveur.")
      );
    } finally {
      setIsSubmitting(false);
    }
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
                  <img src={item.imageUrl} alt={item.name} className="h-20 w-16 object-cover rounded-xl bg-stone-50 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-dark truncate">{item.name}</h3>
                    <p className="text-sm font-semibold text-sage-600 mt-0.5">
                      {(item.price * item.quantity).toLocaleString('fr-FR')} DA
                    </p>
                    
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
                disabled={isSubmitting} // 💡 Évite les doubles clics accidentels pendant l'appel réseau
                className="w-full h-12 bg-sage-600 text-white font-medium rounded-xl shadow-lg shadow-sage-600/10 hover:bg-sage-700 transition-colors active:scale-98 text-sm mt-2 flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? "Envoi de la commande..." : "Valider ma commande"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}