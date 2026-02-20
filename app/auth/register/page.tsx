'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate both email and phone
    if (!formData.email || !formData.phone) {
      setError('Email ham, telefon ham kiriting!');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      await api.post('/auth/register', payload);

      // Use email for verification
      router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      // Safe error handling
      const msg = err.response?.data?.message;
      if (Array.isArray(msg)) {
        setError(msg.join(', '));
      } else {
        setError(msg || 'Xatolik yuz berdi');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-black">
            Ro'yxatdan o'tish
          </h2>
          <p className="mt-2 text-center text-sm text-slate-900">
            Hisobingiz bormi?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Kirish
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-black mb-1"
            >
              Ism Familiya
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="Ivan Ivanov"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="mb-4"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="email@mail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mb-4"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-black mb-1"
            >
              Telefon raqam
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+998901234567"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="mb-4"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-1"
            >
              Parol
            </label>
            <PasswordInput
              id="password"
              name="password"
              required
              placeholder="Parol o'ylab toping"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="mb-4"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Yuborish...' : "Ro'yxatdan o'tish"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
