'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    localStorage.setItem('authToken', 'admin-token-' + Date.now());
    localStorage.setItem('adminUser', 'admin');
    router.push('/dashboard');
  };

  return <LoginForm onLoginSuccess={handleLoginSuccess} />;
}
