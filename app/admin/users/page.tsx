'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { usersApi } from '@/lib/api/users';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Ushbu foydalanuvchini o'chirmoqchimisiz?")) {
      try {
        await usersApi.delete(id);
        setUsers(users.filter((u) => u.id !== id));
      } catch (error) {
        console.error('Failed to delete user', error);
        alert('Xatolik yuz berdi');
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm)) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Foydalanuvchilar</h2>
          <p className="text-sm text-slate-900">
            Barcha foydalanuvchilarni boshqarish
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/users/create">
            <Button className="bg-[#7000ff] hover:bg-[#5d00d6] text-white flex gap-2">
              <Plus className="h-4 w-4" />
              Foydalanuvchi qo'shish
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700" />
            <input
              type="text"
              placeholder="Foydalanuvchi qidirish..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#7000ff]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex gap-2">
            <Filter className="h-4 w-4" />
            Filtrlar
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">
                  Ism
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">
                  Telefon
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">
                  Ro'yxatdan o'tgan sana
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider text-right">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {user.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-black">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-black">
                    {user.phone || "Noma'lum"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'MODERATOR'
                          ? 'bg-blue-100 text-blue-700'
                          : user.role === 'SUPER_ADMIN'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/users/edit/${user.id}`}>
                        <button className="p-2 text-slate-400 hover:text-[#7000ff] hover:bg-slate-100 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Foydalanuvchilar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
