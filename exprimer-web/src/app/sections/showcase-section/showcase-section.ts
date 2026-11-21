import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShowcaseData } from '../../core/models/cms.models';
import { scrollToAnchor } from '../../core/utils/scroll-to-anchor';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-showcase-section',
  templateUrl: './showcase-section.html',
  styleUrl: './showcase-section.scss',
})
export class ShowcaseSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<ShowcaseData>();
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    const el = this.root.nativeElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.showcase-panel').forEach((panel) => {
        gsap.from(panel, {
          autoAlpha: 0,
          y: 36,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 82%' },
        });
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  onCtaClick(event: Event, href?: string): void {
    if (!href) return;
    if (href.startsWith('#') || href.includes('#')) {
      event.preventDefault();
      scrollToAnchor(href.includes('#') ? href.split('#')[1] : href.slice(1));
    }
  }
}
