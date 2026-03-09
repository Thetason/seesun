"use client";

import type { ComponentProps, ReactNode } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScroll({ children }: { children: ReactNode }) {
    const lenisChildren = children as unknown as ComponentProps<typeof ReactLenis>['children'];

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
            {lenisChildren}
        </ReactLenis>
    );
}
