import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ServicesData } from '../../core/models/cms.models';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-services-section',
  imports: [RouterLink],
  templateUrl: './services-section.html',
  styleUrl: './services-section.scss',
})
export class ServicesSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<ServicesData>();
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  private onMove = (e: PointerEvent) => {
    const strip = (e.target as HTMLElement | null)?.closest?.('.strip') as HTMLElement | null;
    if (!strip) return;
    const r = strip.getBoundingClientRect();
    strip.style.setProperty('--mx', `${e.clientX - r.left}px`);
    strip.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  ngAfterViewInit(): void {
    const el = this.root.nativeElement;
    el.addEventListener('pointermove', this.onMove, { passive: true });

    this.ctx = gsap.context(() => {
      gsap.from('.services__intro > *', {
        autoAlpha: 0,
        y: 36,
        stagger: 0.1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.services__intro', start: 'top 80%' },
      });

      gsap.utils.toArray<HTMLElement>('.strip').forEach((strip) => {
        gsap.from(strip.querySelectorAll('.strip__index, .strip__copy, .strip__cta'), {
          autoAlpha: 0,
          y: 40,
          stagger: 0.08,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: strip, start: 'top 78%' },
        });
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.root.nativeElement.removeEventListener('pointermove', this.onMove);
    this.ctx?.revert();
  }

  fallbackImage(index: number): string {
    const images = [
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
    ];
    return images[index % images.length];
  }
}
