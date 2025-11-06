"use server";
import bcrypt from "bcrypt";
/**
 * 
 * @param plain Plain password
 * @returns Hashed password
 */

export async function hashPassword(plain: string) {
    return bcrypt.hash(plain, 10);
}

/**
 * 
 * @param plain plain password
 * 
 * @param hash Hashed password from db
 * @returns boolean
 */

export async function comparePassword(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
}
