export interface User {
    id: string;
    username: string;
    email: string;
    name?: string | null;
    role: "user" | "admin";
    mobile?: string | null;
    countryCode?: string | null;
    createdAt: Date;
    updatedAt: Date;
}