import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IndustryMixData } from '../../core/models/cms.models';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-industry-mix-section',
  templateUrl: './industry-mix-section.html',
  styleUrl: './industry-mix-section.scss',
})
export class IndustryMixSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<IndustryMixData>();
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    const el = this.root.nativeElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.ctx = gsap.context(() => {
      gsap.from('.industry-mix__panel > *', {
        autoAlpha: 0,
        y: 24,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
      gsap.from('.industry-bar__fill', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 75%' },
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
