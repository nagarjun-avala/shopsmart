"use client";
import { getDeviceId, getDeviceInfo } from "@/lib/device";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; name: string; email: string; role?: string };
export type Session = {
    id: string;
    deviceId: string;
    userAgent?: string;
    platform?: string;
    browser?: string;
    lastUsed: string;
    revoked: boolean
    ipAddress?: string;
    createdAt: string;
    current?: boolean; // calculated client-side
};

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchSessions: () => Promise<Session[]>;
    logoutDevice: (sessionId: string) => Promise<void>;
    logoutOthers: () => Promise<void>;
    logoutAll: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function me() {
        try {
            const res = await fetch("/api/auth/me", { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user ?? null);
            } else {
                setUser(null)
            };
        } catch { setUser(null); }
        setLoading(false);
    }

    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        setUser(null);
        // do not remove deviceId (we want device persist for future)
    };

    useEffect(() => {
        // call async function inside an IIFE so setState runs asynchronously
        (async () => {
            await me();
        })();
    }, []);

    // silent refresh loop (14 minutes)
    useEffect(() => {
        if (!user) return;
        const id = setInterval(async () => {
            try {
                const res = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
                if (!res.ok) {
                    await logout();
                }
            } catch { await logout(); }
        }, 14 * 60 * 1000);
        return () => clearInterval(id);
    }, [user]);

    const login = async (email: string, password: string) => {
        const deviceId = getDeviceId();
        const info = getDeviceInfo();

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ identifier: email, password, deviceId, ...info }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: "Login failed" }));
            throw new Error(err.error || "Invalid credentials");
        }
        const payload = await res.json();
        // server should return user object in payload.user
        setUser(payload.user ?? null);
    };


    const fetchSessions = async (): Promise<Session[]> => {
        const res = await fetch("/api/sessions", { credentials: "include" });
        if (!res.ok) return [];
        return res.json();
    };

    const logoutDevice = async (sessionId: string) => {
        const res = await fetch(`/api/sessions/${sessionId}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to revoke session");
        // if the deleted session is current device, server should also clear refresh cookie - handle client
        const body = await res.json().catch(() => null);
        if (body?.revokedCurrent) {
            setUser(null);
        }
    };

    const logoutOthers = async () => {
        await fetch("/api/auth/logout-others", { method: "POST", credentials: "include" });
    };

    const logoutAll = async () => {
        await fetch("/api/auth/logout-all", { method: "POST", credentials: "include" });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            fetchSessions,
            logoutDevice,
            logoutOthers,
            logoutAll
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
