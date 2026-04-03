"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

declare global {
    interface Window {
        clarity?: (...args: unknown[]) => void;
    }
}

const RESTRICTED_PREFIXES = ["/admin", "/dashboard", "/mission"];

function isRestrictedPath(pathname: string) {
    return RESTRICTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default function ClarityAnalytics() {
    const pathname = usePathname();
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    const [scriptReady, setScriptReady] = useState(false);
    const restricted = pathname ? isRestrictedPath(pathname) : false;

    useEffect(() => {
        if (!scriptReady || typeof window === "undefined" || typeof window.clarity !== "function") {
            return;
        }

        if (restricted) {
            window.clarity("consent", false);
            return;
        }

        window.clarity("consent");
    }, [restricted, scriptReady]);

    if (!projectId) {
        return null;
    }

    if (restricted && !scriptReady) {
        return null;
    }

    return (
        <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            onReady={() => setScriptReady(true)}
        >
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${projectId}");
            `}
        </Script>
    );
}
