import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, input, signal } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrustedData } from '../../core/models/cms.models';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-trusted-section',
  templateUrl: './trusted-section.html',
  styleUrl: './trusted-section.scss',
})
export class TrustedSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<TrustedData>();
  readonly reduceMotion = signal(false);

  /** Duplicate strip for seamless infinite marquee */
  readonly loopItems = computed(() => {
    const items = this.data().items || [];
    if (!items.length) return [];
    return [...items, ...items, ...items];
  });

  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    this.reduceMotion.set(matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = this.root.nativeElement;

    // Pin sections above can desync ScrollTrigger — refresh after layout settles
    requestAnimationFrame(() => ScrollTrigger.refresh());
    window.setTimeout(() => ScrollTrigger.refresh(), 500);

    if (this.reduceMotion()) return;

    this.ctx = gsap.context(() => {
      // Soft entrance only — never leave content stuck at opacity 0
      gsap.fromTo(
        '.trusted__intro > *',
        { autoAlpha: 0.35, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.65,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
