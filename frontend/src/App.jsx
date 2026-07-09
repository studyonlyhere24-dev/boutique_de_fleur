import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom'; // 👈 Ajout du Router pour réparer la Navbar
import Navbar from './components/Navbar';
import Catalog from './features/catalog/Catalog';
import SidebarCart from './features/cart/SidebarCart';
import StickyCartBanner from './features/cart/StickyCartBanner';
import Login from './features/auth/Login';
import AdminDashboard from './features/admin/AdminDashboard';

export default function App() {
  // Gestion de l'affichage du panier latéral
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Liaison API : Rôle de l'utilisateur connecté ('client', 'admin', ou null)
  const [userRole, setUserRole] = useState(null);
  
  // État pour savoir si on affiche la page de connexion ou le catalogue
  const [currentPage, setCurrentPage] = useState('catalog'); // 'catalog', 'login' ou 'admin-dashboard'

  // Fonction appelée lors d'une authentification réussie depuis Login.jsx
  const handleLoginSuccess = (role) => {
    setUserRole(role); // On enregistre si c'est un 'admin' ou un 'client'
    
    if (role === 'admin') {
      setCurrentPage('admin-dashboard'); // 🚀 Redirection automatique du Super-Admin
    } else {
      setCurrentPage('catalog'); // Redirection du client vers la boutique
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage('catalog');
  };

  return (
    // 👈 On enveloppe tout le code dans <BrowserRouter> pour fournir le contexte à la Navbar
    <BrowserRouter> 
      <div className="min-h-screen bg-white text-dark antialiased">
        {/* Barre de navigation globale */}
        <Navbar 
          onOpenCart={() => setIsCartOpen(true)} 
          userRole={userRole}
          onLogout={handleLogout}
          onNavigate={(page) => setCurrentPage(page)}
        />

        {/* RENDER DYNAMIQUE DE LA PAGE SELON LE RÔLE */}
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

        {/* Composants d'interface du panier */}
        <SidebarCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <StickyCartBanner onOpenCart={() => setIsCartOpen(true)} />
      </div>
    </BrowserRouter>
  );
}