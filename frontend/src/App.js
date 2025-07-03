import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import HomePage from './components/HomePage/HomePage';
import CreateQuiltPage from './components/CreateQuiltPage/CreateQuiltPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import CreatePatchPage from "./components/CreatePatchPage/CreatePatchPage";
import QuiltViewPage from "./components/QuiltViewPage/QuiltViewPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create-quilt" element={<CreateQuiltPage />} />
        <Route path="/create-patch/:quiltId/:parentPatchId" element={<CreatePatchPage />} />
        <Route path="/create-patch/:quiltId" element={<CreatePatchPage />} />
        <Route path="/create-patch" element={<CreatePatchPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/quilt/:id" element={<QuiltViewPage />} />;
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
