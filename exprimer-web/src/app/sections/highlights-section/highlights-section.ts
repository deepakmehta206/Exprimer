import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HighlightsData } from '../../core/models/cms.models';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-highlights-section',
  templateUrl: './highlights-section.html',
  styleUrl: './highlights-section.scss',
})
export class HighlightsSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<HighlightsData>();
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;
  private readonly accents = ['talent', 'media', 'trust', 'talent'];

  ngAfterViewInit(): void {
    const el = this.root.nativeElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.ctx = gsap.context(() => {
      gsap.from('.highlights__intro > *, .highlight-card', {
        autoAlpha: 0,
        y: 28,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  accentFor(i: number, override?: string): string {
    return override || this.accents[i % this.accents.length];
  }
}
