import { useState, useEffect } from 'react'; 
import { Package, ShoppingCart, AlertTriangle, CheckCircle2, Truck, XCircle, Clock, Phone, Mail, MapPin, FileText } from 'lucide-react';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' ou 'products'
  const [isLoading, setIsLoading] = useState(true);

  // ─── API : CHARGEMENT INITIAL DES DONNÉES DU BACKEND ───
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setIsLoading(true); 
        const [ordersRes, productsRes] = await Promise.all([
          api.get('/api/orders/all'),
          api.get('/api/products/all') 
        ]);
        
        const dataOrders = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.orders || [];
        const dataProducts = Array.isArray(productsRes.data) ? productsRes.data : productsRes.data.products || [];

        setOrders(dataOrders);
        setProducts(dataProducts);
      } catch (err) {
        console.error("Erreur lors du chargement des données de l'API", err);
        setOrders([]);
        setProducts([]);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchAdminData();
  }, []);

  // Formatage des dates ISO 8601 en français
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Modification du statut d'une commande
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert("Impossible de modifier le statut : " + (err.response?.data?.message || err.message));
    }
  };

  // Modification du stock d'un produit
  const handleStockChange = async (productId, newStock) => {
    const value = Math.max(0, parseInt(newStock) || 0);
    try {
      await api.patch(`/api/products/${productId}`, { stock: value });
      setProducts(products.map(prod => 
        prod._id === productId ? { ...prod, stock: value } : prod
      ));
    } catch (err) {
      console.error("Erreur de mise à jour du stock", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Utilitaires de style pour les status
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      shipped: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-rose-50 text-rose-700 border-rose-200"
    };
    const labels = { pending: "En attente", confirmed: "Préparé", shipped: "Expédié", cancelled: "Annulé" };
    return <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="min-h-screen bg-stone-50/50 p-4 sm:p-8 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* EN-TÊTE DASHBOARD */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
          <div>
            <h1 className="font-serif text-3xl font-medium text-dark">Console Super-Admin</h1>
            <p className="text-xs font-light text-muted mt-1">Gestion de la plateforme FloraConnect</p>
          </div>
          
          {/* Onglets de navigation */}
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`h-9 px-4 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${activeTab === 'orders' ? 'bg-white shadow-sm text-sage-700 font-semibold' : 'text-muted hover:text-dark'}`}
            >
              <ShoppingCart className="h-3.5 w-3.5" /> Commandes
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`h-9 px-4 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${activeTab === 'products' ? 'bg-white shadow-sm text-sage-700 font-semibold' : 'text-muted hover:text-dark'}`}
            >
              <Package className="h-3.5 w-3.5" /> Catalogue & Stocks
            </button>
          </div>
        </div>

        {/* CONTENU 1 : LISTE DES COMMANDES */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-stone-50/30">
              <h2 className="text-sm font-semibold text-dark uppercase tracking-wider">Flux des commandes clients</h2>
            </div>
            
            <div className="divide-y divide-gray-100 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-stone-50/50 text-[11px] font-semibold text-muted uppercase tracking-wider border-b border-gray-100">
                    <th className="py-3 px-6">ID / Date</th>
                    <th className="py-3 px-6">Destinataire & Contact</th>
                    <th className="py-3 px-6">Adresse de livraison</th>
                    <th className="py-3 px-6">Articles / Total</th>
                    <th className="py-3 px-6">Statut</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-dark">
                  {orders.map((order) => {
                    const details = order.deliveryDetails || {};
                    return (
                      <tr key={order._id} className="hover:bg-stone-50/30 transition-colors align-top">
                        
                        {/* 1. ID COMMANDE / DATE */}
                        <td className="py-4 px-6">
                          <span className="font-mono text-xs text-gray-400 block truncate w-24">#{order._id}</span>
                          <span className="text-xs font-light text-muted block mt-1">{formatDate(order.createdAt)}</span>
                        </td>

                        {/* 2. CLIENT / DESTINATAIRE (Avec Email & Téléphone) */}
                        <td className="py-4 px-6 space-y-1.5">
                          <div className="font-medium text-dark">
                            {details.customerName || order.client?.name || "Client Inconnu"}
                          </div>
                          {details.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-muted">
                              <Phone className="h-3 w-3 text-sage-600 flex-shrink-0" />
                              <span>{details.phone}</span>
                            </div>
                          )}
                          {details.email && (
                            <div className="flex items-center gap-1.5 text-xs text-muted truncate max-w-[180px]" title={details.email}>
                              <Mail className="h-3 w-3 text-sage-600 flex-shrink-0" />
                              <span>{details.email}</span>
                            </div>
                          )}
                        </td>

                        {/* 3. ADRESSE DE LIVRAISON & NOTES */}
                        <td className="py-4 px-6 space-y-2 max-w-[250px]">
                          {details.address ? (
                            <div className="flex items-start gap-1.5 text-xs text-dark/90 leading-relaxed">
                              <MapPin className="h-3.5 w-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                              <span>{details.address}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Aucune adresse fournie</span>
                          )}

                          {/* Affichage de la note s'il y en a une */}
                          {details.notes && (
                            <div className="p-2 bg-amber-50/70 border border-amber-100 rounded-lg flex gap-1.5 items-start">
                              <FileText className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div className="text-[11px] text-amber-800 font-light leading-snug">
                                <span className="font-semibold block">Note client :</span>
                                {details.notes}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* 4. DETAILS DU PANIER */}
                        <td className="py-4 px-6">
                          <span className="block text-xs font-light">
                            {order.items?.length || 0} {(order.items?.length || 0) > 1 ? 'bouquets' : 'bouquet'}
                          </span>
                          <span className="block font-semibold text-sage-600 mt-1">
                            {order.totalAmount ? order.totalAmount.toLocaleString('fr-FR') : 0} DA
                          </span>
                        </td>

                        {/* 5. BADGE DE STATUT */}
                        <td className="py-4 px-6">{getStatusBadge(order.status)}</td>

                        {/* 6. ACTIONS ADMINISTRATEUR */}
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                            <button 
                              onClick={() => handleStatusChange(order._id, 'confirmed')} 
                              title="Confirmer / Préparer" 
                              className={`p-1.5 rounded-md transition-colors ${order.status === 'confirmed' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-200'}`}
                            >
                              <Clock className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => handleStatusChange(order._id, 'shipped')} 
                              title="Expédier au livreur" 
                              className={`p-1.5 rounded-md transition-colors ${order.status === 'shipped' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:bg-gray-200'}`}
                            >
                              <Truck className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => handleStatusChange(order._id, 'cancelled')} 
                              title="Annuler la commande" 
                              className={`p-1.5 rounded-md transition-colors ${order.status === 'cancelled' ? 'bg-rose-500 text-white' : 'text-gray-400 hover:bg-gray-200'}`}
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTENU 2 : GESTION DES STOCKS */}
        {activeTab === 'products' && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-stone-50/30">
              <h2 className="text-sm font-semibold text-dark uppercase tracking-wider">Niveaux des stocks du catalogue</h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => {
                const isRupture = product.stock === 0;
                return (
                  <div key={product._id} className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${isRupture ? 'border-rose-200 bg-rose-50/20' : 'border-gray-100 bg-white'}`}>
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm text-dark">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted">{product.category}</span>
                        <span className="text-xs font-semibold text-sage-600">{product.price.toLocaleString('fr-FR')} DA</span>
                      </div>
                      
                      {isRupture ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 font-medium bg-rose-50 px-1.5 py-0.5 rounded">
                          <AlertTriangle className="h-3 w-3" /> Rupture de stock (Bloqué au Front)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="h-3 w-3" /> Disponible
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <label className="text-[10px] font-semibold text-muted uppercase tracking-wider">Quantité en BDD</label>
                      <input 
                        type="number" 
                        min="0"
                        value={product.stock}
                        onChange={(e) => handleStockChange(product._id, e.target.value)}
                        className={`h-9 w-20 border rounded-lg text-center text-sm font-bold focus:outline-none ${isRupture ? 'border-rose-300 focus:border-rose-500 bg-white text-rose-600' : 'border-gray-200 focus:border-sage-500 text-dark'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}