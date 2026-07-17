import { useState, useEffect } from 'react'; 
import { 
  Package, ShoppingCart, AlertTriangle, CheckCircle2, Truck, 
  XCircle, Clock, Phone, Mail, MapPin, FileText, 
  Plus, Edit, Trash2, X, Save, Upload 
} from 'lucide-react';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' ou 'products'
  const [isLoading, setIsLoading] = useState(true);

  // ─── ÉTATS POUR LA MODALE PRODUIT (AJOUT / MODIFICATION) ───
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = mode Ajout, sinon contient le produit à modifier
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    imageUrl: '', // Conservé pour la modification si aucune nouvelle image n'est choisie
    description: ''
  });
  
  // Nouveaux états pour le fichier physique et sa prévisualisation
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

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

  // Modification rapide du stock en direct
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

  // ─── GESTION DES FICHIERS IMAGES ───
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Générer une URL locale temporaire pour la prévisualisation
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ─── OUVRIR LA MODALE (AJOUT OU MODIFICATION) ───
  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name || '',
        category: product.category || '',
        price: product.price || '',
        stock: product.stock || '',
        imageUrl: product.imageUrl || '',
        description: product.description || ''
      });
      setImagePreview(product.imageUrl || '');
      setImageFile(null); // Pas encore de nouveau fichier sélectionné
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        category: '',
        price: '',
        stock: '',
        imageUrl: '',
        description: ''
      });
      setImagePreview('');
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  // ─── ACTION : ENREGISTRER LE PRODUIT (CREATION OU EDITION VIA FORMDATA) ───
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      // Utilisation de FormData pour empaqueter fichiers et textes
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('category', productForm.category);
      formData.append('price', parseFloat(productForm.price));
      formData.append('stock', parseInt(productForm.stock));
      formData.append('description', productForm.description);

      // Correction ici : la clé s'appelle 'imageUrl' pour correspondre à upload.single('imageUrl') du backend
      if (imageFile) {
        formData.append('imageUrl', imageFile); 
      } else if (editingProduct) {
        // Si pas de nouvelle image, on renvoie l'ancienne URL sous la même clé
        formData.append('imageUrl', productForm.imageUrl);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editingProduct) {
        // Utilisation de PATCH ici pour correspondre à router.patch('/:id') du backend
        const res = await api.patch(`/api/products/${editingProduct._id}`, formData, config);
        const updatedProduct = res.data.product || res.data;
        
        setProducts(products.map(p => p._id === editingProduct._id ? { ...p, ...updatedProduct } : p));
        alert("✨ Produit mis à jour avec succès !");
      } else {
        // Création d'un nouveau produit avec FormData
        const res = await api.post('/api/products/create', formData, config);
        const newProduct = res.data.product || res.data;

        setProducts([newProduct, ...products]);
        alert("🌸 Nouveau produit ajouté au catalogue !");
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Erreur lors de la sauvegarde : " + (err.response?.data?.message || err.message));
    }
  };

  // ─── ACTION : SUPPRIMER DÉFINITIVEMENT UN PRODUIT ───
  const handleDeleteProduct = async (productId, productName) => {
    const isConfirmed = window.confirm(`⚠️ Êtes-vous sûr de vouloir supprimer définitivement "${productName}" du catalogue ? Cette action est irréversible.`);
    if (!isConfirmed) return;

    try {
      await api.delete(`/api/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
      alert("🗑️ Produit supprimé du catalogue.");
    } catch (err) {
      alert("Erreur lors de la suppression : " + (err.response?.data?.message || err.message));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Utilitaires de style pour les status de commande
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
            <p className="text-xs font-light text-muted mt-1">Gestion de la plateforme MaisonFlorale</p>
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
                        
                        {/* ID COMMANDE / DATE */}
                        <td className="py-4 px-6">
                          <span className="font-mono text-xs text-gray-400 block truncate w-24">#{order._id}</span>
                          <span className="text-xs font-light text-muted block mt-1">{formatDate(order.createdAt)}</span>
                        </td>

                        {/* CLIENT / DESTINATAIRE */}
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

                        {/* ADRESSE DE LIVRAISON */}
                        <td className="py-4 px-6 space-y-2 max-w-[250px]">
                          {details.address ? (
                            <div className="flex items-start gap-1.5 text-xs text-dark/90 leading-relaxed">
                              <MapPin className="h-3.5 w-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                              <span>{details.address}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Aucune adresse fournie</span>
                          )}

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

                        {/* DETAILS DU PANIER */}
                        <td className="py-4 px-6">
                          <span className="block text-xs font-light">
                            {order.items?.length || 0} {(order.items?.length || 0) > 1 ? 'bouquets' : 'bouquet'}
                          </span>
                          <span className="block font-semibold text-sage-600 mt-1">
                            {order.totalAmount ? order.totalAmount.toLocaleString('fr-FR') : 0} DA
                          </span>
                        </td>

                        {/* BADGE DE STATUT */}
                        <td className="py-4 px-6">{getStatusBadge(order.status)}</td>

                        {/* ACTIONS ADMINISTRATEUR */}
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

        {/* CONTENU 2 : GESTION DU CATALOGUE (PRODUITS) */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            {/* BOUTON RAJOUT DE PRODUIT */}
            <div className="flex justify-end">
              <button
                onClick={() => openProductModal(null)}
                className="h-10 px-4 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-all shadow-md shadow-sage-600/10"
              >
                <Plus className="h-4 w-4" /> Ajouter un produit
              </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-stone-50/30">
                <h2 className="text-sm font-semibold text-dark uppercase tracking-wider">Niveaux des stocks & Fiches produits</h2>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => {
                  const isRupture = product.stock === 0;
                  return (
                    <div key={product._id} className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${isRupture ? 'border-rose-200 bg-rose-50/20' : 'border-gray-100 bg-white'}`}>
                      
                      {/* INFORMATIONS GAUCHE */}
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="h-14 w-12 object-cover rounded-lg bg-stone-100 border border-gray-100 flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <h3 className="font-medium text-sm text-dark truncate max-w-[180px]" title={product.name}>
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted bg-stone-100 px-1.5 py-0.5 rounded">{product.category}</span>
                            <span className="text-xs font-semibold text-sage-600">{product.price.toLocaleString('fr-FR')} DA</span>
                          </div>
                          
                          {isRupture ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 font-medium bg-rose-50 px-1.5 py-0.5 rounded mt-1">
                              <AlertTriangle className="h-3 w-3" /> Rupture de stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded mt-1">
                              <CheckCircle2 className="h-3 w-3" /> Disponible
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ACTIONS & STOCKS DROITE */}
                      <div className="flex items-center gap-4">
                        
                        {/* Champ Stock Rapide */}
                        <div className="flex flex-col items-end gap-1">
                          <label className="text-[9px] font-semibold text-muted uppercase tracking-wider">Stock</label>
                          <input 
                            type="number" 
                            min="0"
                            value={product.stock}
                            onChange={(e) => handleStockChange(product._id, e.target.value)}
                            className={`h-8 w-16 border rounded-lg text-center text-xs font-bold focus:outline-none ${isRupture ? 'border-rose-300 focus:border-rose-500 bg-white text-rose-600' : 'border-gray-200 focus:border-sage-500 text-dark'}`}
                          />
                        </div>

                        {/* Boutons actions d'édition complète ou de suppression */}
                        <div className="flex flex-col gap-1 border-l pl-3 border-gray-100">
                          <button
                            onClick={() => openProductModal(product)}
                            title="Modifier la fiche complète"
                            className="p-1.5 hover:bg-stone-100 rounded-md text-muted hover:text-sage-600 transition-all"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            title="Supprimer définitivement"
                            className="p-1.5 hover:bg-rose-50 rounded-md text-gray-300 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ─── MODALE D'AJOUT & DE MODIFICATION COMPLÈTE DU PRODUIT ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          {/* Fenêtre Modale */}
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            
            {/* Header Modale */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-stone-50/50">
              <h2 className="font-serif text-lg font-semibold text-dark">
                {editingProduct ? `Modifier "${editingProduct.name}"` : 'Créer un nouveau produit'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-muted" />
              </button>
            </div>

            {/* Formulaire interne */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* Nom du produit */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-muted uppercase tracking-wider">Nom du bouquet</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Pastel Romance"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sage-500 bg-white text-dark"
                />
              </div>

              {/* Grid : Categorie & Prix */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-muted uppercase tracking-wider">Catégorie</label>
                  <select 
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sage-500 bg-white text-dark"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Bouquets">Bouquets</option>
                    <option value="Mariage">Mariage</option>
                    <option value="Plantes">Plantes</option>
                    <option value="Saison">Saison</option>
                    <option value="Romantique">Romantique</option>
                    <option value="Plantes d'intérieur">Plantes d'intérieur</option>
                    <option value="Événements">Événements</option>
                    <option value="Roses">Roses</option>
                    <option value="Champêtre">Champêtre</option>
                    <option value="Lys">Lys</option>
                    
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-muted uppercase tracking-wider">Prix (DA)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    placeholder="Ex: 4500"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sage-500 bg-white text-dark"
                  />
                </div>
              </div>

              {/* Grid : Stock & Importation de Fichier Image */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-muted uppercase tracking-wider">Stock initial</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    placeholder="10"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sage-500 bg-white text-dark"
                  />
                </div>

                {/* ZONE DE TÉLÉCHARGEMENT D'IMAGE PHYSIQUE */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-muted uppercase tracking-wider">Image du bouquet (.jpg, .png)</label>
                  <div className="flex items-center gap-3">
                    
                    {/* Input file masqué et stylisé */}
                    <label className="flex-1 flex flex-col items-center justify-center h-20 border-2 border-dashed border-rose-100 hover:border-rose-300 bg-rose-50/20 hover:bg-rose-50/50 rounded-xl cursor-pointer transition-all p-2 text-center group">
                      <input 
                        type="file" 
                        accept="image/jpeg, image/jpg, image/png"
                        onChange={handleFileChange}
                        className="hidden"
                        required={!editingProduct} 
                      />
                      <Upload className="h-4 w-4 text-rose-400 group-hover:text-rose-500 mb-1 transition-transform group-hover:-translate-y-0.5" />
                      <span className="text-[10px] text-muted font-medium block truncate max-w-[150px]">
                        {imageFile ? imageFile.name : "Importer un fichier"}
                      </span>
                    </label>

                    {/* Prévisualisation */}
                    {imagePreview && (
                      <div className="h-20 w-16 rounded-xl border border-rose-100 overflow-hidden relative shrink-0 bg-stone-50">
                        <img 
                          src={imagePreview} 
                          alt="Prévisualisation" 
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                          className="absolute top-1 right-1 h-4 w-4 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              </div>

              {/* Description du produit */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-muted uppercase tracking-wider">Description (Détails du bouquet)</label>
                <textarea 
                  rows="3"
                  required
                  placeholder="Ex: Assemblage de pivoines blanches, de roses branchues pêche, d'eucalyptus..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sage-500 bg-white text-dark resize-none"
                />
              </div>

              {/* Boutons Actions dans la modale */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 border border-gray-200 rounded-xl text-xs font-medium text-muted hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-md shadow-sage-600/10 transition-colors"
                >
                  <Save className="h-4 w-4" /> Sauvegarder
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}