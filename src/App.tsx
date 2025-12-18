import './App.css'
import Login from './pages/login/Login'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
// import Register from './pages/register/Register'
import {MainLayout} from './layouts'
import Home from './pages/home/Home'
import Tickets from './pages/tickets/Tickets'
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
import Profile from './pages/profile/Profile'
import RoutesPage from './pages/routes/RoutesPage'
import Payment from './pages/payments/Payment'
import Us from './pages/us/Us'
import {GlobalLoadingProvider} from './context/GlobalLoadingContext'
import {LoginDialogProvider} from './context/LoginDialogContext'
import Vouchers from './pages/Vouchers/Vouchers'
import AdminSchedule from './pages/AdminSchedule/AdminSchedule'
import MainAdminRoute from './pages/AdminRoute/MainAdminRoute'
import AdminVoucher from './pages/AdminVoucher/AdminVoucher'


function App() {

  return (
    <BrowserRouter>
    <GlobalLoadingProvider>
      <LoginDialogProvider>
      <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/home" element={<MainLayout><Home/></MainLayout>} />
        {/* <Route path="/home-verified" element={<HomeNo/>}/> */}
        <Route path="/routes" element={<MainLayout><RoutesPage/></MainLayout>} />
        <Route path="/tickets" element={<MainLayout><Tickets/></MainLayout>} />
        <Route path="/BusCompany" element={<MainLayout><BusCompanyList/></MainLayout>} />
        <Route path="/buscompanies/:buscompanyId" element={<MainLayout><BusCompanyBooking/></MainLayout>} />
        <Route path="/Vouchers" element={<MainLayout><Vouchers/></MainLayout>} />
        <Route path="/tips" element={<MainLayout><Tips/></MainLayout>} />
        <Route path="/cart" element={<MainLayout><Cart/></MainLayout>} />
        <Route path="/news" element={<MainLayout><News/></MainLayout>} />
        <Route path="/cancellation" element={<MainLayout><TicketCancellation/></MainLayout>} />
        <Route path="/booking" element={<MainLayout><EnableBooking/></MainLayout>} />
        <Route path="/OTPRegister" element={<OTPRegister/>} />
        <Route path="/AdminBusCompany" element={<MainLayout><MainAdminBusCompany/></MainLayout>} />
        <Route path="/AdminAccount" element={<MainLayout><MainAdminAccount/></MainLayout>} />
        <Route path="/AdminRoute" element={<MainLayout><MainAdminRoute/></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile/></MainLayout>} />
        <Route path="/payments" element={<MainLayout><Payment/></MainLayout>} />
        <Route path="/us" element={<MainLayout><Us/></MainLayout>} />
        <Route path="/AdminSchedule" element={<MainLayout><AdminSchedule/></MainLayout>} />
        <Route path="/AdminVoucher" element={<MainLayout><AdminVoucher/></MainLayout>} />
      </Routes>
      </LoginDialogProvider>
    </GlobalLoadingProvider>
    </BrowserRouter>
  )
}

export default App
