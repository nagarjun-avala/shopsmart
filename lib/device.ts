// Browser-safe
export function getDeviceId() {
    const key = "device_id";
    let id = localStorage.getItem(key);

    if (!id) {
        if (typeof window !== "undefined" && window.crypto?.randomUUID) {
            id = window.crypto.randomUUID();
        } else {
            // fallback
            id = Math.random().toString(36).slice(2) + Date.now();
        }
        localStorage.setItem(key, id);
    }

    return id;
}


export function getDeviceInfo() {
    if (typeof navigator === "undefined") {
        return {
            userAgent: "server",
            platform: "server",
            browser: "server",
            language: "en",
        };
    }

    const ua = navigator.userAgent || "unknown";
    const platform = navigator.platform || "unknown";
    const language = navigator.language || "unknown";

    let browser = "unknown";
    if (ua.includes("Edg/")) browser = "Edge";
    else if (ua.includes("OPR") || ua.includes("Opera")) browser = "Opera";
    else if (ua.includes("Chrome/") && !ua.includes("Chromium")) browser = "Chrome";
    else if (ua.includes("Chromium")) browser = "Chromium";
    else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Firefox/")) browser = "Firefox";

    return { userAgent: ua, platform, browser, language };
}


