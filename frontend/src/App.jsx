import { useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import './App.css'
import SignupPage from './Page/SignUpPage'
import SignInPage from './Page/SignInPage'
import ForgotPassword from './Page/ForgotPassword'
import ChangePassword from './Page/ChangePassword'
function App() {
  
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<SignInPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/forget-password' element={ <ForgotPassword />} />
        {/* <Route path='/change-password' element={<ChangePassword />} /> */}
        <Route path='/reset-password/:token' element={<ChangePassword />} />
      </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
