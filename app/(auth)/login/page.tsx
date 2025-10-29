'use client';

import React, { useState } from "react";
import CustomButton from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import { Alert } from "@mui/material";
import { setCurrentUser } from "@/lib/auth";
export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
     const [success, setSuccess] = useState<string>("");
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Login failed');
            } else {
                setSuccess("Login successful!");
                // persist a simple currentUser value (email) for the client-side todo UI
                if (data?.user?.email) {
                    setCurrentUser(data.user.email);
                }
                router.push("/");
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);


        }


    }
    return (
        <form onSubmit={handleSubmit} aria-label="login-form" className="max-w-md mx-auto mt-8 space-y-4">
            <h2>Login</h2>

            {error && (
                <div role="alert" style={{ color: "#b00020", marginBottom: 8 }}>
                    {error}
                </div>
            )}

            <Input
                label="Email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                type="email"
                autoComplete="email"
            />

            <Input
                label="Password"
                type="password"
                required
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                autoComplete="current-password"
            />

            <CustomButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
            >
                {loading ? "Logging in..." : "Login"}
            </CustomButton>

             {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
               {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </form>
    );

}