import { Component, HostListener, OnDestroy, OnInit, input, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.html',
  styleUrl: './scroll-top.scss',
})
export class ScrollTop implements OnInit, OnDestroy {
  /** Show after this many pixels scrolled */
  readonly threshold = input(420);
  readonly label = input('Back to top');
  /** Place above WhatsApp FAB on the right by default */
  readonly corner = input<'br' | 'bl'>('br');

  readonly visible = signal(false);

  private ticking = false;

  ngOnInit(): void {
    this.updateVisibility();
  }

  ngOnDestroy(): void {
    this.ticking = false;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.updateVisibility();
      this.ticking = false;
    });
  }

  scrollUp(): void {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  private updateVisibility(): void {
    this.visible.set(window.scrollY > this.threshold());
  }
}
