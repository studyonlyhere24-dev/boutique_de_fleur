import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'; 
import api from './api/axios';

import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Importation déjà présente
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
      setIsCartOpen(false);
    } else {
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
      {/* 1. ON ACTIVE LE FLEXBOX ICI : "flex flex-col min-h-screen" */}
      <div className="min-h-screen bg-white text-dark antialiased relative flex flex-col">
        
        <Navbar 
          onOpenCart={() => setIsCartOpen(true)} 
          userRole={userRole}
          onLogout={handleLogout}
          onNavigate={(page) => setCurrentPage(page)}
        />

        {/* 2. ON RAJOUTE "flex-grow" ICI : Le contenu principal va pousser le footer vers le bas */}
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          {currentPage === 'catalog' && (
            <Catalog onOpenCart={handleCatalogAddProduct} /> 
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

        {/* 3. LE FOOTER EST PLACÉ ICI, À LA RACINE DU LAYOUT */}
        <Footer />

        {/* Panier & Bannière collante (Masqués pour l'admin) */}
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