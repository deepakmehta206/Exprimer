import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input, signal } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaqData } from '../../core/models/cms.models';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-faq-section',
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.scss',
})
export class FaqSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<FaqData>();
  readonly openIndex = signal<number | null>(0);
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    const el = this.root.nativeElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.ctx = gsap.context(() => {
      gsap.from('.faq__intro > *, .faq-item', {
        autoAlpha: 0,
        y: 20,
        stagger: 0.04,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
