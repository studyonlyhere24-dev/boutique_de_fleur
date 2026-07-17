import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'; 
import api from './api/axios';

import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Catalog from './features/catalog/Catalog';
import CareGuide from './features/guide/CareGuide'; 
import SidebarCart from './features/cart/SidebarCart';
import StickyCartBanner from './features/cart/StickyCartBanner';
import Login from './features/auth/Login';
import AdminDashboard from './features/admin/AdminDashboard';
import ClientOrders from './orders/ClientOrders'; 

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  // FIX: On force 'catalog' au démarrage pour afficher la boutique immédiatement
  const [currentPage, setCurrentPage] = useState('catalog'); 
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
  const [refreshOrdersTrigger, setRefreshOrdersTrigger] = useState(0);

  const triggerOrdersRefresh = () => {
    setRefreshOrdersTrigger(prev => prev + 1);
  };

  const handleCatalogAddProduct = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsCartOpen(false);
    } else {
      setIsCartOpen(true);
    }
  };

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
      <div className="min-h-screen bg-powder-50 text-dark antialiased relative flex flex-col">
        
        {/* FIX CONTEXTE: Passage obligatoire de currentPage et onNavigate */}
        <Navbar 
          onOpenCart={() => setIsCartOpen(true)} 
          userRole={userRole}
          onLogout={handleLogout}
          onNavigate={(page) => setCurrentPage(page)}
          currentPage={currentPage}
        />

        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          
          {currentPage === 'catalog' && (
            <Catalog onOpenCart={handleCatalogAddProduct} onNavigate={(page) => setCurrentPage(page)} /> 
          )}
          
          {currentPage === 'care-guide' && (
            <CareGuide onNavigate={(page) => setCurrentPage(page)} />
          )}

          {currentPage === 'login' && (
            <Login onLoginSuccess={handleLoginSuccess} />
          )}

          {currentPage === 'admin-dashboard' && isAdmin && (
            <AdminDashboard />
          )}

          {currentPage === 'my-orders' && userRole && !isAdmin && (
            <ClientOrders refreshTrigger={refreshOrdersTrigger} />
          )}
        </main>

        <Footer />

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