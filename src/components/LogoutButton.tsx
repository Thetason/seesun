"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={className}
            style={style}
        >
            로그아웃
        </button>
    );
}
