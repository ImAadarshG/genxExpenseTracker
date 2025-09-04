"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { dbHelpers } from "@/lib/db";

const publicPaths = ["/login", "/register"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useStore();

  useEffect(() => {
    // Create demo user if no users exist
    const createDemoUser = async () => {
      try {
        const users = await dbHelpers.db.users.toArray();
        if (users.length === 0) {
          await dbHelpers.registerUser({
            name: "Demo User",
            email: "demo@example.com",
            password: "demo123",
          });
          console.log("Demo user created: demo@example.com / demo123");
        }
      } catch (error) {
        console.error("Error creating demo user:", error);
      }
    };

    createDemoUser();
  }, []);

  useEffect(() => {
    // Authentication is REQUIRED - users must login to access the app
    const requireAuth = true; // ← LOGIN IS REQUIRED
    
    if (requireAuth) {
      const isPublicPath = publicPaths.includes(pathname);
      
      if (!isAuthenticated && !isPublicPath) {
        router.push("/login");
      } else if (isAuthenticated && isPublicPath) {
        router.push("/");
      }
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
