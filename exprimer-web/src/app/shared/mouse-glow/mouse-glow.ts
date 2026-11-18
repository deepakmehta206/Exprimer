import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-mouse-glow',
  template: `<div class="mouse-glow" #glow aria-hidden="true"></div>`,
  styles: [
    `
      .mouse-glow {
        position: fixed;
        left: 0;
        top: 0;
        width: 380px;
        height: 380px;
        margin: -190px 0 0 -190px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        background: radial-gradient(
          closest-side,
          rgba(214, 178, 94, 0.14),
          rgba(46, 196, 182, 0.06),
          transparent 70%
        );
        opacity: 0;
        transition: opacity 0.35s ease;
        mix-blend-mode: screen;
        will-change: transform;
      }

      .mouse-glow.is-on {
        opacity: 1;
      }

      @media (pointer: coarse), (prefers-reduced-motion: reduce) {
        .mouse-glow {
          display: none;
        }
      }
    `,
  ],
})
export class MouseGlow implements AfterViewInit, OnDestroy {
  @ViewChild('glow', { static: true }) glow!: ElementRef<HTMLDivElement>;
  private onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const el = this.glow.nativeElement;
    el.classList.add('is-on');
    el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  };
  private onLeave = () => this.glow.nativeElement.classList.remove('is-on');

  ngAfterViewInit(): void {
    window.addEventListener('pointermove', this.onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', this.onLeave);
  }

  ngOnDestroy(): void {
    window.removeEventListener('pointermove', this.onMove);
    document.documentElement.removeEventListener('mouseleave', this.onLeave);
  }
}
