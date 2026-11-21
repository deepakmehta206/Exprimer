import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChecksData } from '../../core/models/cms.models';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-checks-section',
  templateUrl: './checks-section.html',
  styleUrl: './checks-section.scss',
})
export class ChecksSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<ChecksData>();
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    const el = this.root.nativeElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.ctx = gsap.context(() => {
      gsap.from('.checks__intro > *, .checks-group, .check-card', {
        autoAlpha: 0,
        y: 24,
        stagger: 0.05,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
