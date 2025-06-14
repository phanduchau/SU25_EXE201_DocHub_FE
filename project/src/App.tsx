import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import DoctorsList from './pages/DoctorsList';
import DoctorDetail from './pages/DoctorDetail';
import Membership from './pages/Membership';
import Appointments from './pages/Appointments';
import Login from './pages/Login';
import Register from './pages/Register';
import BookAppointment from './pages/BookAppointment';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingConfirmation from './pages/BookingConfirmation';
import Payment from './pages/Payment';
import VideoCall from './pages/VideoCall';
import Chat from './pages/Chat';
import EmailConfirmation from './pages/EmailConfirmation';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import { AuthProvider } from './contexts/AuthContext';
import ResetPassword from './pages/ResetPassword';
import Admin from './pages/Admin';
import Landing from './pages/Landing';
import DoctorDashboard from './pages/DoctorDashboard';

function App() {
  return (
     <AuthProvider>
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/book-appointment/:id" element={<BookAppointment />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/video-call/:id" element={<VideoCall />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/confirm-email" element={<EmailConfirmation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          </Routes>
        </main>
        
        <Footer />

      </div>
       <ToastContainer position="top-right" autoClose={3000} />
    </Router>
    </AuthProvider>
  );
}

export default App;