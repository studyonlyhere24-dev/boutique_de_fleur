import { useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, addItem, deleteItem, clearCart } from '../../store/cartSlice';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Send } from 'lucide-react';
import api from '../../api/axios'; 

export default function SidebarCart({ isOpen, onClose, onOrderSuccess }) { // 💡 Ajout de onOrderSuccess dans les props
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false); 
  
  // ─── ÉTAPE DU TUNNEL D'ACHAT ───
  const [step, setStep] = useState('cart'); 

  // ─── FORMULAIRE DE LIVRAISON AVEC ADRESSE MAIL REQUIS ───
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '', // 💡 Ajout du champ email
    address: '',
    notes: ''
  });

  // ─── LECTURE DU PANIER REDUX ───
  const items = useSelector((state) => state.cart?.items) || [];
  
  // Calculs dynamiques
  const totalArticles = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Gérer la saisie du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Réinitialiser la sidebar à sa fermeture
  const handleClose = () => {
    setStep('cart');
    setFormData({ name: '', phone: '', email: '', address: '', notes: '' });
    onClose();
  };

  // ─── ENVOI DE LA COMMANDE COMPLÈTE AU BACKEND ───
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Payload complet envoyé à ton amie côté back-end
const orderPayload = {
      items: items.map(item => {
        // Base commune (on utilise bien la clé "price" attendue par le backend)
        const baseItem = {
          quantity: item.quantity,
          price: item.price 
        };

        // Si c'est une création de l'Atelier
        if (item.isCustom) {
          return {
            ...baseItem,
            isCustom: true,
            name: item.name,
            customDetails: item.customDetails
          };
        }
        
        // Si c'est un produit standard du catalogue
        return {
          ...baseItem,
          product: item._id
        };
      }),
      // Le backend le recalcule, mais on peut le laisser à titre informatif
      totalAmount: totalPrice, 
      deliveryDetails: {
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email, 
        address: formData.address,
        notes: formData.notes
      }
    };

    try {
      setIsSubmitting(true);
      await api.post('/api/orders/create', orderPayload);
      alert("✨ Commande validée avec succès ! Vos artisans fleuristes préparent votre bouquet.");
      
      dispatch(clearCart()); 
      
      // 🔄 Déclenchement automatique de la mise à jour sur l'interface de suivi
      if (onOrderSuccess) {
        onOrderSuccess();
      }
      
      handleClose();            
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

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      
      {/* 1. ARRIÈRE-PLAN SOMBRE ET FLOUTÉ */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 cursor-pointer ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={handleClose} 
      />

      {/* 
        2. STRUCTURE DU TIROIR ROBUSTE :
        - Mobile : se colle tout en bas (bottom-0), monte sur 85% de la hauteur, coins arrondis en haut.
        - PC (md:) : se colle à droite, prend 100% de la hauteur, coins arrondis à gauche.
      */}
      <div className={`
        absolute bg-white shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-out
        
        /* 📱 Version Mobile (Tiroir du bas) */
        bottom-0 left-0 right-0 h-[85vh] w-full rounded-t-[2rem]
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        
        /* 💻 Version PC (Sidebar de droite) */
        md:top-0 md:bottom-0 md:right-0 md:left-auto md:h-full md:max-w-md md:rounded-t-none md:rounded-l-[2rem]
        md:translate-y-0
        ${isOpen ? 'md:translate-x-0' : 'md:translate-x-full'}
      `}>
        
        {/* EN-TÊTE */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            {step === 'checkout' && (
              <button 
                type="button"
                onClick={() => setStep('cart')}
                className="p-1 hover:bg-gray-100 rounded-lg text-muted mr-1 transition-colors"
                title="Retour au panier"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <ShoppingBag className="h-5 w-5 text-sage-600" />
            <h2 className="text-lg font-serif font-medium text-dark">
              {step === 'cart' ? `Mon Panier (${totalArticles})` : 'Informations de livraison'}
            </h2>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-50 rounded-full text-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ÉTAPE 1 - LE PANIER */}
        {step === 'cart' && (
          <>
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
                          type="button"
                          onClick={() => dispatch(removeItem(item._id))}
                          className="p-1 border border-gray-200 rounded-lg hover:bg-gray-50 text-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-medium w-6 text-center text-dark">{item.quantity}</span>
                        
                        <button 
                          type="button"
                          onClick={() => dispatch(addItem(item))}
                          disabled={item.quantity >= item.stock}
                          className={`p-1 border rounded-lg transition-colors ${
                            item.quantity >= item.stock 
                              ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed' 
                              : 'border-gray-200 hover:bg-gray-50 text-muted'
                          }`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => dispatch(deleteItem(item._id))}
                      className="p-2 text-gray-300 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* PIED DU PANIER */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-stone-50/50 space-y-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-light text-muted">Sous-total</span>
                  <span className="text-xl font-bold text-dark">
                    {totalPrice.toLocaleString('fr-FR')} DA
                  </span>
                </div>
                <p className="text-[11px] font-light text-muted leading-tight">
                  Coordonnées de livraison demandées à l'étape suivante. Commande préparée avec soin.
                </p>
                <button 
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="w-full h-12 bg-sage-600 text-white font-medium rounded-xl shadow-lg shadow-sage-600/10 hover:bg-sage-700 transition-colors text-sm mt-2 flex items-center justify-center"
                >
                  Valider ma commande
                </button>
              </div>
            )}
          </>
        )}

        {/* ÉTAPE 2 - FORMULAIRE DE LIVRAISON */}
        {step === 'checkout' && (
          <form onSubmit={handleSubmitOrder} className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <p className="text-xs font-light text-muted">
                Veuillez renseigner vos coordonnées pour que nos artisans puissent vous livrer.
              </p>

              {/* Champ : Nom & Prénom */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">Nom & Prénom</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Ex: Amine Brahimi"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="h-11 px-4 border border-gray-200 rounded-xl text-sm text-dark focus:outline-none focus:border-sage-500 bg-white"
                />
              </div>

              {/* Champ : Numéro de téléphone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">Téléphone de livraison</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  placeholder="Ex: 0550 12 34 56"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="h-11 px-4 border border-gray-200 rounded-xl text-sm text-dark focus:outline-none focus:border-sage-500 bg-white"
                />
              </div>

              {/* Champ : Adresse E-mail */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">Adresse e-mail</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="Ex: contact@floraconnect.dz"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-11 px-4 border border-gray-200 rounded-xl text-sm text-dark focus:outline-none focus:border-sage-500 bg-white"
                />
              </div>

              {/* Champ : Adresse complète */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">Adresse complète</label>
                <textarea 
                  name="address"
                  required
                  rows="3"
                  placeholder="Ex: 12 Rue des Roses, Hydra, Alger"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="p-4 border border-gray-200 rounded-xl text-sm text-dark focus:outline-none focus:border-sage-500 bg-white resize-none"
                />
              </div>

              {/* Champ : Note / Instructions */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">Notes pour le livreur (Optionnel)</label>
                <textarea 
                  name="notes"
                  rows="2"
                  placeholder="Ex: Sonner chez la voisine si absent..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="p-4 border border-gray-200 rounded-xl text-sm text-dark focus:outline-none focus:border-sage-500 bg-white resize-none"
                />
              </div>
            </div>

            {/* ENVOI FINAL */}
            <div className="p-6 border-t border-gray-100 bg-stone-50/50 space-y-4 flex-shrink-0">
              <div className="flex items-center justify-between text-sm">
                <span className="font-light text-muted">Total à régler à la livraison</span>
                <span className="font-bold text-lg text-sage-700">{totalPrice.toLocaleString('fr-FR')} DA</span>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-sage-600 hover:bg-sage-700 text-white font-medium rounded-xl shadow-lg shadow-sage-600/10 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isSubmitting ? "Validation en cours..." : (
                  <>
                    <Send className="h-4 w-4" /> Confirmer la commande
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}