import React from 'react';
import { AuthProvider } from './src/provider/authProvider';
import AppNavigation from './src/navigation/index';

const App = () => {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
};

export default App;
