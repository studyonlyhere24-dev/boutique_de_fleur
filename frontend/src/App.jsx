import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'; 
import api from './api/axios';

import Navbar from './components/Navbar';
import Catalog from './features/catalog/Catalog';
import SidebarCart from './features/cart/SidebarCart';
import StickyCartBanner from './features/cart/StickyCartBanner';
import Login from './features/auth/Login';
import AdminDashboard from './features/admin/AdminDashboard';
import ClientOrders from './orders/ClientOrders'; 

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState('catalog'); 
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 

  // 🔄 ÉTAT DE RAFRAÎCHISSEMENT DE LA LISTE DES COMMANDES
  const [refreshOrdersTrigger, setRefreshOrdersTrigger] = useState(0);

  const triggerOrdersRefresh = () => {
    setRefreshOrdersTrigger(prev => prev + 1);
  };

  // ─── GESTION DU CATALOGUE (SÉLECTION D'UN BOUQUET) ───
  const handleCatalogAddProduct = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Sur mobile, quand on ajoute un bouquet, on n'ouvre pas le grand tiroir.
      // On laisse juste la bannière verte (StickyCartBanner) s'actualiser en bas.
      setIsCartOpen(false);
    } else {
      // Sur PC, on ouvre directement la Sidebar à droite
      setIsCartOpen(true);
    }
  };

  // ─── VÉRIFICATION DE LA SESSION AU CHARGEMENT (F5) ───
  useEffect(() => {
    const verifierSession = async () => {
      try {
        const response = await api.get('/api/auth/checkauth');
        const role = response.data.role || 'client';
        setUserRole(role);
        
        if (role === 'admin') {
          setCurrentPage('admin-dashboard');
        }
      } catch (error) {
        console.warn("Session non active ou expirée :", error.message);
        setUserRole(null); 
      } finally {
        setIsCheckingAuth(false); 
      }
    };

    verifierSession();
  }, []);

  const handleLoginSuccess = (role) => {
    setUserRole(role); 
    if (role === 'admin') {
      setCurrentPage('admin-dashboard'); 
    } else {
      setCurrentPage('catalog'); 
    }
  };

  // ─── DÉCONNEXION ───
  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      setUserRole(null);
      setCurrentPage('catalog');
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-stone-50/50">
        <div className="h-8 w-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-light text-muted font-serif">Vérification de l'accès...</p>
      </div>
    );
  }

  const isAdmin = userRole === 'admin';

  return (
    <BrowserRouter> 
      <div className="min-h-screen bg-white text-dark antialiased relative">
        
        <Navbar 
          onOpenCart={() => setIsCartOpen(true)} // 💡 Toujours ouvrir le panier quand on clique sur la Navbar
          userRole={userRole}
          onLogout={handleLogout}
          onNavigate={(page) => setCurrentPage(page)}
        />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {currentPage === 'catalog' && (
            <Catalog onOpenCart={handleCatalogAddProduct} /> // 💡 N'ouvre le tiroir que sur PC lors d'un ajout
          )}
          
          {currentPage === 'login' && (
            <Login onLoginSuccess={handleLoginSuccess} />
          )}

          {currentPage === 'admin-dashboard' && isAdmin && (
            <AdminDashboard />
          )}

          {/* Suivi des commandes */}
          {currentPage === 'my-orders' && userRole && !isAdmin && (
            <ClientOrders refreshTrigger={refreshOrdersTrigger} />
          )}
        </main>

        {/* Panier & Bannière collante */}
        {!isAdmin && (
          <>
            <SidebarCart 
              isOpen={isCartOpen} 
              onClose={() => setIsCartOpen(false)} 
              onOrderSuccess={triggerOrdersRefresh} 
            />
            <StickyCartBanner onOpenCart={() => setIsCartOpen(true)} />
          </>
        )}
        
      </div>
    </BrowserRouter>
  );
}