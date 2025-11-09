import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import useGetCurrentUser from './hooks/useGetCurrentUser';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import useGetCity from './hooks/useGetCity';
import useGetMyshop from './hooks/useGetMyShop';
import CreateEditShop from './pages/CreateEditShop';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import useGetShopByCity from './hooks/useGetShopByCity';
import useGetItemsByCity from './hooks/useGetItemsByCity';
import CartPage from './pages/CartPage';
import CheckOut from './pages/CheckOut';
import OrderPlaced from './pages/OrderPlaced';
import MyOrders from './pages/MyOrders';
import useGetMyOrders from './hooks/useGetMyOrders';
import useUpdateLocation from './hooks/useUpdateLocation';
import TrackOrderPage from './pages/TrackOrderPage';
import Shop from './pages/Shop';
import { io } from 'socket.io-client';
import { setSocket } from './redux/userSlice';

// Use VITE env variable (best practice)
export const serverUrl = import.meta.env.VITE_API_BASE_URL || "https://food-delivery-booking.onrender.com";

function App() {
  const { userData, socket } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Run all necessary hooks
  useGetCurrentUser();
  useUpdateLocation();
  useGetCity();
  useGetMyshop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();

  // Socket.IO connection
  useEffect(() => {
    if (!socket) {
      const socketInstance = io(serverUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'], // fallback support
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id);
        if (userData?._id) {
          socketInstance.emit('identity', { userId: userData._id });
        }
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      dispatch(setSocket(socketInstance));
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
        dispatch(setSocket(null));
      }
    };
  }, [dispatch, socket, userData?._id]);

  // Re-emit identity when user logs in
  useEffect(() => {
    if (socket && userData?._id) {
      socket.emit('identity', { userId: userData._id });
    }
  }, [socket, userData?._id]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" replace />} />
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" replace />} />
      <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to="/" replace />} />

      {/* Protected Routes */}
      <Route path="/" element={userData ? <Home /> : <Navigate to="/signin" replace />} />
      <Route path="/create-edit-shop" element={userData ? <CreateEditShop /> : <Navigate to="/signin" replace />} />
      <Route path="/add-item" element={userData ? <AddItem /> : <Navigate to="/signin" replace />} />
      <Route path="/edit-item/:itemId" element={userData ? <EditItem /> : <Navigate to="/signin" replace />} />
      <Route path="/cart" element={userData ? <CartPage /> : <Navigate to="/signin" replace />} />
      <Route path="/checkout" element={userData ? <CheckOut /> : <Navigate to="/signin" replace />} />
      <Route path="/order-placed" element={userData ? <OrderPlaced /> : <Navigate to="/signin" replace />} />
      <Route path="/my-orders" element={userData ? <MyOrders /> : <Navigate to="/signin" replace />} />
      <Route path="/track-order/:orderId" element={userData ? <TrackOrderPage /> : <Navigate to="/signin" replace />} />
      <Route path="/shop/:shopId" element={userData ? <Shop /> : <Navigate to="/signin" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
