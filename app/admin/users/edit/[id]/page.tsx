'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { usersApi } from '@/lib/api/users';

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'USER',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await usersApi.getById(id);
        setFormData({
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'USER',
        });
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

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
      await usersApi.update(id, formData);
      // Redirect to users list page after successful update
      window.location.href = '/admin/users';
    } catch (error) {
      console.error('Failed to update user', error);
      alert('Foydalanuvchi yangilashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">
          Foydalanuvchi tahrirlash
        </h2>
        <p className="text-sm text-slate-900">
          Foydalanuvchi ma'lumotlarini tahrirlash
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            Telefon
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
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
            <option value="USER">Foydalanuvchi</option>
            <option value="ADMIN">Administrator</option>
            <option value="MODERATOR">Moderator</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="bg-[#7000ff] hover:bg-[#5d00d6] text-white"
            disabled={loading}
          >
            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
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
