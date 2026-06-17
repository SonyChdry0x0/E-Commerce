// 

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import Footer from './pages/Footer';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/DashboardPage';
import AdminOrders from './pages/admin/OrdersPage';
import AdminProducts from './pages/admin/ProductsPage';
import AdminUsers from './pages/admin/UsersPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* User routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path='users' element={<AdminUsers/>}/>
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;