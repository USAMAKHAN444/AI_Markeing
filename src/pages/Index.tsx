
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  // This component simply redirects to the landing page
  // In a more complex app, this could check for authentication status, etc.
  return <Navigate to="/" replace />;
};

export default Index;
