import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import Footer from './components/Footer';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBookings';
import HotelReg from './components/HotelReg';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/HotelOwner/Dashboard';
import AddRoom from './pages/HotelOwner/AddRoom';
import ListRoom from './pages/HotelOwner/ListRoom';
const App = () => {
  const isOwnerPath = useLocation().pathname.includes('owner');
  
  return (
    <div>
     {!isOwnerPath &&  <Navbar /> }
     {false && <HotelReg />}
     <div className='min-h-[70vh]'>
      <Routes >
      <Route path='/' element={<Home />} />
      <Route path='/rooms' element={<AllRooms />}></Route>
      <Route path='/rooms/:id' element={<RoomDetails />}></Route>
      <Route path='/my-bookings' element={<MyBookings />}></Route>

      
     <Route path='/owner' element={<Layout />}>
      <Route path='/owner' element={<Dashboard />}></Route>
      <Route path='/owner/add-room' element={<AddRoom />}></Route>
      <Route path='/owner/list-room' element={<ListRoom />}></Route>
     </Route>
     
      </Routes>

     </div>
     <Footer />
    </div>
  )
}

export default App