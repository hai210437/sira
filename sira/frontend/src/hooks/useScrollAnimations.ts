import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
    "fade-up":    { from: { opacity: 0, y: 50 },  to: { opacity: 1, y: 0 } },
    "fade-in":    { from: { opacity: 0 },          to: { opacity: 1 } },
    "slide-left": { from: { opacity: 0, x: -60 },  to: { opacity: 1, x: 0 } },
    "slide-right":{ from: { opacity: 0, x: 60 },   to: { opacity: 1, x: 0 } },
    "scale-in":   { from: { opacity: 0, scale: 0.92 }, to: { opacity: 1, scale: 1 } },
} as const;

export function useScrollAnimations() {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        // Small delay to ensure DOM is painted before measuring positions
        const rafId = requestAnimationFrame(() => {
            const tweens: gsap.core.Tween[] = [];

            // Single query for all animated elements
            const allAnimated = document.querySelectorAll("[data-animate]");
            allAnimated.forEach((el) => {
                const type = el.getAttribute("data-animate") as string;

                if (type === "stagger") {
                    const children = el.children;
                    if (children.length === 0) return;
                    tweens.push(
                        gsap.fromTo(children,
                            { opacity: 0, y: 30 },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                stagger: 0.12,
                                ease: "power2.out",
                                scrollTrigger: {
                                    trigger: el,
                                    start: "top 88%",
                                    toggleActions: "play none none none",
                                },
                            }
                        )
                    );
                    return;
                }

                const config = ANIMATION_CONFIG[type as keyof typeof ANIMATION_CONFIG];
                if (!config) return;

                tweens.push(
                    gsap.fromTo(el, config.from, {
                        ...config.to,
                        duration: 0.75,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 88%",
                            toggleActions: "play none none none",
                        },
                    })
                );
            });
        });

        return () => {
            cancelAnimationFrame(rafId);
            ScrollTrigger.getAll().forEach(t => t.kill());
            initialized.current = false;
        };
    }, []);
}
