import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TestimonialsData } from '../../core/models/cms.models';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-testimonials-section',
  templateUrl: './testimonials-section.html',
  styleUrl: './testimonials-section.scss',
})
export class TestimonialsSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<TestimonialsData>();
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    const el = this.root.nativeElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.ctx = gsap.context(() => {
      gsap.from('.testimonials__intro > *, .testimonial-card', {
        autoAlpha: 0,
        y: 26,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
