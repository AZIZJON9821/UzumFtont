"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api/axios";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
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
                password: formData.password
            };

            if (isEmail(formData.loginIdentifier)) {
                payload.email = formData.loginIdentifier;
            } else {
                payload.phone = formData.loginIdentifier;
            }

            const { data } = await api.post("/auth/login", payload);
            login(data.accessToken, data.refreshToken);

            router.push("/profile");
        } catch (err: any) {
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
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-black">
                        Tizimga kirish
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-900">
                        Yoki{" "}
                        <Link
                            href="/auth/register"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            ro'yxatdan o'ting
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div className="mb-4">
                            <label htmlFor="loginIdentifier" className="block text-sm font-medium text-black mb-1">
                                Telefon raqam yoki Email
                            </label>
                            <Input
                                id="loginIdentifier"
                                name="loginIdentifier"
                                type="text"
                                autoComplete="username"
                                required
                                placeholder="+998901234567 yoki email"
                                value={formData.loginIdentifier}
                                onChange={(e) =>
                                    setFormData({ ...formData, loginIdentifier: e.target.value })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                                Parol
                            </label>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                placeholder="Parol"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                        </div>
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
                            {loading ? "Kirish..." : "Kirish"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
