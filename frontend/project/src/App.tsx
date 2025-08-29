// import React, { useState } from 'react';
// import { Header } from './components/Header';
// import { Hero } from './components/Hero';
// import { ProductGrid } from './components/ProductGrid';
// import { ArtistDashboard } from './components/ArtistDashboard';
// import { ProductModal } from './components/ProductModal';
// import { AuthModal } from './components/AuthModal';
// import { mockProducts, mockArtists } from './data/mockData';
// import type { Product, Artist, User } from './types';

// function App() {
//   const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [products, setProducts] = useState<Product[]>(mockProducts);

//   const handleLogin = (email: string, password: string) => {
//     // Mock login - in real app would authenticate with backend
//     const artist = mockArtists.find(a => a.email === email);
//     if (artist) {
//       setCurrentUser({ id: artist.id, name: artist.name, email: artist.email, isArtist: true });
//       setShowAuthModal(false);
//     }
//   };

//   const handleRegister = (name: string, email: string, password: string, isArtist: boolean) => {
//     // Mock registration
//     const newUser: User = {
//       id: Date.now().toString(),
//       name,
//       email,
//       isArtist
//     };
//     setCurrentUser(newUser);
//     setShowAuthModal(false);
//   };

//   const handleLogout = () => {
//     setCurrentUser(null);
//     setCurrentView('home');
//   };

//   const handleAddProduct = (productData: Omit<Product, 'id' | 'artistId' | 'createdAt'>) => {
//     if (!currentUser) return;
    
//     const newProduct: Product = {
//       ...productData,
//       id: Date.now().toString(),
//       artistId: currentUser.id,
//       createdAt: new Date().toISOString()
//     };
    
//     setProducts(prev => [newProduct, ...prev]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header 
//         currentUser={currentUser}
//         onLogin={() => setShowAuthModal(true)}
//         onLogout={handleLogout}
//         onNavigate={setCurrentView}
//         currentView={currentView}
//       />
      
//       {currentView === 'home' ? (
//         <>
//           <Hero />
//           <ProductGrid 
//             products={products}
//             onProductClick={setSelectedProduct}
//           />
//         </>
//       ) : (
//         <ArtistDashboard 
//           currentUser={currentUser}
//           products={products.filter(p => p.artistId === currentUser?.id)}
//           onAddProduct={handleAddProduct}
//         />
//       )}

//       {selectedProduct && (
//         <ProductModal 
//           product={selectedProduct}
//           onClose={() => setSelectedProduct(null)}
//         />
//       )}

//       {showAuthModal && (
//         <AuthModal
//           onClose={() => setShowAuthModal(false)}
//           onLogin={handleLogin}
//           onRegister={handleRegister}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ArtistDashboard } from './components/ArtistDashboard';
import { ProductModal } from './components/ProductModal';
import { AuthModal } from './components/AuthModal';
import { mockProducts } from './data/mockData';
import type { Product, User } from './types';

const API_BASE = "http://127.0.0.1:5000";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch user profile if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchProfile(token);
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser({
          id: data.user,
          name: data.artisan_profile?.name || "",
          email: data.user,
          isArtist: !!data.artisan_profile,
        });
      }
    } catch {
      localStorage.removeItem('token');
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        await fetchProfile(data.token);
        setShowAuthModal(false);
      } else alert(data.error || 'Login failed');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignup = async (
    name: string,
    email: string,
    password: string,
    craft: string,
    location: string,
    isArtist: boolean
  ) => {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, craft, location }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        await fetchProfile(data.token);
        setShowAuthModal(false);
      } else alert(data.error || 'Signup failed');
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleAddProduct = (productData: Omit<Product, 'id' | 'artistId' | 'createdAt'>) => {
    if (!currentUser) return;
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      artistId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentUser={currentUser}
        onLogin={() => { setAuthMode('login'); setShowAuthModal(true); }}
        onSignup={() => { setAuthMode('signup'); setShowAuthModal(true); }}
        onLogout={handleLogout}
        onNavigate={setCurrentView}
        currentView={currentView}
      />

      {/* Auth modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}          // pass current mode
  onClose={() => setShowAuthModal(false)}
  onLogin={handleLogin}
  onSignup={handleSignup}
        />
      )}

      {/* Main content */}
      <main className="p-4">
        {currentView === 'home' && (
          <>
            <Hero />
            <ProductGrid products={products} onProductClick={setSelectedProduct} />
          </>
        )}

        {currentView === 'dashboard' && currentUser?.isArtist && (
          <ArtistDashboard
            currentUser={currentUser}
            products={products.filter(p => p.artistId === currentUser.id)}
            onAddProduct={handleAddProduct}
          />
        )}
      </main>

      {/* Product modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}

export default App;
