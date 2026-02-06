"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        loginIdentifier: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isEmail = (text: string) => /\S+@\S+\.\S+/.test(text);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload: any = {
                fullName: formData.fullName,
                password: formData.password,
            };

            if (isEmail(formData.loginIdentifier)) {
                payload.email = formData.loginIdentifier;
            } else {
                payload.phone = formData.loginIdentifier;
            }

            await api.post("/auth/register", payload);

            const identifier = isEmail(formData.loginIdentifier) ? `email=${encodeURIComponent(formData.loginIdentifier)}` : `phone=${encodeURIComponent(formData.loginIdentifier)}`;
            router.push(`/auth/verify?${identifier}`);

        } catch (err: any) {
            // Safe error handling
            const msg = err.response?.data?.message;
            if (Array.isArray(msg)) {
                setError(msg.join(", "));
            } else {
                setError(msg || "Xatolik yuz berdi");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow rounded-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
                        Ro'yxatdan o'tish
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Hisobingiz bormi?{" "}
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
                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-900 mb-1">
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
                        <label htmlFor="loginIdentifier" className="block text-sm font-medium text-slate-900 mb-1">
                            Telefon raqam yoki Email
                        </label>
                        <Input
                            id="loginIdentifier"
                            name="loginIdentifier"
                            type="text"
                            required
                            placeholder="+998901234567 yoki email@mail.com"
                            value={formData.loginIdentifier}
                            onChange={(e) =>
                                setFormData({ ...formData, loginIdentifier: e.target.value })
                            }
                            className="mb-4"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-900 mb-1">
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
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Yuborish..." : "Ro'yxatdan o'tish"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
