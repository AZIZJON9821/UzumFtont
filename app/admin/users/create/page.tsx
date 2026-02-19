'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { usersApi } from '@/lib/api/users';

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    fullName: '',
    password: '',
    role: 'USER',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await usersApi.create(formData);
      // Redirect to users list page after successful creation
      window.location.href = '/admin/users';
    } catch (error) {
      console.error('Failed to create user', error);
      alert('Foydalanuvchi yaratishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">
          Foydalanuvchi yaratish
        </h2>
        <p className="text-sm text-slate-900">Yangi foydalanuvchi qo'shish</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Telefon
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-[#7000ff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-[#7000ff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Ism
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-[#7000ff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Parol
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-[#7000ff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Rol
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-[#7000ff]"
          >
            <option value="CUSTOMER">Foydalanuvchi</option>
            <option value="SELLER">Sotuvchi</option>
            <option value="ADMIN">Administrator</option>
            <option value="MODERATOR">Moderator</option>
            <option value="COURIER">Kuryer</option>
            <option value="SUPER_ADMIN">Super Administrator</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="bg-[#7000ff] hover:bg-[#5d00d6] text-white"
            disabled={loading}
          >
            {loading ? 'Saqlanmoqda...' : 'Yaratish'}
          </Button>
          <Link href="/admin/users">
            <Button type="button" variant="outline">
              Bekor qilish
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
