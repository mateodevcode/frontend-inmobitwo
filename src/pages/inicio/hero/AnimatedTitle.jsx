import { useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, useGSAP);

const AnimatedTitle = ({
  texts = [],
  as: Tag = "h1",
  className = "",
  wrapperClassName = "",
  holdDuration = 1.6,
  fallDuration = 0.7,
  exitDuration = 0.4,
  stagger = 0.03,
  fallEase = "back.out(1.4)",
}) => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const safeTexts = texts.length > 0 ? texts : [""];

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Respeta a quienes desactivaron animaciones a nivel sistema
      // operativo, y de paso nos ahorra correr el loop para esos usuarios.
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        containerRef.current.textContent = safeTexts[0];
        return;
      }

      let cancelled = false;
      let isPaused = false;
      let i = 0;
      let currentSplit = null;
      let activeTl = null;

      const playNext = () => {
        if (cancelled || !containerRef.current) return;

        containerRef.current.textContent = safeTexts[i];

        currentSplit = new SplitText(containerRef.current, {
          type: "chars",
          charsClass: "inline-block will-change-transform",
        });

        gsap.set(currentSplit.chars, {
          opacity: 0,
          y: -40,
          rotation: () => gsap.utils.random(-20, 20),
        });

        activeTl = gsap.timeline({
          paused: isPaused,
          onComplete: () => {
            currentSplit.revert();
            if (cancelled) return;
            i = (i + 1) % safeTexts.length;
            playNext();
          },
        });

        activeTl
          .to(currentSplit.chars, {
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: fallDuration,
            ease: fallEase,
            stagger,
          })
          .to(
            currentSplit.chars,
            {
              opacity: 0,
              y: 30,
              duration: exitDuration,
              ease: "power1.in",
              stagger: stagger * 0.6,
            },
            `+=${holdDuration}`,
          );
      };

      // Pausa/reanuda según visibilidad de la pestaña
      const handleVisibility = () => {
        isPaused = document.hidden;
        activeTl?.paused(isPaused);
      };
      document.addEventListener("visibilitychange", handleVisibility);

      // Pausa/reanuda según si el título está en el viewport
      const observer = new IntersectionObserver(
        ([entry]) => {
          isPaused = !entry.isIntersecting || document.hidden;
          activeTl?.paused(isPaused);
        },
        { threshold: 0.1 },
      );
      if (wrapperRef.current) observer.observe(wrapperRef.current);

      playNext();

      // Este cleanup sí corre garantizado, porque dependencies: [] hace
      // que useGSAP solo desmonte/revierta al desmontar el componente.
      return () => {
        cancelled = true;
        document.removeEventListener("visibilitychange", handleVisibility);
        observer.disconnect();
        if (activeTl) activeTl.kill();
        if (currentSplit) currentSplit.revert();
      };
    },
    { scope: containerRef, dependencies: [] },
  );

  return (
    <div
      ref={wrapperRef}
      className={`overflow-hidden w-full ${wrapperClassName}`}
    >
      <Tag ref={containerRef} className={className} />
    </div>
  );
};

export default AnimatedTitle;
