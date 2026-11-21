import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, input, signal } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RolesData } from '../../core/models/cms.models';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-roles-section',
  templateUrl: './roles-section.html',
  styleUrl: './roles-section.scss',
})
export class RolesSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<RolesData>();
  readonly reduceMotion = signal(false);
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
    requestAnimationFrame(() => ScrollTrigger.refresh());
    if (this.reduceMotion()) return;
    this.ctx = gsap.context(() => {
      gsap.from('.roles__intro > *', {
        autoAlpha: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
