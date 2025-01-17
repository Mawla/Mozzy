"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions/auth";

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={async () => {
        try {
          await signOut();
        } catch (error) {
          console.error("Error signing out:", error);
        }
      }}
    >
      Sign Out
    </Button>
  );
}
