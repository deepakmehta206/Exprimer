import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroData } from '../../core/models/cms.models';
import { BeamFieldHandle, createBeamField } from '../../core/utils/beam-field';
import { parseCtaHref, scrollToAnchor } from '../../core/utils/scroll-to-anchor';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);

  readonly data = input.required<HeroData>();

  readonly brandChars = computed(() => (this.data().brand || 'Exprimer').split(''));

  /** Headline split into words, each word into chars for assemble. */
  readonly headlineWords = computed(() => {
    const text = (this.data().headline || '').trim();
    if (!text) return [] as Array<{ chars: string[] }>;
    return text.split(/(\s+)/).map((token) => ({
      chars: token.split(''),
    }));
  });

  readonly taglineWords = computed(() => {
    const text = (this.data().subheadline || '').trim();
    if (!text) return [] as string[];
    return text.split(/\s+/).filter(Boolean);
  });

  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  @ViewChild('beamCanvas', { static: true }) beamCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx?: gsap.Context;
  private beams?: BeamFieldHandle;
  private onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch' || !this.beams) return;
    const r = this.beamCanvas.nativeElement.getBoundingClientRect();
    this.beams.setPointer(e.clientX - r.left, e.clientY - r.top, true);
  };
  private onLeave = () => this.beams?.setPointer(0, 0, false);

  ngAfterViewInit(): void {
    const el = this.root.nativeElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.beams = createBeamField(this.beamCanvas.nativeElement, {
      intro: !reduce,
      bend: !reduce,
      originX: 0.7,
      alpha: 0.85,
    });
    el.addEventListener('pointermove', this.onMove, { passive: true });
    el.addEventListener('pointerleave', this.onLeave);

    const mm = gsap.matchMedia();
    this.ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          [
            '.hero__brand',
            '.hero__eyebrow',
            '.hero__headline',
            '.hero__tagline',
            '.hero__actions',
            '.hero__visual',
            '.hero__scroll',
            '.hero__char',
            '.hero__word-char',
            '.hero__tag-word',
          ],
          { clearProps: 'all', autoAlpha: 1, y: 0, x: 0, scale: 1, rotate: 0 }
        );
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set('.hero__visual', { scale: 1.1 });
        gsap.set('.hero__char', {
          autoAlpha: 0,
          y: () => gsap.utils.random(48, 110),
          x: () => gsap.utils.random(-36, 36),
          rotate: () => gsap.utils.random(-18, 18),
          scale: () => gsap.utils.random(0.55, 0.85),
        });
        gsap.set('.hero__word-char', { autoAlpha: 0, y: 28, scale: 0.9 });
        gsap.set('.hero__tag-word', { autoAlpha: 0, y: 10 });
        gsap.set(['.hero__eyebrow', '.hero__actions > *', '.hero__scroll'], { autoAlpha: 0, y: 16 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.hero__scrim', { autoAlpha: 0, duration: 0.7 }, 0)
          .to('.hero__visual', { scale: 1, duration: 2, ease: 'power2.out' }, 0)
          .to('.hero__eyebrow', { autoAlpha: 1, y: 0, duration: 0.4 }, 0.1)
          // Brand letters assemble into "Exprimer"
          .to(
            '.hero__char',
            {
              autoAlpha: 1,
              y: 0,
              x: 0,
              rotate: 0,
              scale: 1,
              duration: 0.55,
              stagger: { each: 0.035, from: 'start' },
              ease: 'back.out(1.4)',
            },
            0.2
          )
          // Tagline kicks in as soon as Exprimer is mostly formed (~0.45s into brand)
          .to(
            '.hero__tag-word',
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.2,
              stagger: 0.012,
              ease: 'power2.out',
            },
            '<0.45'
          )
          // Soft glow settle on brand
          .fromTo(
            '.hero__brand',
            { filter: 'drop-shadow(0 0 0 rgba(214,178,94,0))' },
            {
              filter: 'drop-shadow(0 0 22px rgba(214,178,94,0.35))',
              duration: 0.45,
              yoyo: true,
              repeat: 1,
            },
            '<0.35'
          )
          // Headline in parallel
          .to(
            '.hero__word-char',
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.3,
              stagger: 0.012,
              ease: 'power2.out',
            },
            '<0.45'
          )
          .to('.hero__actions > *', { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.06 }, '-=0.1')
          .to('.hero__scroll', { autoAlpha: 1, y: 0, duration: 0.35 }, '-=0.2');

        gsap.to('.hero__visual', {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
        });

        gsap.to('.hero__scroll i', {
          y: 10,
          duration: 1.1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }, el);

    (el as HTMLElement & { __mm?: gsap.MatchMedia }).__mm = mm;
  }

  ngOnDestroy(): void {
    const el = this.root.nativeElement as HTMLElement & { __mm?: gsap.MatchMedia };
    el.removeEventListener('pointermove', this.onMove);
    el.removeEventListener('pointerleave', this.onLeave);
    this.beams?.destroy();
    el.__mm?.revert();
    this.ctx?.revert();
  }

  onCtaClick(event: Event, href: string): void {
    const target = parseCtaHref(href);

    if (target.kind === 'external') {
      return;
    }

    event.preventDefault();

    if (target.kind === 'anchor') {
      if (!scrollToAnchor(target.fragment)) {
        void this.router.navigate(['/home'], { fragment: target.fragment });
      }
      return;
    }

    const commands = target.path.split('/').filter(Boolean);
    void this.router.navigate(['/', ...commands], { fragment: target.fragment }).then(() => {
      if (target.fragment) {
        requestAnimationFrame(() => {
          if (!scrollToAnchor(target.fragment!)) {
            window.setTimeout(() => scrollToAnchor(target.fragment!), 120);
          }
        });
      }
    });
  }
}
