import './App.css'
import Signup from './components/Signup'
import { Route, Routes } from 'react-router-dom'
import OTPVerification from './components/OTPVerification'
import SetPass from './components/SetPass'
import LogIn from './components/LogIn'
import Dashboard from './components/Dashboard'
import Profile from './components/profile'

function App() {
  return (
    <>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/verifyOTP" element={<OTPVerification />} />
          <Route path="/setPassword" element={<SetPass />} />
          <Route path="/logIn" element={<LogIn />} />
                    <Route path="/" element={<LogIn />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/profile' element={<Profile  />} />
        </Routes>
    </>
  )
}

export default App
