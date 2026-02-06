"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useAuth } from "@/components/providers/AuthProvider";

function VerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth(); // Use login from context
    const phone = searchParams.get("phone") || "";
    const email = searchParams.get("email") || "";

    const [formData, setFormData] = useState({
        otp: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload: any = { otp: formData.otp };
            if (phone) payload.phone = phone;
            if (email) payload.email = email;

            const { data } = await api.post("/auth/verify-otp", payload);

            // Use context login handles token storage and state update
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
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Kodni tasdiqlash
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {phone || email} ga yuborilgan kodni kiriting
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                            SMS/Email Kod
                        </label>
                        <Input
                            id="otp"
                            name="otp"
                            type="text"
                            required
                            placeholder="1234"
                            value={formData.otp}
                            onChange={(e) =>
                                setFormData({ ...formData, otp: e.target.value })
                            }
                            className="mb-4 text-center letter-spacing-2"
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
                            {loading ? "Tasdiqlash..." : "Tasdiqlash"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Yuklanmoqda...</div>}>
            <VerifyForm />
        </Suspense>
    )
}
