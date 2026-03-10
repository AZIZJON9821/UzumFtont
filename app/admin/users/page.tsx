'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight,
  Users, ShieldCheck, UserCheck, X, ChevronUp, ChevronDown,
} from 'lucide-react';
import { usersApi } from '@/lib/api/users';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';

import type { User } from '@/lib/types';

const ROLES = ['ALL', 'CUSTOMER', 'SELLER', 'ADMIN', 'MODERATOR', 'SUPER_ADMIN'];
const ROLE_LABELS: Record<string, string> = {
  ALL: 'Barchasi',
  CUSTOMER: 'Xaridor',
  SELLER: 'Sotuvchi',
  ADMIN: 'Admin',
  MODERATOR: 'Moderator',
  SUPER_ADMIN: 'Super Admin',
};
const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-100 text-red-700',
  ADMIN: 'bg-purple-100 text-purple-700',
  MODERATOR: 'bg-blue-100 text-blue-700',
  SELLER: 'bg-orange-100 text-orange-700',
  CUSTOMER: 'bg-green-100 text-green-700',
};

const PAGE_SIZES = [10, 25, 50];

type SortKey = 'fullName' | 'email' | 'role' | 'createdAt';
type SortDir = 'asc' | 'desc';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Sort
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Ushbu foydalanuvchini o'chirmoqchimisiz?")) {
      try {
        await usersApi.delete(id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch {
        alert('Xatolik yuz berdi');
      }
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setPage(1);
  };

  const hasActiveFilters = search || roleFilter !== 'ALL' || statusFilter !== 'ALL';

  // Stats
  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' || u.role === 'MODERATOR').length,
    active: users.filter(u => u.isActive).length,
    customers: users.filter(u => u.role === 'CUSTOMER').length,
  }), [users]);

  // Filter + Sort
  const processed = useMemo(() => {
    let list = [...users];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        (u.fullName || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.phone || '').includes(q)
      );
    }
    if (roleFilter !== 'ALL') list = list.filter(u => u.role === roleFilter);
    if (statusFilter === 'ACTIVE') list = list.filter(u => u.isActive);
    if (statusFilter === 'INACTIVE') list = list.filter(u => !u.isActive);

    list.sort((a, b) => {
      let va = (a as any)[sortKey] ?? '';
      let vb = (b as any)[sortKey] ?? '';
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [users, search, roleFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(processed.length / pageSize);
  const paginated = processed.slice((page - 1) * pageSize, page * pageSize);

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp className={`h-3 w-3 ${sortKey === col && sortDir === 'asc' ? 'text-[#7000ff]' : 'text-slate-300'}`} />
      <ChevronDown className={`h-3 w-3 -mt-1 ${sortKey === col && sortDir === 'desc' ? 'text-[#7000ff]' : 'text-slate-300'}`} />
    </span>
  );

  if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Foydalanuvchilar</h2>
          <p className="text-sm text-slate-500">{processed.length} ta natija</p>
        </div>
        <Link href="/admin/users/create">
          <Button className="bg-[#7000ff] hover:bg-[#5d00d6] text-white flex gap-2">
            <Plus className="h-4 w-4" /> Foydalanuvchi qo'shish
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Jami', value: stats.total, icon: <Users className="h-5 w-5 text-[#7000ff]" />, bg: 'bg-purple-50' },
          { label: 'Faol', value: stats.active, icon: <UserCheck className="h-5 w-5 text-green-600" />, bg: 'bg-green-50' },
          { label: 'Adminlar', value: stats.admins, icon: <ShieldCheck className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Xaridorlar', value: stats.customers, icon: <Users className="h-5 w-5 text-orange-500" />, bg: 'bg-orange-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 flex items-center gap-3 border`}>
            <div className="p-2 bg-white rounded-lg shadow-sm">{s.icon}</div>
            <div>
              <div className="text-lg font-bold text-black">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ism, email yoki telefon..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#7000ff]/30"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            {/* Role Filter */}
            <select
              className="px-3 py-2 border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#7000ff]/30 bg-white"
              value={roleFilter}
              onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            >
              {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>

            {/* Status Filter */}
            <select
              className="px-3 py-2 border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#7000ff]/30 bg-white"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }}
            >
              <option value="ALL">Barcha holat</option>
              <option value="ACTIVE">Faol</option>
              <option value="INACTIVE">Faol emas</option>
            </select>

            {/* Page size */}
            <select
              className="px-3 py-2 border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#7000ff]/30 bg-white"
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
            >
              {PAGE_SIZES.map(s => <option key={s} value={s}>{s} ta</option>)}
            </select>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <X className="h-4 w-4" /> Tozalash
              </button>
            )}
          </div>

          {/* Role quick-filter chips */}
          <div className="flex flex-wrap gap-2">
            {ROLES.map(r => (
              <button
                key={r}
                onClick={() => { setRoleFilter(r); setPage(1); }}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${roleFilter === r
                  ? 'bg-[#7000ff] text-white border-[#7000ff]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-[#7000ff] hover:text-[#7000ff]'
                  }`}
              >
                {ROLE_LABELS[r]}
                {r !== 'ALL' && (
                  <span className="ml-1 opacity-70">
                    ({users.filter(u => u.role === r).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th
                  className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-[#7000ff] select-none"
                  onClick={() => handleSort('fullName')}
                >
                  <span className="flex items-center">Ism <SortIcon col="fullName" /></span>
                </th>
                <th
                  className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-[#7000ff] select-none"
                  onClick={() => handleSort('email')}
                >
                  <span className="flex items-center">Email <SortIcon col="email" /></span>
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Telefon</th>
                <th
                  className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-[#7000ff] select-none"
                  onClick={() => handleSort('role')}
                >
                  <span className="flex items-center">Rol <SortIcon col="role" /></span>
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Holat</th>
                <th
                  className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-[#7000ff] select-none"
                  onClick={() => handleSort('createdAt')}
                >
                  <span className="flex items-center">Sana <SortIcon col="createdAt" /></span>
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginated.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#7000ff] to-[#a855f7] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {(user.fullName || user.email || '?')[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-900">{user.fullName || 'Ism kiritilmagan'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.email || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${ROLE_COLORS[user.role] || 'bg-slate-100 text-slate-700'}`}>
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 text-xs font-medium ${user.isActive ? 'text-green-600' : 'text-slate-400'}`}>
                      <span className={`h-2 w-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-slate-300'}`} />
                      {user.isActive ? 'Faol' : 'Faol emas'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/users/edit/${user.id}`}>
                        <button className="p-2 text-slate-400 hover:text-[#7000ff] hover:bg-purple-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Users className="h-10 w-10 opacity-30" />
                      <p className="text-sm">Foydalanuvchilar topilmadi</p>
                      {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-xs text-[#7000ff] hover:underline">
                          Filtrlarni tozalash
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-sm text-slate-500">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, processed.length)} / {processed.length} ta
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pg = i + 1;
                if (totalPages > 5 && page > 3) pg = page - 2 + i;
                if (pg > totalPages) return null;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === pg
                      ? 'bg-[#7000ff] text-white'
                      : 'border hover:bg-slate-50 text-slate-700'
                      }`}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
