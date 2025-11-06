// hooks/useSessions.ts
import { useCallback, useState } from "react";
import type { Session } from "@/context/AuthProvider";

export function useSessionsClient() {
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchSessions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/sessions", { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch");
            const data: Session[] = await res.json();
            setSessions(data);
            return data;
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Unknown");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const revokeSession = useCallback(async (id: string) => {
        const res = await fetch(`/api/sessions/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to revoke");
        // optimistic update
        setSessions(prev => prev.filter(s => s.id !== id));
    }, []);

    const logoutOthers = useCallback(async () => {
        const res = await fetch("/api/auth/logout-others", {
            method: "POST",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed");
        // refetch session list
        await fetchSessions();
    }, [fetchSessions]);

    const logoutAll = useCallback(async () => {
        const res = await fetch("/api/auth/logout-all", {
            method: "POST",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed");
        setSessions([]);
    }, []);

    return {
        sessions,
        loading,
        error,
        fetchSessions,
        revokeSession,
        logoutOthers,
        logoutAll,
    };
}

