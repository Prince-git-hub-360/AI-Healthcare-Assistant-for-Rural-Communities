import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { LoginForm } from '../../components/auth/LoginForm';

export const LoginPage = ({ onNavigate, onSuccess }) => {
  return (
    <AuthLayout onNavigate={onNavigate}>
      <LoginForm onNavigateRegister={() => onNavigate('/register')} onSuccess={onSuccess} />
    </AuthLayout>
  );
};

export default LoginPage;
