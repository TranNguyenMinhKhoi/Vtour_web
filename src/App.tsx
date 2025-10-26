import './App.css'
import Login from './pages/login/Login'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import ForgotPassword from './pages/forgotPassword/ForgotPassword'
// import Register from './pages/register/Register'
import {MainLayout} from './layouts'
import Home from './pages/home/Home'
import Tickets from './pages/tickets/Tickets'
import Sales from './pages/sales/Sales'
import Tips from './pages/tips/Tips'
import Cart from './pages/cart/Cart'
import News from './pages/news/News'
import TicketCancellation from './pages/cancellation/TicketCancellation'
import EnableBooking from './pages/booking/EnableBooking'
import OTPRegister from './pages/OTPregister/OTPRegister'
import BusCompanyList from './pages/BusCompany/BusCompanyList'
import BusCompanyBooking from './pages/BusCompany/BusCompanyBooking'
import MainAdminBusCompany from './pages/AdminBusCompany/MainAdminBusCompany'
import MainAdminAccount from './pages/AdminAccount/MainAdminAccount'
import MainAdminTours from './pages/AdminTours/MainAdminTours'
import Profile from './pages/profile/Profile'
import RoutesPage from './pages/routes/RoutesPage'
import Payment from './pages/payments/Payment'


function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/home" element={<MainLayout><Home/></MainLayout>} />
        {/* <Route path="/home-verified" element={<HomeNo/>}/> */}
        <Route path="/routes" element={<MainLayout><RoutesPage/></MainLayout>} />
        <Route path="/tickets" element={<MainLayout><Tickets/></MainLayout>} />
        <Route path="/BusCompany" element={<MainLayout><BusCompanyList/></MainLayout>} />
        <Route path="/buscompanies/:buscompanyId" element={<MainLayout><BusCompanyBooking/></MainLayout>} />
        <Route path="/sales" element={<MainLayout><Sales/></MainLayout>} />
        <Route path="/tips" element={<MainLayout><Tips/></MainLayout>} />
        <Route path="/cart" element={<MainLayout><Cart/></MainLayout>} />
        <Route path="/news" element={<MainLayout><News/></MainLayout>} />
        <Route path="/cancellation" element={<MainLayout><TicketCancellation/></MainLayout>} />
        <Route path="/booking" element={<MainLayout><EnableBooking/></MainLayout>} />
        <Route path="/OTPRegister" element={<OTPRegister/>} />
        <Route path="/AdminBusCompany" element={<MainLayout><MainAdminBusCompany/></MainLayout>} />
        <Route path="/AdminAccount" element={<MainLayout><MainAdminAccount/></MainLayout>} />
        <Route path="/AdminTours" element={<MainLayout><MainAdminTours/></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile/></MainLayout>} />
        <Route path="/payments" element={<MainLayout><Payment/></MainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
