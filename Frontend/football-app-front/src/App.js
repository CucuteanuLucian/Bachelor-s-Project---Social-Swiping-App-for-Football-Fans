//import logo from './logo.svg';
import './App.css';
import React from 'react'
import LoginApp from './Pages/Login/Login'
import SignupApp from './Pages/Signup/Signup'
import StartpageApp from './Pages/Startpage/Startpage'
import DashboardApp from './Pages/Dashboard/Dashboard'
import NotFoundApp from './Pages/NotFound/NotFound'
import ProfileApp from './Pages/Profile/Profile';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import ProfileSettingsApp from './Pages/ProfileSettings/ProfileSettings';
import ChatMessages from './Pages/Chats/ChatMessages';
import ChatList from './Pages/Chats/ChatList';
import { Stack } from '@mui/material';
import NavBar from './Components/NavBar/NavBar';
import { Box } from '@mui/material';

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />
}

function SignupAndLogout() {
  localStorage.clear();
  return <SignupApp />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginApp />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<SignupAndLogout />} />
        <Route path="/" element={<StartpageApp />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardApp />
          </ProtectedRoute>
          } />
        <Route path="/profile/settings" element={
          <ProtectedRoute>
            <ProfileSettingsApp />
          </ProtectedRoute>
          } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileApp />
          </ProtectedRoute>
          } />

        <Route path='/chats' element={
          <ProtectedRoute>
            <NavBar />
            <Stack direction={"row"}>
              <ChatList />
            </Stack>
          </ProtectedRoute>
        } />

        {/* roomID sa poata fi accesat doar de cei doi useri, nu de tot poporul, de verificat daca cel care vrea sa se conecteze este gasit in matches si are roomid egal cu cel pus acolo, daca nu ii dam page404 */}
        <Route path='/chats/:roomID' element={
          <ProtectedRoute>
            <Box minHeight='100vh' maxHeight='100vh' >
              <NavBar />
              <Stack direction={"row"}>
                <ChatList />
                <ChatMessages />
              </Stack>
            </Box>
          </ProtectedRoute>
        } />

    

        <Route path="*" element={<NotFoundApp />} />
      </Routes>
      
    </Router>
  );
}

export default App;
