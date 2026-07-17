import { useState, useEffect } from 'react';
import { ShoppingBag, Clock, Truck, CheckCircle2, XCircle, Calendar, CreditCard, ChevronDown, ChevronUp, MapPin, FileText } from 'lucide-react';
import api from '../api/axios';

export default function ClientOrders({ refreshTrigger }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null); // Pour afficher le détail d'une commande

  // ─── CHARGEMENT DES COMMANDES DU CLIENT CONNECTÉ ───
  useEffect(() => {
    const fetchClientOrders = async () => {
      try {
        setIsLoading(true);
        // 💡 Changement ici : On utilise la route exacte définie dans ton back-end !
        const response = await api.get('/api/orders/mine'); 
        
        const dataOrders = Array.isArray(response.data) 
          ? response.data 
          : response.data.orders || [];
          
        // Trier du plus récent au plus ancien
        setOrders(dataOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error("Erreur lors de la récupération de vos commandes", err);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientOrders();
  }, [refreshTrigger]); // Se recharge automatiquement quand refreshTrigger change !

  // Formatage de la date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Basculer l'affichage des détails
  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Statuts stylisés (Identiques à l'admin pour la cohérence)
  const getStatusHelper = (status) => {
    const helpers = {
      pending: {
        label: "En attente de validation",
        style: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <Clock className="h-4 w-4 text-amber-600" />
      },
      confirmed: {
        label: "En cours de préparation",
        style: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <CheckCircle2 className="h-4 w-4 text-blue-600" />
      },
      shipped: {
        label: "Commande expédiée",
        style: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <Truck className="h-4 w-4 text-emerald-600" />
      },
      cancelled: {
        label: "Commande annulée",
        style: "bg-rose-50 text-rose-700 border-rose-200",
        icon: <XCircle className="h-4 w-4 text-rose-600" />
      }
    };
    return helpers[status] || { label: "Statut inconnu", style: "bg-gray-50 text-gray-700 border-gray-200", icon: null };
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 sm:p-8 pt-24">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* EN-TÊTE DE LA PAGE */}
        <div className="border-b border-gray-200 pb-5">
          <h1 className="font-serif text-3xl font-medium text-dark">Suivi de mes commandes</h1>
          <p className="text-xs font-light text-muted mt-1">Consultez l'historique et l'état de livraison de vos bouquets</p>
        </div>

        {/* CONDITION : AUCUNE COMMANDE */}
        {orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-4 shadow-sm">
            <div className="mx-auto w-12 h-12 bg-sage-50 rounded-full flex items-center justify-center text-sage-600">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-medium text-dark">Aucune commande pour le moment</h3>
              <p className="text-sm text-muted">Dès que vous validerez votre panier, votre commande s'affichera ici.</p>
            </div>
          </div>
        ) : (
          /* LISTE DES COMMANDES ACCORDÉON */
          <div className="space-y-4">
            {orders.map((order) => {
              const { label, style, icon } = getStatusHelper(order.status);
              const isExpanded = expandedOrder === order._id;
              const details = order.deliveryDetails || {};

              return (
                <div 
                  key={order._id} 
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all hover:border-gray-200"
                >
                  {/* Ligne principale cliquable */}
                  <div 
                    onClick={() => toggleExpand(order._id)}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-gray-400">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border ${style}`}>
                          {icon}
                          {label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted font-light">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(order.createdAt)}</span>
                        <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" /> {order.items?.length || 0} {(order.items?.length || 0) > 1 ? 'articles' : 'article'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="sm:text-right">
                        <span className="text-[10px] uppercase tracking-wider text-muted block">Montant Total</span>
                        <span className="text-lg font-bold text-sage-700">{order.totalAmount ? order.totalAmount.toLocaleString('fr-FR') : 0} DA</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-stone-50 text-gray-400">
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Section détails (déroulable) */}
                  {isExpanded && (
                    <div className="border-t border-gray-50 bg-stone-50/20 px-5 py-6 sm:px-6 space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* A. GAUCHE : DÉTAILS DE LIVRAISON */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-dark uppercase tracking-wider">Informations de livraison</h4>
                          <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2.5 text-sm">
                            <div className="font-medium text-dark">{details.customerName || "Nom non spécifié"}</div>
                            
                            {details.address ? (
                              <div className="flex items-start gap-2 text-xs text-muted leading-relaxed">
                                <MapPin className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                                <span>{details.address}</span>
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 italic">Aucune adresse de livraison enregistrée</div>
                            )}

                            {details.notes && (
                              <div className="mt-2 p-3 bg-amber-50/70 border border-amber-100 rounded-lg flex gap-2 items-start">
                                <FileText className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-amber-800 font-light leading-snug">
                                  <span className="font-semibold block mb-0.5">Note de livraison :</span>
                                  {details.notes}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* B. DROITE : COMPOSITION DU PANIER */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-dark uppercase tracking-wider">Détail de la composition</h4>
                          <div className="divide-y divide-gray-100 bg-white border border-gray-100 rounded-xl px-4 py-1">
                            {order.items?.map((item, idx) => (
                              <div key={item._id || idx} className="py-3 flex items-center justify-between text-sm gap-4">
                                <div className="space-y-0.5">
                                  <p className="font-medium text-dark">{item.name}</p>
                                  <p className="text-xs text-muted font-light">Quantité : {item.quantity}</p>
                                </div>
                                <span className="font-semibold text-dark">
                                  {((item.priceAtPurchase || 0) * (item.quantity || 1)).toLocaleString('fr-FR')} DA
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Résumé rapide */}
                      <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-semibold">
                        <span className="text-dark">Total payé</span>
                        <span className="text-base text-sage-700 font-bold">{order.totalAmount ? order.totalAmount.toLocaleString('fr-FR') : 0} DA</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}