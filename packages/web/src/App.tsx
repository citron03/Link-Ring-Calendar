import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient, queryClient } from './trpc';
import QuickLinkBoard from './components/QuickLinkBoard';
import Calendar from './components/Calendar';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import './styles/global.css.ts';
import * as styles from './styles/App.css';

type Page = 'login' | 'register' | 'calendar';

function App() {
  const [user, setUser] = useState<any | null>(null);
  const [page, setPage] = useState<Page>('login');

  useEffect(() => {
    // In a real app, you'd verify the token with the server
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setPage('calendar');
    }
  }, []);

  const handleLoginSuccess = (data: { accessToken: string; refreshToken: string; user: any }) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    setPage('calendar');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setPage('login');
  };

  const renderPage = () => {
    if (page === 'calendar' && user) {
      return (
        <div className={styles.appContainer}>
          <header className={styles.appHeader}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1>Link-Ring Calendar</h1>
              <div>
                <span>Welcome, {user.nickname}!</span>
                <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
              </div>
            </div>
          </header>
          <div className={styles.appBody}>
            <QuickLinkBoard />
            <Calendar />
          </div>
        </div>
      );
    }

    if (page === 'register') {
      return (
        <RegisterPage
          onRegisterSuccess={() => setPage('login')}
          onNavigateToLogin={() => setPage('login')}
        />
      );
    }

    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setPage('register')}
      />
    );
  };

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{renderPage()}</QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
