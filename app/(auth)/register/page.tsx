'use client';
import React, { useState } from "react";
import Input from "@/components/ui/Input";

import { useRouter } from "next/navigation";
import CustomButton from "@/components/ui/Button";
import { Container, Typography, Alert } from "@mui/material";



export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string>("");

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);
        
        // Client-side validation
        if (!email || !password || !name) {
            setError('All fields are required');
            setLoading(false);
            return;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            
            
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            // try to parse JSON safely
            let data: Record<string, unknown> | null = null;
            try {
                data = await response.json();
            } catch (err) {
                console.warn('No JSON in response', err);
            }

           
            
            if (!response.ok) {
                const maybeMessage = data && (data as Record<string, unknown>).message;
                const msg = typeof maybeMessage === 'string' ? maybeMessage : `Registration failed (${response.status})`;
                console.error('[Register] Failed:', msg, data);
                setError(msg);
            } else {
                console.log('[Register] Success:', data);
                setSuccess("Registration successful!");
                // redirect to login after a short delay so user sees success message
                setTimeout(() => router.push('/login'), 1000);
            }
        } catch (error) {
            console.error('[Register] Network/parsing error:', error);
            setError('An unexpected error occurred. Please try again.');
        }
        setLoading(false);
    }

    return (

        <Container maxWidth="xs">
            <form onSubmit={handleRegister} aria-label="register-form" className="max-w-md mx-auto mt-8 space-y-4">
                <Typography variant="h5" gutterBottom>Register</Typography>
                <Input label="name"
                    required placeholder="name"
                    value={name}
                    onChange={e => setName((e.target as HTMLInputElement).value)}
                />

                <Input
                    label="email"
                    required placeholder="email"
                    value={email}
                    onChange={e => setEmail((e.target as HTMLInputElement).value)} />
                <Input
                    label="password"
                    type="password"
                    required
                    placeholder="password"
                    value={password}
                    onChange={e => setPassword((e.target as HTMLInputElement).value)} />
                <CustomButton type="submit" variant="contained" color="primary" fullWidth disabled={loading}>{loading ? 'Registering...' : 'Register'}</CustomButton>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                }
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}


            </form>
        </Container>
    )
}