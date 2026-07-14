import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'; 
import api from './api/axios';

import Navbar from './components/Navbar';
import Catalog from './features/catalog/Catalog';
import SidebarCart from './features/cart/SidebarCart';
import StickyCartBanner from './features/cart/StickyCartBanner';
import Login from './features/auth/Login';
import AdminDashboard from './features/admin/AdminDashboard';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState('catalog'); 
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 

  // ─── VÉRIFICATION DE LA SESSION AU CHARGEMENT (F5) ───
  useEffect(() => {
    const verifierSession = async () => {
      try {
        const response = await api.get('/api/auth/checkauth');
        
        // On récupère le rôle renvoyé par ton back-end (ajuste "response.data.role" selon la structure exacte de ton API)
        const role = response.data.role || 'client';
        setUserRole(role);
        
        // Optionnel : Si c'est un admin, on le remet direct sur son dashboard après un F5
        if (role === 'admin') {
          setCurrentPage('admin-dashboard');
        }
      } catch (error) {
        // Le token est absent, expiré ou invalide
        setUserRole(null); 
      } finally {
        setIsCheckingAuth(false); // La vérification est terminée, on peut afficher l'app
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

  // ─── DÉCONNEXION (AVEC DESTRUCTION DU COOKIE) ───
  const handleLogout = async () => {
    try {
      // 👈 On dit au back-end de détruire le cookie httpOnly (route définie dans authRoutes.js)
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      // Même en cas d'erreur réseau, on déconnecte visuellement l'utilisateur
      setUserRole(null);
      setCurrentPage('catalog');
    }
  };

  // ─── ÉCRAN DE CHARGEMENT PENDANT LA VÉRIFICATION ───
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-stone-50/50">
        <div className="h-8 w-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-light text-muted font-serif">Vérification de l'accès...</p>
      </div>
    );
  }

  return (
    <BrowserRouter> 
      <div className="min-h-screen bg-white text-dark antialiased">
        
        <Navbar 
          onOpenCart={() => setIsCartOpen(true)} 
          userRole={userRole}
          onLogout={handleLogout}
          onNavigate={(page) => setCurrentPage(page)}
        />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {currentPage === 'catalog' && (
            <Catalog onOpenCart={() => setIsCartOpen(true)} />
          )}
          
          {currentPage === 'login' && (
            <Login onLoginSuccess={handleLoginSuccess} />
          )}

          {currentPage === 'admin-dashboard' && userRole === 'admin' && (
            <AdminDashboard />
          )}
        </main>

        <SidebarCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <StickyCartBanner onOpenCart={() => setIsCartOpen(true)} />
        
      </div>
    </BrowserRouter>
  );
}