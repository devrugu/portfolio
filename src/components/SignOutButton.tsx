"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="bg-accent text-on-primary font-bold py-2 px-4 rounded-lg hover:bg-accent-hover transition-colors"
    >
      Sign Out
    </button>
  );
}