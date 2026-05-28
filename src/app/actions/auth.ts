"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { z } from "zod";
import { authSchema } from "@/lib/schemas";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Secure fallback & auto-generation logic for session secret
const SESSION_SECRET = (() => {
  if (process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }
  
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      if (!envContent.includes("SESSION_SECRET=")) {
        const generatedSecret = crypto.randomBytes(32).toString("hex");
        const prefix = envContent.endsWith("\n") ? "" : "\n";
        fs.appendFileSync(envPath, `${prefix}SESSION_SECRET="${generatedSecret}"\n`);
        console.log("Successfully generated and appended secure SESSION_SECRET to .env file.");
        return generatedSecret;
      }
    }
  } catch (err) {
    console.error("Failed to automatically append SESSION_SECRET to .env:", err);
  }
  
  return "dev-secure-fallback-9c8e8d2e4f0a7b6c5d4e3f2a1b0c9d8e7f6a5b4c";
})();

/**
 * Sign a session payload using HMAC SHA-256.
 */
function signSession(username: string, expires: number): string {
  const payload = JSON.stringify({ username, expires });
  const base64Payload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(base64Payload)
    .digest("base64url");
  return `${base64Payload}.${signature}`;
}

/**
 * Verify a signed session token. Returns username if valid, otherwise null.
 */
function verifySession(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [base64Payload, signature] = parts;
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(base64Payload)
      .digest("base64url");
      
    if (signature !== expectedSignature) {
      return null;
    }
    
    // Parse and verify expiry
    const payload = Buffer.from(base64Payload, "base64url").toString("utf8");
    const data = JSON.parse(payload);
    
    if (data.expires < Date.now()) {
      return null;
    }
    
    return data.username;
  } catch {
    return null;
  }
}

/**
 * Returns the currently active admin session username if valid.
 */
export async function getAdminSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie) return null;

  const username = verifySession(sessionCookie.value);
  if (!username) {
    // Clear invalid session
    cookieStore.delete(COOKIE_NAME);
    return null;
  }
  return username;
}

/**
 * Server action to log in an admin.
 */
export async function loginAction(data: z.infer<typeof authSchema>) {
  const validation = authSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const { username, password } = validation.data;

  try {
    // Find the user in the database
    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false, error: "Invalid username or password" };
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, error: "Invalid username or password" };
    }

    // Set signed HttpOnly session cookie
    const expires = Date.now() + SESSION_DURATION;
    const sessionToken = signSession(username, expires);
    const cookieStore = await cookies();
    cookieStore.set(
      COOKIE_NAME,
      sessionToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(expires),
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Login action error:", error);
    return { success: false, error: "An unexpected error occurred during login" };
  }
}

/**
 * Server action to sign up an admin.
 * Only allowed if no admin accounts exist yet (or via a secret route if logged in as an admin).
 */
export async function signupAction(data: z.infer<typeof authSchema>) {
  const validation = authSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const { username, password } = validation.data;

  try {
    const userCount = await db.user.count();
    
    // If admins already exist, verify that the current requester is an authenticated administrator
    if (userCount > 0) {
      const activeAdmin = await getAdminSession();
      if (!activeAdmin) {
        return { 
          success: false, 
          error: "Unauthorized. Administrator accounts have already been initialized. Direct registration is disabled." 
        };
      }
    }

    // Check if username is already taken
    const existingUser = await db.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return { success: false, error: "Username is already taken" };
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the admin user
    await db.user.create({
      data: {
        username,
        passwordHash,
      },
    });

    // Automatically log the new admin in
    const expires = Date.now() + SESSION_DURATION;
    const sessionToken = signSession(username, expires);
    const cookieStore = await cookies();
    cookieStore.set(
      COOKIE_NAME,
      sessionToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(expires),
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Signup action error:", error);
    return { success: false, error: "An unexpected error occurred during account creation" };
  }
}

/**
 * Server action to log out the admin.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return { success: true };
}

/**
 * Utility to verify if any admin accounts exist.
 * Useful for directing first-time users to the signup page.
 */
export async function anyAdminExists(): Promise<boolean> {
  try {
    const count = await db.user.count();
    return count > 0;
  } catch {
    return false;
  }
}
