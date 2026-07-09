import React, { useState } from 'react';
import { Package, ShoppingCart, RefreshCw, AlertTriangle, CheckCircle2, Truck, XCircle, Clock } from 'lucide-react';

// 💡 MOCK DES COMMANDES (Basé exactement sur le modèle Order de ton amie)
const MOCK_ORDERS = [
  {
    _id: "65f1a2b3c4d5e6f7a8b90123",
    clientName: "Sofiane Benz", // Jointure simulée avec le modèle Client
    totalAmount: 12500,
    status: "pending", // 'pending', 'confirmed', 'shipped', 'cancelled'
    createdAt: "2026-07-09T14:30:00.000Z", // Format ISO 8601 demandé
    itemsCount: 3
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b90124",
    clientName: "Amel Rahmani",
    totalAmount: 4500,
    status: "confirmed",
    createdAt: "2026-07-08T09:15:00.000Z",
    itemsCount: 1
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b90125",
    clientName: "Yanis Merad",
    totalAmount: 8200,
    status: "shipped",
    createdAt: "2026-07-07T18:00:00.000Z",
    itemsCount: 2
  }
];

// 💡 MOCK DES PRODUITS (Basé exactement sur le modèle Product)
const MOCK_PRODUCTS = [
  { _id: "1", name: "Bouquet Pastel Élégant", price: 4500, category: "Roses", stock: 5 },
  { _id: "2", name: "Éclat de Tournesols", price: 3800, category: "Champêtre", stock: 0 }, // Rupture !
  { _id: "3", name: "Majestueux Lys Blancs", price: 6200, category: "Lys", stock: 12 },
  { _id: "4", name: "Harmonie de Tulipes", price: 3200, category: "Saison", stock: 2 }
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' ou 'products'

  // 💡 Point technique 1 : Formatage des dates ISO 8601 en français
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Modification du statut d'une commande (Enregistrement en BDD via API plus tard)
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order._id === orderId ? { ...order, status: newStatus } : order
    ));
    console.log(`API PUT /api/orders/${orderId} -> status: ${newStatus}`);
  };

  // Modification du stock d'un produit
  const handleStockChange = (productId, newStock) => {
    const value = Math.max(0, parseInt(newStock) || 0); // Contrainte : minimum 0
    setProducts(products.map(prod => 
      prod._id === productId ? { ...prod, stock: value } : prod
    ));
    console.log(`API PUT /api/products/${productId} -> stock: ${value}`);
  };

  // Utilitaires de style pour les status (Enum)
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
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/50 text-[11px] font-semibold text-muted uppercase tracking-wider border-b border-gray-100">
                    <th className="py-3 px-6">ID Commande / Date</th>
                    <th className="py-3 px-6">Client</th>
                    <th className="py-3 px-6">Articles / Total</th>
                    <th className="py-3 px-6">Statut actuel</th>
                    <th className="py-3 px-6 text-right">Actions de traitement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-dark">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-stone-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs text-gray-400 block truncate w-24">#{order._id}</span>
                        <span className="text-xs font-light text-muted block mt-0.5">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="py-4 px-6 font-medium">{order.clientName}</td>
                      <td className="py-4 px-6">
                        <span className="block text-xs font-light">{order.itemsCount} {order.itemsCount > 1 ? 'bouquets' : 'bouquet'}</span>
                        <span className="block font-semibold text-sage-600 mt-0.5">{order.totalAmount.toLocaleString('fr-FR')} DA</span>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(order.status)}</td>
                      <td className="py-4 px-6 text-right">
                        {/* Sélecteur d'action rapide pour l'admin */}
                        <div className="inline-flex gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                          <button onClick={() => handleStatusChange(order._id, 'confirmed')} title="Confirmer / Préparer" className={`p-1.5 rounded-md transition-colors ${order.status === 'confirmed' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-200'}`}><Clock className="h-3.5 w-3.5" /></button>
                          <button onClick={() => handleStatusChange(order._id, 'shipped')} title="Expédier au livreur" className={`p-1.5 rounded-md transition-colors ${order.status === 'shipped' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:bg-gray-200'}`}><Truck className="h-3.5 w-3.5" /></button>
                          <button onClick={() => handleStatusChange(order._id, 'cancelled')} title="Annuler la commande" className={`p-1.5 rounded-md transition-colors ${order.status === 'cancelled' ? 'bg-rose-500 text-white' : 'text-gray-400 hover:bg-gray-200'}`}><XCircle className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                      
                      {/* Alerte visuelle pour l'admin */}
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

                    {/* Ajustement de la quantité numérique par l'admin */}
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