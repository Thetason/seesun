"use client";

import type { CSSProperties, ReactNode } from "react";
import { trackKickoff } from "@/lib/kickoff";
import { KICKOFF_CTA_LABEL, SMARTPLACE_URL } from "@/lib/site";

// Tracked SmartPlace booking link. Stays a real <a> (crawlable, accessible);
// the click beacon fires before navigation via trackKickoff's sendBeacon.
// `source` answers "which page/article produced this booking click" in the
// analytics dashboard, e.g. "landing:vocal-correction", "content:why-throat-tightens".
export function KickoffCtaLink({
  source,
  className,
  style,
  children,
}: {
  source: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <a
      className={className}
      style={style}
      href={SMARTPLACE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackKickoff(source)}
    >
      {children ?? KICKOFF_CTA_LABEL}
    </a>
  );
}
