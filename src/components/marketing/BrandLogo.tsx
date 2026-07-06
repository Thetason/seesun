import Image from "next/image";

type BrandLogoProps = {
    readonly className?: string;
    readonly compact?: boolean;
    readonly surface?: "light" | "dark";
    readonly showText?: boolean;
};

export function BrandLogo({
    className,
    compact = false,
    surface = "light",
    showText = true,
}: BrandLogoProps) {
    const markSize = compact ? 34 : 42;
    const textColor = surface === "light" ? "#111111" : "#ffffff";

    return (
        <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: compact ? "8px" : "10px" }}>
            <Image
                src="/brand/seesun-mark.png"
                alt=""
                width={541}
                height={487}
                sizes={`${markSize}px`}
                priority={!compact}
                style={{ width: `${markSize}px`, height: "auto", display: "block" }}
            />
            {showText ? (
                <span
                    style={{
                        color: textColor,
                        fontWeight: 900,
                        letterSpacing: 0,
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                    }}
                >
                    SEE:SUN
                </span>
            ) : null}
        </span>
    );
}
