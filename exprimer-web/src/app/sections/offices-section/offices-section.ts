import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OfficesData } from '../../core/models/cms.models';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-offices-section',
  templateUrl: './offices-section.html',
  styleUrl: './offices-section.scss',
})
export class OfficesSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<OfficesData>();
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    const el = this.root.nativeElement;
    this.ctx = gsap.context(() => {
      gsap.from('.office', {
        autoAlpha: 0,
        y: 30,
        stagger: 0.12,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%' },
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
