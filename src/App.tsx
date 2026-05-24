import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import { AuthProvider } from './context/AuthContext';

// Pages
import LoginPage          from './pages/LoginPage';
import DashboardPage      from './pages/DashboardPage';
import ManageOffersPage   from './pages/ManageOffersPage';
import CreateOfferPage    from './pages/CreateOfferPage';
import ManageBookingsPage from './pages/ManageBookingsPage';
import ManageSlotsPage    from './pages/ManageSlotsPage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import PublicListingPage  from './pages/PublicListingPage';
import OfferDetailPage    from './pages/OfferDetailPage';
import BookingPage        from './pages/BookingPage';
import ConfirmationPage   from './pages/ConfirmationPage';

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"        element={<LoginPage />} />
        <Route path="/offers"        element={<PublicListingPage />} />
        <Route path="/offers/:id"    element={<OfferDetailPage />} />
        <Route path="/offers/:id/book" element={<BookingPage />} />
        <Route path="/booking/confirmation" element={<ConfirmationPage />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/offers"    element={<ManageOffersPage />} />
        <Route path="/admin/offers/create" element={<CreateOfferPage />} />
        <Route path="/admin/bookings"  element={<ManageBookingsPage />} />
        <Route path="/admin/slots"     element={<ManageSlotsPage />} />
        <Route path="/admin/business"  element={<BusinessProfilePage />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
