import { Injectable } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Injectable({ providedIn: 'root' })
export class AnimationService {
  createContext(scope: HTMLElement): gsap.Context {
    return gsap.context(() => undefined, scope);
  }

  revealOnScroll(root: HTMLElement, selector = '[data-reveal]'): void {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isMotion: '(prefers-reduced-motion: no-preference)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };

        if (reduceMotion) {
          gsap.set(root.querySelectorAll(selector), { clearProps: 'all', autoAlpha: 1, y: 0 });
          return;
        }

        gsap.utils.toArray<HTMLElement>(root.querySelectorAll(selector)).forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 48,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      },
      root
    );

    (root as HTMLElement & { __mm?: gsap.MatchMedia }).__mm = mm;
  }

  killScoped(root: HTMLElement): void {
    const withMm = root as HTMLElement & { __mm?: gsap.MatchMedia };
    withMm.__mm?.revert();
    ScrollTrigger.getAll()
      .filter((t) => root.contains(t.trigger as Node))
      .forEach((t) => t.kill());
  }
}
