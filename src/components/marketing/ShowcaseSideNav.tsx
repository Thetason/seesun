"use client";

type ShowcaseSideNavProps = {
    readonly labels: readonly string[];
    readonly active: number;
    readonly visible: boolean;
    readonly theme?: "light" | "dark";
    readonly onJump: (index: number) => void;
};

export default function ShowcaseSideNav({ labels, active, visible, theme = "dark", onJump }: ShowcaseSideNavProps) {
    const isDark = theme === "dark";
    const idleTick = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.22)";
    const labelColor = isDark ? "rgba(255,255,255,0.9)" : "rgba(17,17,17,0.78)";

    return (
        <nav
            className="showcase-sidenav"
            aria-label="섹션 이동"
            aria-hidden={!visible}
            style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
        >
            {labels.map((label, i) => (
                <button
                    key={label}
                    type="button"
                    className="showcase-sidenav__item"
                    aria-label={label}
                    aria-current={i === active}
                    onClick={() => onJump(i)}
                >
                    <span className="showcase-sidenav__label" style={{ color: labelColor }}>{label}</span>
                    <span
                        className="showcase-sidenav__tick"
                        style={{ background: i === active ? "#FE7502" : idleTick, width: i === active ? 34 : 20 }}
                    />
                </button>
            ))}

            <style jsx>{`
                .showcase-sidenav {
                    position: fixed;
                    right: 24px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 70;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 15px;
                    transition: opacity 0.4s ease;
                }

                .showcase-sidenav__item {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 12px;
                    background: none;
                    border: none;
                    padding: 5px 0;
                    cursor: pointer;
                }

                .showcase-sidenav__label {
                    font-size: 0.78rem;
                    font-weight: 700;
                    white-space: nowrap;
                    opacity: 0;
                    transform: translateX(6px);
                    transition: opacity 0.25s ease, transform 0.25s ease;
                }

                .showcase-sidenav__item:hover .showcase-sidenav__label,
                .showcase-sidenav__item[aria-current="true"] .showcase-sidenav__label {
                    opacity: 1;
                    transform: translateX(0);
                }

                .showcase-sidenav__tick {
                    height: 3px;
                    border-radius: 2px;
                    transition: width 0.3s ease, background 0.3s ease;
                }

                .showcase-sidenav__item:hover .showcase-sidenav__tick {
                    width: 34px;
                }

                @media (max-width: 860px) {
                    .showcase-sidenav {
                        display: none;
                    }
                }
            `}</style>
        </nav>
    );
}
