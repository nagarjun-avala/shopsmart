"use client";
import React, { useEffect } from "react";
import { useSessionsClient } from "@/hooks/useSessions";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "./ui/button";

export default function ManageDevices() {
    const { sessions, fetchSessions, revokeSession, logoutOthers, logoutAll, loading } = useSessionsClient();
    const { logout } = useAuth();

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    return (
        <div className="p-6 max-w-4xl">
            <h3 className="text-lg font-semibold mb-4">Devices & Sessions</h3>

            <div className="mb-4 flex gap-2">
                <button
                    onClick={async () => {
                        try {
                            await logoutOthers();
                            await fetchSessions();
                        } catch (e) { console.error(e); }
                    }}
                    className="px-3 py-2 bg-amber-600 text-white rounded"
                >
                    Log out other devices
                </button>

                <button
                    onClick={async () => {
                        try {
                            await logoutAll();
                            // if logoutAll logs out current device server should clear cookie; also force client logout
                            await logout();
                        } catch (e) { console.error(e); }
                    }}
                    className="px-3 py-2 bg-red-600 text-white rounded"
                >
                    Log out all devices
                </button>
            </div>

            <div className="border rounded overflow-hidden">
                <table className="w-full">
                    <thead >
                        <tr>
                            <th className="text-left p-3">Device</th>
                            <th className="text-left p-3">Last used</th>
                            <th className="text-left p-3">Created</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr><td colSpan={4} className="p-3">Loading…</td></tr>
                        )}
                        {!loading && sessions.length === 0 && (
                            <tr><td colSpan={4} className="p-3">No active sessions.</td></tr>
                        )}
                        {sessions.map(s => (
                            <tr key={s.id} className="border-t">
                                <td className="p-3">
                                    <div className="font-medium">
                                        {s.platform ?? "Unknown"} / {s.browser ?? "Unknown"}
                                        {s.current && <span className="ml-2 text-sm text-green-600">Current device</span>}
                                    </div>
                                    <div className="text-xs text-gray-500">{s.userAgent}</div>
                                    <div className="text-xs text-gray-400">{s.ipAddress}</div>
                                </td>

                                <td className="p-3">{new Date(s.lastUsed).toLocaleString()}</td>
                                <td className="p-3">{new Date(s.createdAt).toLocaleString()}</td>

                                <td className="p-3">
                                    {s.current ? (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await logout(); // logs out current device
                                                } catch (e) { console.error(e); }
                                            }}
                                            className="px-2 py-1 rounded bg-gray-800 text-white text-sm"
                                        >
                                            Sign out
                                        </button>
                                    ) : (
                                        <Button
                                            onClick={async () => {
                                                try {
                                                    await revokeSession(s.id);
                                                } catch (e) { console.error(e); }
                                            }}
                                            className="px-2 py-1 rounded text-sm cursor-pointer"
                                        >
                                            Revoke
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
