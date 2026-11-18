import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StatsData } from '../../core/models/cms.models';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-stats-section',
  templateUrl: './stats-section.html',
  styleUrl: './stats-section.scss',
})
export class StatsSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<StatsData>();
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    const el = this.root.nativeElement;
    this.ctx = gsap.context(() => {
      gsap.from('.stat', {
        autoAlpha: 0,
        y: 36,
        stagger: 0.12,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
