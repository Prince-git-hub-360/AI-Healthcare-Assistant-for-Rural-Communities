import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { RegisterForm } from '../../components/auth/RegisterForm';

export const RegisterPage = ({ onNavigate, onSuccess }) => {
  return (
    <AuthLayout onNavigate={onNavigate}>
      <RegisterForm onNavigateLogin={() => onNavigate('/login')} onSuccess={onSuccess} />
    </AuthLayout>
  );
};

export default RegisterPage;
