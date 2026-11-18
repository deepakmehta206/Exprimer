import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroData } from '../../core/models/cms.models';
import { BeamFieldHandle, createBeamField } from '../../core/utils/beam-field';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<HeroData>();
  readonly brandChars = computed(() => (this.data().brand || 'Exprimer').split(''));
  readonly headlineParts = computed(() => {
    const text = this.data().headline || '';
    const parts = text.split(/(—|-)/);
    if (parts.length < 3) {
      return [{ text, accent: false }];
    }
    const dash = parts[1];
    return [
      { text: parts[0] + dash, accent: false },
      { text: parts.slice(2).join(''), accent: true },
    ];
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
          ['.hero__brand', '.hero__eyebrow', '.hero__headline', '.hero__actions', '.hero__visual', '.hero__scroll'],
          { clearProps: 'all', autoAlpha: 1, y: 0, scale: 1 }
        );
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set('.hero__visual', { scale: 1.1 });
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.hero__scrim', { autoAlpha: 0, duration: 1 })
          .to('.hero__visual', { scale: 1, duration: 2.2, ease: 'power2.out' }, 0)
          .from('.hero__char', { yPercent: 120, autoAlpha: 0, stagger: 0.04, duration: 0.9 }, 0.2)
          .from('.hero__eyebrow', { autoAlpha: 0, y: 14, duration: 0.55 }, 0.5)
          .from('.hero__headline', { autoAlpha: 0, y: 24, duration: 0.8 }, 0.65)
          .from('.hero__actions > *', { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.5 }, 0.9)
          .from('.hero__scroll', { autoAlpha: 0, duration: 0.5 }, 1.1);

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

  isInternal(href: string): boolean {
    return href.startsWith('/') && !href.startsWith('/#');
  }
}
