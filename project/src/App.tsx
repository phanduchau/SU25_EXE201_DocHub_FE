// src/App.tsx - Thêm các routes liên quan đến Payment
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';

// Pages
import Home from './pages/Home';
import DoctorsList from './pages/DoctorsList';
import DoctorDetail from './pages/DoctorDetail';
import Appointments from './pages/Appointments';
import Login from './pages/Login';
import Register from './pages/Register';
import BookAppointment from './pages/BookAppointment';
import BookingConfirmation from './pages/BookingConfirmation';
import VideoCall from './pages/VideoCall';
import Chat from './pages/Chat';
import EmailConfirmation from './pages/EmailConfirmation';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Admin from './pages/Admin';
import Landing from './pages/Landing';
import DoctorDashboard from './pages/DoctorDashboard';
import NotificationPage from './pages/NotificationPage';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Membership from './pages/Membership';
import Payment from './pages/Payment'; // THÊM IMPORT PAYMENT
import PaymentSuccess from './pages/PaymentSuccess'; // THÊM IMPORT PAYMENT SUCCESS
import PaymentHistory from './pages/PaymentHistory'; // THÊM IMPORT PAYMENT HISTORY

function App() {
  return (
    <AuthProvider>
      <Router>
        <NotificationProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />

            <main className="flex-grow">
              <Routes>
                {/* 🌐 Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/doctors" element={<DoctorsList />} />
                <Route path="/doctors/:id" element={<DoctorDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/confirm-email" element={<EmailConfirmation />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/chat/:id" element={<RequireAuth><Chat /></RequireAuth>} />

                {/* 🔐 Protected routes: chỉ cần đăng nhập */}
                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/change-password"
                  element={
                    <RequireAuth>
                      <ChangePassword />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <RequireAuth>
                      <NotificationPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/appointments"
                  element={
                    <RequireAuth>
                      <Appointments />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/book-appointment/:id"
                  element={
                    <RequireAuth>
                      <BookAppointment />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/booking-confirmation/:id"
                  element={
                    <RequireAuth>
                      <BookingConfirmation />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/video-call/:id"
                  element={
                    <RequireAuth>
                      <VideoCall />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/chat/:id"
                  element={
                    <RequireAuth>
                      <Chat />
                    </RequireAuth>
                  }
                />

                {/* 💳 Payment routes - Require Authentication */}
                <Route
                  path="/payment"
                  element={
                    <RequireAuth>
                      <Payment />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/payment/success"
                  element={
                    <RequireAuth>
                      <PaymentSuccess />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/payment/history"
                  element={
                    <RequireAuth>
                      <PaymentHistory />
                    </RequireAuth>
                  }
                />

                {/* 🩺 Doctor-only route */}
                <Route
                  path="/doctor-dashboard"
                  element={
                    <RequireAuth role="Doctor">
                      <DoctorDashboard />
                    </RequireAuth>
                  }
                />

                {/* 🛠 Admin-only routes */}
                <Route
                  path="/admin"
                  element={
                    <RequireAuth role="Admin">
                      <Admin />
                    </RequireAuth>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </div>

          {/* Toast notifications */}
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className="toast-container"
          />
        </NotificationProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;