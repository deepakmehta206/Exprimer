import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CollectionsData } from '../../core/models/cms.models';
import { scrollToAnchor } from '../../core/utils/scroll-to-anchor';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-collections-section',
  templateUrl: './collections-section.html',
  styleUrl: './collections-section.scss',
})
export class CollectionsSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<CollectionsData>();
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  private readonly accents = ['media', 'talent', 'trust', 'media', 'talent', 'trust'];

  ngAfterViewInit(): void {
    const el = this.root.nativeElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.ctx = gsap.context(() => {
      if (reduce) return;
      gsap.from('.collections__intro > *', {
        autoAlpha: 0,
        y: 28,
        stagger: 0.08,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.collections__intro', start: 'top 82%' },
      });
      gsap.from('.collection-card', {
        autoAlpha: 0,
        y: 36,
        scale: 0.97,
        stagger: 0.06,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.collections__grid', start: 'top 80%' },
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  accentFor(index: number): string {
    return this.accents[index % this.accents.length];
  }

  goContact(event: Event): void {
    event.preventDefault();
    scrollToAnchor('contact');
  }

  fallbackImage(index: number): string {
    const images = [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    ];
    return images[index % images.length];
  }
}
