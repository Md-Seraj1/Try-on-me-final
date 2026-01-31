import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Search } from './pages/Search';
import { Profile } from './pages/Profile';
import { ProductDetails } from './pages/ProductDetails';
import { CategoryPage } from './pages/CategoryPage';
import { Notifications } from './pages/Notifications';
import { TryOn } from './pages/TryOn';
import { Settings } from './pages/Settings';
import { Orders } from './pages/Orders';
import { OrderDetails } from './pages/OrderDetails';
import { Wishlist } from './pages/Wishlist';
import { PaymentMethods } from './pages/PaymentMethods';
import { Checkout } from './pages/CheckOut';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentFailure } from './pages/PaymentFailure';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { useUserStore } from './lib/store';
import { supabase } from './lib/supabase';
import { Placeholder } from './pages/Placeholder';

const ProtectedRoute = () => {
  const user = useUserStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Layout />;
};

function App() {
  const setUser = useUserStore((state) => state.setUser);
  const setProfile = useUserStore((state) => state.setProfile);
  const setWishlist = useUserStore((state) => state.setWishlist);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchWishlist(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchWishlist(session.user.id);
      } else {
        setProfile(null);
        setWishlist([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setProfile, setWishlist]);

  const fetchWishlist = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', userId);

      if (!error && data) {
        setWishlist(data.map(item => item.product_id));
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/try-on" element={<TryOn />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/payments" element={<PaymentMethods />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route path="*" element={<Placeholder title="404 Not Found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
