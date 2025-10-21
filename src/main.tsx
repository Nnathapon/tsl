import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import App from './App.tsx'
import Register from './Register'
import Login from './Login'
import Terms from './Terms'
import Privacy from './Privacy'
import Dashboard from './Dashboard'
import ProfileSettings from './ProfileSettings.tsx'
import UserProfile from './UserProfile.tsx'
import AddBuilding from './AddBuilding.tsx'

document.title = "TSL Asset"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/tsl/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user/:userid" element={<UserProfile />} />
        <Route path="/myprofile" element={<ProfileSettings />} />
        <Route path="/addbuilding" element={<AddBuilding />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
